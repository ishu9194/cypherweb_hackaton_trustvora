import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CalendarClock, DollarSign, Star, Users } from "lucide-react";
import type { Appointment } from "@/types";
import { appointmentsService } from "@/services/api/appointments.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, formatDate } from "@/lib/utils";

const EARNINGS = [
  { month: "Feb", amount: 18500 }, { month: "Mar", amount: 24200 }, { month: "Apr", amount: 19800 },
  { month: "May", amount: 31000 }, { month: "Jun", amount: 27600 }, { month: "Jul", amount: 34200 },
];

export function LawyerDashboardHomePage() {
  const { user } = useAuth();
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

  const upcoming = appointments.filter((a) => a.status === "upcoming");
  const totalEarnings = appointments.filter((a) => a.status === "completed").reduce((acc, a) => acc + a.fee, 0);

  const stats = [
    { label: "Total earnings", value: formatCurrency(totalEarnings), icon: DollarSign, color: "text-accent-600 bg-accent-50 dark:bg-accent-500/10" },
    { label: "Upcoming appointments", value: upcoming.length, icon: CalendarClock, color: "text-brand-600 bg-brand-50 dark:bg-brand-500/10" },
    { label: "Total appointments", value: appointments.length, icon: Users, color: "text-warning bg-warning/10" },
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Earnings History</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EARNINGS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickLine={false} />
                <RechartsTooltip />
                <Bar dataKey="amount" fill="var(--color-accent-600)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Consultations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length > 0 ? (
              upcoming.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={a.lawyerAvatarUrl} name={a.clientName} size="sm" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">{a.clientName}</p>
                      <p className="text-[11px] text-muted-foreground">{formatDate(a.date)}</p>
                    </div>
                  </div>
                  <Badge variant="brand">{a.type}</Badge>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-muted-foreground">No upcoming consultations.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
