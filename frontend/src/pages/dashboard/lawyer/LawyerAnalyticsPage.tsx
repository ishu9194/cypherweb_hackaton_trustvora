import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const APPT_TYPES = [
  { name: "Video", value: 12, color: "#2563eb" },
  { name: "Chat", value: 8, color: "#10b981" },
  { name: "Voice", value: 5, color: "#f59e0b" },
  { name: "Office", value: 3, color: "#7c3aed" },
];

const CLIENT_GROWTH = [
  { month: "Feb", clients: 4 }, { month: "Mar", clients: 6 }, { month: "Apr", clients: 5 },
  { month: "May", clients: 9 }, { month: "Jun", clients: 7 }, { month: "Jul", clients: 11 },
];

export function LawyerAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Analytics</h2>
        <p className="mt-1 text-sm text-muted-foreground">Insight into your consultation mix and client growth.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Consultation Types</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={APPT_TYPES} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {APPT_TYPES.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>New Clients per Month</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CLIENT_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} allowDecimals={false} />
                <RechartsTooltip contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="clients" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
