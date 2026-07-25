import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { toast } from "@/components/ui/toaster";
import { formatCurrency, formatDate } from "@/lib/utils";

const REVENUE = [
  { month: "Feb", revenue: 420000 }, { month: "Mar", revenue: 510000 }, { month: "Apr", revenue: 480000 },
  { month: "May", revenue: 620000 }, { month: "Jun", revenue: 590000 }, { month: "Jul", revenue: 710000 },
];

interface Payout { id: string; lawyer: string; amount: number; status: "processed" | "pending"; date: string }
const PAYOUTS: Payout[] = [
  { id: "po-1", lawyer: "Adv. Priya Sharma", amount: 34200, status: "processed", date: "2026-07-20T00:00:00" },
  { id: "po-2", lawyer: "Adv. Kavita Desai", amount: 51200, status: "processed", date: "2026-07-20T00:00:00" },
  { id: "po-3", lawyer: "Adv. Vikram Nair", amount: 12800, status: "pending", date: "2026-07-22T00:00:00" },
];

interface RefundRequest { id: string; client: string; amount: number; reason: string; status: "pending" | "approved" | "rejected" }
const initialRefunds: RefundRequest[] = [
  { id: "rf-1", client: "Farhan Ali", amount: 1200, reason: "Lawyer unavailable for scheduled slot", status: "pending" },
  { id: "rf-2", client: "Neha Kulkarni", amount: 700, reason: "Booked wrong consultation type", status: "pending" },
];

export function AdminPaymentsPage() {
  const [refunds, setRefunds] = useState(initialRefunds);
  const totalRevenue = REVENUE.reduce((s, r) => s + r.revenue, 0);
  const totalPayouts = PAYOUTS.reduce((s, p) => s + p.amount, 0);

  const resolveRefund = (id: string, status: "approved" | "rejected") => {
    setRefunds((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Refund ${status}`);
  };

  const payoutColumns: DataGridColumn<Payout>[] = [
    { key: "lawyer", header: "Lawyer", render: (p) => p.lawyer, sortValue: (p) => p.lawyer },
    { key: "date", header: "Date", render: (p) => formatDate(p.date), sortValue: (p) => p.date },
    { key: "status", header: "Status", render: (p) => <Badge variant={p.status === "processed" ? "success" : "warning"} className="capitalize">{p.status}</Badge> },
    { key: "amount", header: "Amount", render: (p) => formatCurrency(p.amount), sortValue: (p) => p.amount, align: "right" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Payments</h2>
        <p className="mt-1 text-sm text-muted-foreground">Platform revenue, lawyer payouts, and refund management.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardContent><p className="text-xs text-muted-foreground">Total revenue (6mo)</p><p className="mt-1 font-display text-xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p></CardContent></Card>
        <Card><CardContent><p className="text-xs text-muted-foreground">Lawyer payouts</p><p className="mt-1 font-display text-xl font-bold text-foreground">{formatCurrency(totalPayouts)}</p></CardContent></Card>
        <Card><CardContent><p className="text-xs text-muted-foreground">Pending refunds</p><p className="mt-1 font-display text-xl font-bold text-warning">{refunds.filter((r) => r.status === "pending").length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Platform Revenue</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <RechartsTooltip contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Refund Requests</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {refunds.map((r) => (
            <div key={r.id} className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{r.client} · {formatCurrency(r.amount)}</p>
                <p className="text-xs text-muted-foreground">{r.reason}</p>
              </div>
              {r.status === "pending" ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => resolveRefund(r.id, "approved")}><CheckCircle2 className="h-3.5 w-3.5" /> Approve</Button>
                  <Button size="sm" variant="ghost" className="text-danger hover:bg-danger/10" onClick={() => resolveRefund(r.id, "rejected")}><XCircle className="h-3.5 w-3.5" /> Reject</Button>
                </div>
              ) : (
                <Badge variant={r.status === "approved" ? "success" : "danger"} className="capitalize">{r.status}</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Lawyer Payouts</CardTitle></CardHeader>
        <CardContent><DataGrid columns={payoutColumns} rows={PAYOUTS} getRowId={(p) => p.id} /></CardContent>
      </Card>
    </div>
  );
}
