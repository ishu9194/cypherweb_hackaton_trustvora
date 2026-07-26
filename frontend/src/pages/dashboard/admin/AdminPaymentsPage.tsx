import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { ErrorState } from "@/components/states/ErrorState";
import { toast } from "@/components/ui/toaster";
import { adminService, type Payout } from "@/services/api/admin";
import { useAsync } from "@/hooks/useAsync";
import { formatCurrency, formatDate } from "@/lib/utils";

export function AdminPaymentsPage() {
  const { data: revenue, isLoading: revenueLoading, error: revenueError, refetch: refetchRevenue } = useAsync(() => adminService.getRevenue(), []);
  const { data: payouts, isLoading: payoutsLoading, error: payoutsError, refetch: refetchPayouts } = useAsync(() => adminService.getPayouts(), []);
  const { data: refunds, isLoading: refundsLoading, error: refundsError, refetch: refetchRefunds } = useAsync(() => adminService.getRefunds(), []);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const revenueList = revenue ?? [];
  const payoutsList = payouts ?? [];
  const refundsList = refunds ?? [];

  const totalRevenue = revenueList.reduce((s, r) => s + r.revenue, 0);
  const totalPayouts = payoutsList.reduce((s, p) => s + p.amount, 0);
  const pendingRefunds = refundsList.filter((r) => r.status === "pending").length;

  const resolveRefund = async (id: string, status: "approved" | "rejected") => {
    setPendingId(id);
    try {
      await adminService.decideRefund(id, status);
      toast.success(`Refund request ${status}`);
      refetchRefunds();
    } catch {
      toast.error("Failed to update refund decision");
    } finally {
      setPendingId(null);
    }
  };

  const payoutColumns: DataGridColumn<Payout>[] = [
    { key: "lawyer", header: "Lawyer", render: (p) => p.lawyer, sortValue: (p) => p.lawyer },
    { key: "date", header: "Date", render: (p) => formatDate(p.date), sortValue: (p) => p.date },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <Badge variant={p.status === "processed" ? "success" : "warning"} className="capitalize">
          {p.status}
        </Badge>
      ),
    },
    { key: "amount", header: "Amount", render: (p) => formatCurrency(p.amount), sortValue: (p) => p.amount, align: "right" },
  ];

  if (revenueError && payoutsError && refundsError) {
    return (
      <ErrorState
        description="Failed to load payments data"
        onRetry={() => {
          refetchRevenue();
          refetchPayouts();
          refetchRefunds();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Payments</h2>
        <p className="mt-1 text-sm text-muted-foreground">Platform revenue, lawyer payouts, and refund management.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-xs text-muted-foreground">Total revenue (6mo)</p>
            <p className="mt-1 font-display text-xl font-bold text-foreground">{revenueLoading ? "…" : formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted-foreground">Lawyer payouts</p>
            <p className="mt-1 font-display text-xl font-bold text-foreground">{payoutsLoading ? "…" : formatCurrency(totalPayouts)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs text-muted-foreground">Pending refunds</p>
            <p className="mt-1 font-display text-xl font-bold text-warning">{refundsLoading ? "…" : pendingRefunds}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Revenue</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {revenueError ? (
            <ErrorState description={revenueError} onRetry={refetchRevenue} className="h-full" />
          ) : revenueLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading revenue graph…</div>
          ) : revenueList.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No revenue records found.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueList}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <RechartsTooltip
                  contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => formatCurrency(Number(v))}
                />
                <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Refund Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {refundsError ? (
            <ErrorState description={refundsError} onRetry={refetchRefunds} />
          ) : refundsLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading refunds…</p>
          ) : refundsList.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No refund requests available.</p>
          ) : (
            refundsList.map((r) => (
              <div key={r.id} className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {r.client} · {formatCurrency(r.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">{r.reason}</p>
                </div>
                {r.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={pendingId === r.id}
                      onClick={() => resolveRefund(r.id, "approved")}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-danger hover:bg-danger/10"
                      disabled={pendingId === r.id}
                      onClick={() => resolveRefund(r.id, "rejected")}
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                ) : (
                  <Badge variant={r.status === "approved" ? "success" : "danger"} className="capitalize">
                    {r.status}
                  </Badge>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lawyer Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          {payoutsError ? (
            <ErrorState description={payoutsError} onRetry={refetchPayouts} />
          ) : payoutsLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading payouts…</p>
          ) : (
            <DataGrid columns={payoutColumns} rows={payoutsList} getRowId={(p) => p.id} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPaymentsPage;
