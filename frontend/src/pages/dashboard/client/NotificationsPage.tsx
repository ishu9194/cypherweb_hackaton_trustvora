import { useEffect, useMemo, useState } from "react";
import { Bell, Calendar, CreditCard, MessageSquare, Trash2, Briefcase, Settings as SettingsIcon } from "lucide-react";
import type { DashboardNotification } from "@/services/api/dashboard.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { toast } from "@/components/ui/toaster";
import { formatDate, cn } from "@/lib/utils";
import { dashboardService } from "@/services/api/dashboard.service";
import { useAsync } from "@/hooks/useAsync";

const ICONS: Record<DashboardNotification["category"], typeof Bell> = {
  appointment: Calendar,
  case: Briefcase,
  payment: CreditCard,
  message: MessageSquare,
  system: SettingsIcon,
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "appointment", label: "Appointments" },
  { value: "case", label: "Cases" },
  { value: "payment", label: "Payments" },
  { value: "message", label: "Messages" },
  { value: "system", label: "System" },
];

const PAGE_SIZE = 5;

export function NotificationsPage() {
  const { data: initialNotifications, isLoading, error, refetch } = useAsync(() => dashboardService.getNotifications(), []);
  const [items, setItems] = useState<DashboardNotification[]>([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (initialNotifications) setItems(initialNotifications);
  }, [initialNotifications]);

  const filtered = filter === "all" ? items : items.filter((n) => n.category === filter);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  const grouped = useMemo(() => {
    const today = new Date().toDateString();
    const groups: Record<string, DashboardNotification[]> = { Today: [], Earlier: [] };
    pageItems.forEach((n) => {
      groups[new Date(n.timestamp).toDateString() === today ? "Today" : "Earlier"].push(n);
    });
    return groups;
  }, [pageItems]);

  if (error) return <ErrorState description={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Notifications</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Loading notifications…" : `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select options={FILTERS} value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }} className="w-40" />
          <Button variant="outline" size="sm" onClick={markAllRead}>Mark all as read</Button>
        </div>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading notifications…</p>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Bell className="h-5 w-5" />} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, list]) =>
            list.length > 0 ? (
              <div key={group}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group}</p>
                <div className="space-y-2">
                  {list.map((n) => {
                    const Icon = ICONS[n.category];
                    return (
                      <div key={n.id} className={cn("flex items-start gap-3 rounded-xl border border-border p-4", !n.read && "bg-brand-50/50 dark:bg-brand-500/5")}>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{n.title}</p>
                            {!n.read && <Badge variant="brand">New</Badge>}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{n.description}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(n.timestamp)}</p>
                        </div>
                        <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => deleteNotification(n.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null,
          )}
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
