import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { Users, Gavel, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LAWYERS } from "@/data/lawyers.data";
import { formatCurrency } from "@/lib/utils";

const PLATFORM_REVENUE = [
  { month: "Feb", revenue: 420000 }, { month: "Mar", revenue: 510000 }, { month: "Apr", revenue: 480000 },
  { month: "May", revenue: 620000 }, { month: "Jun", revenue: 590000 }, { month: "Jul", revenue: 710000 },
];

export function AdminOverviewPage() {
  const stats = [
    { label: "Total lawyers", value: LAWYERS.length, icon: Gavel, color: "text-brand-600 bg-brand-50 dark:bg-brand-500/10" },
    { label: "Total clients", value: "8,420", icon: Users, color: "text-accent-600 bg-accent-50 dark:bg-accent-500/10" },
    { label: "Monthly revenue", value: formatCurrency(710000), icon: CreditCard, color: "text-warning bg-warning/10" },
    { label: "Growth (MoM)", value: "+12.4%", icon: TrendingUp, color: "text-accent-600 bg-accent-50 dark:bg-accent-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Admin Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">Platform-wide metrics at a glance.</p>
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
        <CardHeader><CardTitle>Platform Revenue — Last 6 Months</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PLATFORM_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <RechartsTooltip contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
