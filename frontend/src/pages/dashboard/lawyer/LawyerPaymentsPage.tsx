import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { Banknote, CreditCard, Plus, Smartphone, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { toast } from "@/components/ui/toaster";
import { useDisclosure } from "@/hooks/useDisclosure";
import { formatCurrency, formatDate } from "@/lib/utils";

const EARNINGS = [
  { month: "Feb", amount: 18500 }, { month: "Mar", amount: 24200 }, { month: "Apr", amount: 19800 },
  { month: "May", amount: 31000 }, { month: "Jun", amount: 27600 }, { month: "Jul", amount: 34200 },
];

interface Transaction { id: string; client: string; description: string; amount: number; status: "paid" | "pending"; date: string }

const TRANSACTIONS: Transaction[] = [
  { id: "txn-1", client: "Meet Agrawal", description: "Video consultation", amount: 1500, status: "paid", date: "2026-07-22T00:00:00" },
  { id: "txn-2", client: "Farhan Ali", description: "GST notice response", amount: 3200, status: "paid", date: "2026-07-18T00:00:00" },
  { id: "txn-3", client: "Neha Kulkarni", description: "Trademark filing", amount: 3500, status: "pending", date: "2026-07-15T00:00:00" },
  { id: "txn-4", client: "Karan Vora", description: "Chat consultation", amount: 700, status: "paid", date: "2026-07-10T00:00:00" },
];

const WITHDRAWAL_METHODS = [
  { id: "bank", label: "HDFC Bank •• 4821", icon: Banknote, primary: true },
  { id: "upi", label: "priya@okhdfcbank", icon: Smartphone, primary: false },
];

export function LawyerPaymentsPage() {
  const [methods, setMethods] = useState(WITHDRAWAL_METHODS);
  const addMethod = useDisclosure();
  const withdraw = useDisclosure();
  const [newAccount, setNewAccount] = useState("");
  const totalEarned = TRANSACTIONS.filter((t) => t.status === "paid").reduce((s, t) => s + t.amount, 0);
  const pending = TRANSACTIONS.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0);

  const columns: DataGridColumn<Transaction>[] = [
    { key: "client", header: "Client", render: (t) => t.client, sortValue: (t) => t.client },
    { key: "description", header: "Description", render: (t) => t.description },
    { key: "date", header: "Date", render: (t) => formatDate(t.date), sortValue: (t) => t.date },
    { key: "status", header: "Status", render: (t) => <Badge variant={t.status === "paid" ? "success" : "warning"} className="capitalize">{t.status}</Badge> },
    { key: "amount", header: "Amount", render: (t) => formatCurrency(t.amount), sortValue: (t) => t.amount, align: "right" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Payments</h2>
        <p className="mt-1 text-sm text-muted-foreground">Track your earnings and manage withdrawals.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardContent><p className="text-xs text-muted-foreground">Total earned</p><p className="mt-1 font-display text-xl font-bold text-foreground">{formatCurrency(totalEarned)}</p></CardContent></Card>
        <Card><CardContent><p className="text-xs text-muted-foreground">Pending</p><p className="mt-1 font-display text-xl font-bold text-warning">{formatCurrency(pending)}</p></CardContent></Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div><p className="text-xs text-muted-foreground">Available balance</p><p className="mt-1 font-display text-xl font-bold text-accent-600">{formatCurrency(totalEarned - 12000)}</p></div>
            <Button size="sm" onClick={withdraw.open}><Wallet className="h-3.5 w-3.5" /> Withdraw</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Earnings — Last 6 Months</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={EARNINGS}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <RechartsTooltip contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Withdrawal Methods</CardTitle>
          <Button variant="outline" size="sm" onClick={addMethod.open}><Plus className="h-3.5 w-3.5" /> Add method</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {methods.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10"><m.icon className="h-4.5 w-4.5" /></span>
                <p className="text-sm font-medium text-foreground">{m.label}</p>
              </div>
              {m.primary && <Badge variant="brand">Primary</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
        <CardContent>
          <DataGrid columns={columns} rows={TRANSACTIONS} getRowId={(t) => t.id} />
        </CardContent>
      </Card>

      <Modal open={withdraw.isOpen} onOpenChange={withdraw.close} title="Withdraw funds" footer={<><Button variant="outline" onClick={withdraw.close}>Cancel</Button><Button onClick={() => { withdraw.close(); toast.success("Withdrawal request submitted"); }}>Confirm withdrawal</Button></>}>
        <p className="text-sm text-muted-foreground">Available balance: <span className="font-semibold text-foreground">{formatCurrency(totalEarned - 12000)}</span></p>
        <Input label="Amount to withdraw" placeholder="₹10,000" className="mt-3" />
      </Modal>

      <Modal open={addMethod.isOpen} onOpenChange={addMethod.close} title="Add withdrawal method" footer={<><Button variant="outline" onClick={addMethod.close}>Cancel</Button><Button onClick={() => { if (!newAccount.trim()) { toast.error("Enter account details"); return; } setMethods((p) => [...p, { id: `m-${Date.now()}`, label: newAccount, icon: CreditCard, primary: false }]); setNewAccount(""); addMethod.close(); toast.success("Withdrawal method added"); }}>Save</Button></>}>
        <Input label="Bank account or UPI ID" placeholder="e.g. yourname@okicici" value={newAccount} onChange={(e) => setNewAccount(e.target.value)} />
      </Modal>
    </div>
  );
}
