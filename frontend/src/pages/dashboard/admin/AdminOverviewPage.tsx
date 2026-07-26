import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { Users, Gavel, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/states/ErrorState";
import { adminService } from "@/services/api/admin";
import { useAsync } from "@/hooks/useAsync";
import { formatCurrency } from "@/lib/utils";

const ICONS = [Gavel, Users, CreditCard, TrendingUp];
const COLORS = [
  "text-brand-600 bg-brand-50 dark:bg-brand-500/10",
  "text-accent-600 bg-accent-50 dark:bg-accent-500/10",
  "text-warning bg-warning/10",
  "text-accent-600 bg-accent-50 dark:bg-accent-500/10",
];

export function AdminOverviewPage() {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useAsync(() => adminService.getStats(), []);
  const { data: revenue, isLoading: revenueLoading, error: revenueError, refetch: refetchRevenue } = useAsync(() => adminService.getRevenue(), []);

  if (statsLoading && revenueLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-border p-14 text-sm text-muted-foreground">
        Loading admin overview…
      </div>
    );
  }

  if (statsError && revenueError) {
    return (
      <ErrorState
        description={statsError || revenueError || "Failed to load dashboard overview data"}
        onRetry={() => {
          refetchStats();
          refetchRevenue();
        }}
      />
    );
  }

  const statList = stats ?? [];
  const revenueList = revenue ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Admin Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">Platform-wide metrics at a glance.</p>
      </div>

      {statsError ? (
        <ErrorState description={statsError} onRetry={refetchStats} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(statsLoading ? Array.from({ length: 4 }) : statList).map((stat, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Card key={statsLoading ? i : (stat as { label: string }).label} lift>
                <CardContent className="flex items-center gap-4">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${COLORS[i % COLORS.length]}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xl font-bold text-foreground">
                      {statsLoading ? (
                        <span className="inline-block h-5 w-16 animate-pulse rounded bg-surface-sunken" />
                      ) : typeof (stat as { value: unknown }).value === "number" ? (
                        formatCurrency((stat as { value: number }).value)
                      ) : (
                        (stat as { value: string }).value
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{statsLoading ? "" : (stat as { label: string }).label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Platform Revenue — Last 6 Months</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {revenueError ? (
            <ErrorState description={revenueError} onRetry={refetchRevenue} className="h-full" />
          ) : revenueLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading revenue data…</div>
          ) : revenueList.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No revenue data available.</div>
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
    </div>
  );
}

export default AdminOverviewPage;
