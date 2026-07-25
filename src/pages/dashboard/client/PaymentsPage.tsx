import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { Download, Receipt as ReceiptIcon } from "lucide-react";
import { PAYMENTS } from "@/data/testimonials.data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Timeline } from "@/components/ui/timeline";
import { toast } from "@/components/ui/toaster";
import { useDisclosure } from "@/hooks/useDisclosure";
import { downloadTextFile, formatCurrency, formatDate } from "@/lib/utils";
import type { Payment } from "@/types";

const MONTHLY_SPEND = [
  { month: "Feb", amount: 1200 },
  { month: "Mar", amount: 2500 },
  { month: "Apr", amount: 700 },
  { month: "May", amount: 3200 },
  { month: "Jun", amount: 1500 },
  { month: "Jul", amount: 4000 },
];

const STATUS_VARIANT: Record<Payment["status"], "success" | "warning" | "neutral" | "danger"> = {
  paid: "success",
  pending: "warning",
  refunded: "neutral",
  failed: "danger",
};

export function PaymentsPage() {
  const timelineModal = useDisclosure();
  const [selected, setSelected] = useState<Payment | null>(null);
  const totalSpent = PAYMENTS.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const pending = PAYMENTS.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const refunded = PAYMENTS.filter((p) => p.status === "refunded").reduce((sum, p) => sum + p.amount, 0);

  const openTimeline = (payment: Payment) => { setSelected(payment); timelineModal.open(); };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Payments</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your payment history, invoices, and receipts.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardContent><p className="text-xs text-muted-foreground">Total spent</p><p className="mt-1 font-display text-xl font-bold text-foreground">{formatCurrency(totalSpent)}</p></CardContent></Card>
        <Card><CardContent><p className="text-xs text-muted-foreground">Pending</p><p className="mt-1 font-display text-xl font-bold text-warning">{formatCurrency(pending)}</p></CardContent></Card>
        <Card><CardContent><p className="text-xs text-muted-foreground">Refunded</p><p className="mt-1 font-display text-xl font-bold text-muted-foreground">{formatCurrency(refunded)}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Monthly Spend</CardTitle></CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_SPEND}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <RechartsTooltip contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {PAYMENTS.map((payment) => (
            <div key={payment.id} className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{payment.description}</p>
                <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={STATUS_VARIANT[payment.status]} className="capitalize">{payment.status}</Badge>
                <span className="text-sm font-semibold text-foreground">{formatCurrency(payment.amount)}</span>
                <Button size="sm" variant="ghost" onClick={() => openTimeline(payment)}><ReceiptIcon className="h-3.5 w-3.5" /> Timeline</Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Download receipt"
                  onClick={() => { downloadTextFile(`receipt-${payment.id}.txt`, `Trustora Receipt\n${payment.description}\n${formatDate(payment.date)}\nAmount: ${formatCurrency(payment.amount)}\nStatus: ${payment.status}`); toast.success("Receipt downloaded"); }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Modal open={timelineModal.isOpen} onOpenChange={timelineModal.close} title="Transaction Timeline">
        {selected && (
          <Timeline
            steps={[
              { title: "Payment initiated", timestamp: formatDate(selected.date), status: "complete" },
              { title: "Payment processed", status: "complete" },
              { title: selected.status === "refunded" ? "Refund issued" : selected.status === "pending" ? "Awaiting confirmation" : "Completed", status: selected.status === "pending" ? "current" : "complete" },
            ]}
          />
        )}
      </Modal>
    </div>
  );
}
