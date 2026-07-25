import { Link, useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import {
  CalendarClock, Briefcase, CreditCard, Heart, MessageSquare, Upload, Search,
  ArrowRight, Bell, Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import { Calendar } from "@/components/ui/calendar";
import { APPOINTMENTS, CASES, PAYMENTS } from "@/data/testimonials.data";
import { DASHBOARD_NOTIFICATIONS } from "@/data/dashboardExtras.data";
import { LAWYERS } from "@/data/lawyers.data";
import { useFavoritesStore } from "@/hooks/useFavoritesStore";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

const MONTHLY_CONSULTATIONS = [
  { month: "Feb", count: 1 },
  { month: "Mar", count: 2 },
  { month: "Apr", count: 1 },
  { month: "May", count: 3 },
  { month: "Jun", count: 2 },
  { month: "Jul", count: 4 },
];

const STATUS_COLORS: Record<string, string> = {
  open: "#f59e0b",
  "in-progress": "#2563eb",
  closed: "#10b981",
};

const CASE_STATUS_DATA = [
  { name: "Open", value: CASES.filter((c) => c.status === "open").length, key: "open" },
  { name: "In Progress", value: CASES.filter((c) => c.status === "in-progress").length, key: "in-progress" },
  { name: "Closed", value: CASES.filter((c) => c.status === "closed").length, key: "closed" },
].filter((d) => d.value > 0);

export function DashboardHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { favorites } = useFavoritesStore();
  const favoriteLawyers = LAWYERS.filter((l) => favorites.has(l.id)).slice(0, 3);
  const upcoming = APPOINTMENTS.filter((a) => a.status === "upcoming");
  const totalSpent = PAYMENTS.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    { label: "Upcoming appointments", value: upcoming.length, icon: CalendarClock, color: "text-brand-600 bg-brand-50 dark:bg-brand-500/10" },
    { label: "Active cases", value: CASES.filter((c) => c.status !== "closed").length, icon: Briefcase, color: "text-accent-600 bg-accent-50 dark:bg-accent-500/10" },
    { label: "Total spent", value: formatCurrency(totalSpent), icon: CreditCard, color: "text-warning bg-warning/10" },
    { label: "Saved lawyers", value: favorites.size, icon: Heart, color: "text-danger bg-danger/10" },
  ];

  const quickActions = [
    { label: "Find a Lawyer", icon: Search, action: () => navigate(ROUTES.findLawyers) },
    { label: "Message", icon: MessageSquare, action: () => navigate(ROUTES.clientMessages) },
    { label: "Upload Document", icon: Upload, action: () => navigate(ROUTES.clientDocuments) },
    { label: "View Cases", icon: Briefcase, action: () => navigate(ROUTES.clientCases) },
  ];

  const unreadNotifications = DASHBOARD_NOTIFICATIONS.filter((n) => !n.read);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Welcome back, {user?.name.split(" ")[0] ?? "there"} 👋</h2>
          <p className="mt-1 text-sm text-muted-foreground">Here's what's happening with your legal matters today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button key={action.label} variant="outline" size="sm" onClick={action.action}>
              <action.icon className="h-3.5 w-3.5" />
              {action.label}
            </Button>
          ))}
        </div>
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
            <CardTitle>Monthly Consultations</CardTitle>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_CONSULTATIONS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} allowDecimals={false} />
                <RechartsTooltip
                  contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case Status</CardTitle>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            {CASE_STATUS_DATA.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CASE_STATUS_DATA} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3}>
                    {CASE_STATUS_DATA.map((entry) => (
                      <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">No case data yet</p>
            )}
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              {CASE_STATUS_DATA.map((entry) => (
                <span key={entry.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.key] }} />
                  {entry.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Upcoming Appointments</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to={ROUTES.clientAppointments}>View all <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length > 0 ? upcoming.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <Avatar src={appointment.lawyerAvatarUrl} name={appointment.lawyerName} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{appointment.lawyerName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(appointment.date)} · {appointment.type}</p>
                  </div>
                </div>
                <Badge variant="brand" className="capitalize">{appointment.status}</Badge>
              </div>
            )) : (
              <p className="py-6 text-center text-sm text-muted-foreground">No upcoming appointments — book one to get started.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Cases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {CASES.map((legalCase) => (
              <div key={legalCase.id}>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{legalCase.title}</p>
                  <span className="text-xs text-muted-foreground">{legalCase.progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${legalCase.progress}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline
              steps={[
                { title: "Document uploaded", description: "Founders_Agreement_v2.pdf", timestamp: "Today", status: "current" },
                { title: "Case status updated", description: "GST Notice Response → In Progress", timestamp: "Yesterday", status: "complete" },
                { title: "Consultation completed", description: "With Adv. Ananya Iyer", timestamp: "5 days ago", status: "complete" },
                { title: "Payment received", description: formatCurrency(1500), timestamp: "5 days ago", status: "complete" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <Badge variant="brand">{unreadNotifications.length} new</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {unreadNotifications.slice(0, 3).map((n) => (
              <div key={n.id} className="flex gap-2.5 rounded-lg bg-surface-sunken p-3">
                <Bell className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                <div>
                  <p className="text-xs font-medium text-foreground">{n.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{n.description}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to={ROUTES.clientNotifications}>View all notifications</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to={ROUTES.clientPayments}>View all <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {PAYMENTS.slice(0, 4).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{payment.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={payment.status === "paid" ? "success" : payment.status === "pending" ? "warning" : "neutral"} className="capitalize">{payment.status}</Badge>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(payment.amount)}</span>
                  {payment.invoiceUrl && (
                    <Button variant="ghost" size="icon" aria-label="Download invoice">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Lawyers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {favoriteLawyers.length > 0 ? favoriteLawyers.map((lawyer) => (
              <Link key={lawyer.id} to={ROUTES.lawyerProfile(lawyer.id)} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-surface-sunken">
                <Avatar src={lawyer.avatarUrl} name={lawyer.name} size="sm" online={lawyer.online} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{lawyer.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{lawyer.specializations[0]}</p>
                </div>
              </Link>
            )) : (
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground">No saved lawyers yet</p>
                <Button variant="link" size="sm" asChild className="mt-1 h-auto p-0">
                  <Link to={ROUTES.findLawyers}>Browse lawyers</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
