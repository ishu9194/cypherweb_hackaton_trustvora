import { useEffect, useState } from "react";
import { LifeBuoy, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/states/ErrorState";
import { toast } from "@/components/ui/toaster";
import { formatDate, cn } from "@/lib/utils";
import { adminService, type Ticket } from "@/services/api/admin";
import { useAsync } from "@/hooks/useAsync";

const STATUS_VARIANT: Record<Ticket["status"], "warning" | "brand" | "success"> = {
  open: "warning",
  "in-progress": "brand",
  resolved: "success",
};

const PRIORITY_COLOR: Record<Ticket["priority"], string> = {
  high: "text-danger",
  medium: "text-warning",
  low: "text-muted-foreground",
};

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

export function AdminSupportTicketsPage() {
  const { data: tickets, isLoading, error, refetch } = useAsync(() => adminService.getTickets(), []);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!activeId && tickets && tickets.length > 0) {
      setActiveId(tickets[0].id);
    }
  }, [tickets, activeId]);

  const active = tickets?.find((t) => t.id === activeId) ?? tickets?.[0];

  const updateStatus = async (id: string, status: Ticket["status"]) => {
    setUpdatingStatus(true);
    try {
      await adminService.updateTicketStatus(id, status);
      toast.success("Ticket status updated");
      refetch();
    } catch {
      toast.error("Failed to update ticket status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const sendReply = async () => {
    if (!active) return;
    if (!reply.trim()) {
      toast.error("Write a reply before sending");
      return;
    }
    setSending(true);
    try {
      await adminService.replyToTicket(active.id, reply);
      toast.success(`Reply sent to ${active.requester}`);
      setReply("");
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (error) {
    return <ErrorState description={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Support Tickets</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isLoading
            ? "Loading support tickets…"
            : `${(tickets ?? []).filter((t) => t.status !== "resolved").length} open tickets.`}
        </p>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading tickets…</p>
      ) : !tickets || tickets.length === 0 || !active ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No support tickets found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[380px_1fr]">
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => setActiveId(ticket.id)}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition-colors",
                  ticket.id === active.id
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "border-border bg-surface hover:border-brand-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground">{ticket.id}</span>
                  <Badge variant={STATUS_VARIANT[ticket.status]} className="capitalize">
                    {ticket.status.replace("-", " ")}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm font-medium text-foreground">{ticket.subject}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{ticket.requester}</span>
                  <span className={cn("font-medium capitalize", PRIORITY_COLOR[ticket.priority])}>
                    {ticket.priority}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <Card>
            <CardContent>
              <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={active.requester} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{active.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {active.requester} · {active.category} · {formatDate(active.createdAt)}
                    </p>
                  </div>
                </div>
                <Select
                  options={STATUS_OPTIONS}
                  value={active.status}
                  disabled={updatingStatus}
                  onValueChange={(v) => updateStatus(active.id, v as Ticket["status"])}
                  className="w-40"
                />
              </div>

              <div className="mt-4 flex gap-3 rounded-lg bg-surface-sunken p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                  <LifeBuoy className="h-4 w-4" />
                </span>
                <p className="text-sm text-foreground">{active.message}</p>
              </div>

              <div className="mt-5">
                <Textarea
                  placeholder={`Reply to ${active.requester}…`}
                  rows={4}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <div className="mt-2 flex justify-end">
                  <Button size="sm" disabled={sending} onClick={sendReply}>
                    <Send className="h-3.5 w-3.5" /> {sending ? "Sending…" : "Send Reply"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AdminSupportTicketsPage;
