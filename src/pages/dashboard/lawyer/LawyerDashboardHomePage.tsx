import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CalendarClock, DollarSign, Star, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { APPOINTMENTS } from "@/data/testimonials.data";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, formatDate } from "@/lib/utils";

const EARNINGS = [
  { month: "Feb", amount: 18500 }, { month: "Mar", amount: 24200 }, { month: "Apr", amount: 19800 },
  { month: "May", amount: 31000 }, { month: "Jun", amount: 27600 }, { month: "Jul", amount: 34200 },
];

export function LawyerDashboardHomePage() {
  const { user } = useAuth();
  const stats = [
    { label: "This month's earnings", value: formatCurrency(34200), icon: DollarSign, color: "text-accent-600 bg-accent-50 dark:bg-accent-500/10" },
    { label: "Upcoming appointments", value: APPOINTMENTS.filter((a) => a.status === "upcoming").length, icon: CalendarClock, color: "text-brand-600 bg-brand-50 dark:bg-brand-500/10" },
    { label: "Active clients", value: 18, icon: Users, color: "text-warning bg-warning/10" },
    { label: "Average rating", value: "4.9", icon: Star, color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Welcome back, {user?.name.split(" ")[0] ?? "Advocate"} 👋</h2>
        <p className="mt-1 text-sm text-muted-foreground">Here's how your practice is doing.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} lift>
            <CardContent className="flex items-center gap-4">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
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
        <CardHeader><CardTitle>Upcoming Appointments</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {APPOINTMENTS.filter((a) => a.status === "upcoming").map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Avatar name={a.clientName} size="sm" />
                <div>
                  <p className="text-sm font-medium text-foreground">{a.clientName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(a.date)} · {a.type}</p>
                </div>
              </div>
              <Badge variant="brand" className="capitalize">{a.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
