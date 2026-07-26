import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import {
  CalendarClock, Briefcase, CreditCard, Heart, MessageSquare, Upload, Search,
  ArrowRight, Bell,
} from "lucide-react";
import type { Appointment, LegalCase, Lawyer, Payment } from "@/types";
import { appointmentsService } from "@/services/api/appointments.service";
import { dashboardService, type DashboardNotification } from "@/services/api/dashboard.service";
import { lawyersService } from "@/services/api/lawyers.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

export function DashboardHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { favorites } = useFavoritesStore();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [favoriteLawyers, setFavoriteLawyers] = useState<Lawyer[]>([]);

  useEffect(() => {
    let cancelled = false;

    const favIds = Array.from(favorites).slice(0, 3);
    const favPromises = favIds.map((id) => lawyersService.getById(id));

    Promise.all([
      appointmentsService.list().catch(() => []),
      dashboardService.getCases().catch(() => []),
      dashboardService.getPayments().catch(() => []),
      dashboardService.getNotifications().catch(() => []),
      Promise.all(favPromises).catch(() => []),
    ]).then(([appRes, caseRes, payRes, notifRes, favRes]) => {
      if (cancelled) return;
      setAppointments(appRes || []);
      setCases(caseRes || []);
      setPayments(payRes || []);
      setNotifications(notifRes || []);
      const validFavs: Lawyer[] = [];
      if (Array.isArray(favRes)) {
        favRes.forEach((l) => { if (l) validFavs.push(l); });
      }
      setFavoriteLawyers(validFavs);
    });

    return () => {
      cancelled = true;
    };
  }, [favorites]);

  const upcoming = appointments.filter((a) => a.status === "upcoming");
  const totalSpent = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);

  const caseStatusData = [
    { name: "Open", value: cases.filter((c) => c.status === "open").length, key: "open" },
    { name: "In Progress", value: cases.filter((c) => c.status === "in-progress").length, key: "in-progress" },
    { name: "Closed", value: cases.filter((c) => c.status === "closed").length, key: "closed" },
  ].filter((d) => d.value > 0);

  const stats = [
    { label: "Upcoming appointments", value: upcoming.length, icon: CalendarClock, color: "text-brand-600 bg-brand-50 dark:bg-brand-500/10" },
    { label: "Active cases", value: cases.filter((c) => c.status !== "closed").length, icon: Briefcase, color: "text-accent-600 bg-accent-50 dark:bg-accent-500/10" },
    { label: "Total spent", value: formatCurrency(totalSpent), icon: CreditCard, color: "text-warning bg-warning/10" },
    { label: "Saved lawyers", value: favorites.size, icon: Heart, color: "text-danger bg-danger/10" },
  ];

  const quickActions = [
    { label: "Find a Lawyer", icon: Search, action: () => navigate(ROUTES.findLawyers) },
    { label: "Message", icon: MessageSquare, action: () => navigate(ROUTES.clientMessages) },
    { label: "Upload Document", icon: Upload, action: () => navigate(ROUTES.clientDocuments) },
    { label: "View Cases", icon: Briefcase, action: () => navigate(ROUTES.clientCases) },
  ];

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Welcome back, {user?.name.split(" ")[0] ?? "there"} 👋</h2>
          <p className="mt-1 text-sm text-muted-foreground">Here's what's happening with your legal consultations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.clientNotifications)} className="relative">
            <Bell className="h-4 w-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                {unreadNotifications.length}
              </span>
            )}
          </Button>
          <Button size="sm" onClick={() => navigate(ROUTES.findLawyers)}>
            Book Consultation
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickActions.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:bg-surface-sunken"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
              <item.icon className="h-4.5 w-4.5" />
            </span>
            <span className="text-sm font-medium text-foreground">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Consultations Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_CONSULTATIONS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} />
                <YAxis tickLine={false} allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="var(--color-brand-600)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {caseStatusData.length > 0 ? (
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={caseStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                      {caseStatusData.map((entry) => (
                        <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-12 text-xs text-muted-foreground">No case status data yet</p>
            )}
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              {caseStatusData.map((entry) => (
                <span key={entry.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.key] }} />
                  {entry.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments & Calendar */}
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

      {/* Active Cases & Payments / Saved Lawyers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Cases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cases.length > 0 ? cases.map((legalCase) => (
              <div key={legalCase.id}>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{legalCase.title}</p>
                  <span className="text-xs text-muted-foreground">{legalCase.progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${legalCase.progress}%` }} />
                </div>
              </div>
            )) : (
              <p className="py-6 text-center text-sm text-muted-foreground">No active cases found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {payments.length > 0 ? payments.slice(0, 3).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-xs">
                <div>
                  <p className="font-medium text-foreground">{payment.description}</p>
                  <p className="text-muted-foreground">{formatDate(payment.date)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={payment.status === "paid" ? "success" : payment.status === "pending" ? "warning" : "neutral"} className="capitalize">{payment.status}</Badge>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(payment.amount)}</span>
                </div>
              </div>
            )) : (
              <p className="py-6 text-center text-sm text-muted-foreground">No recent payments.</p>
            )}
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
