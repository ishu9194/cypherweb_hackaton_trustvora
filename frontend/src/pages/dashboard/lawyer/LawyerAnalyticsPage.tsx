import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Appointment } from "@/types";
import { appointmentsService } from "@/services/api/appointments.service";

const TYPE_COLORS: Record<string, string> = {
  Video: "#2563eb",
  Chat: "#10b981",
  Voice: "#f59e0b",
  Office: "#7c3aed",
};

export function LawyerAnalyticsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    let cancelled = false;
    appointmentsService.list().then((res) => {
      if (!cancelled) setAppointments(res || []);
    }).catch(() => {
      if (!cancelled) setAppointments([]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const apptTypesData = [
    { name: "Video", value: appointments.filter((a) => a.type?.toLowerCase() === "video").length, color: TYPE_COLORS.Video },
    { name: "Chat", value: appointments.filter((a) => a.type?.toLowerCase() === "chat").length, color: TYPE_COLORS.Chat },
    { name: "Voice", value: appointments.filter((a) => a.type?.toLowerCase() === "voice").length, color: TYPE_COLORS.Voice },
    { name: "Office", value: appointments.filter((a) => a.type?.toLowerCase() === "office").length, color: TYPE_COLORS.Office },
  ];

  const hasTypeData = apptTypesData.some((t) => t.value > 0);

  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const clientCounts: Record<string, number> = { Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0 };
  for (const appt of appointments) {
    if (appt.date) {
      const monthStr = new Date(appt.date).toLocaleString("en-US", { month: "short" });
      if (clientCounts[monthStr] !== undefined) {
        clientCounts[monthStr] += 1;
      }
    }
  }
  const clientGrowthData = months.map((month) => ({ month, clients: clientCounts[month] || 0 }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Analytics</h2>
        <p className="mt-1 text-sm text-muted-foreground">Insight into your consultation mix and client growth.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Consultation Types</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {hasTypeData ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={apptTypesData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                      {apptTypesData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-24 text-xs text-muted-foreground">No consultation type data yet</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>New Clients per Month</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientGrowthData}>
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

export default LawyerAnalyticsPage;
