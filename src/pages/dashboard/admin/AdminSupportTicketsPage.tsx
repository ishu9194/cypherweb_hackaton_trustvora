import { useState } from "react";
import { LifeBuoy, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { formatDate, cn } from "@/lib/utils";

interface Ticket {
  id: string;
  subject: string;
  requester: string;
  category: "Billing" | "Account" | "Booking" | "Technical";
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved";
  message: string;
  createdAt: string;
}

const INITIAL_TICKETS: Ticket[] = [
  { id: "TCK-501", subject: "Refund not received for cancelled booking", requester: "Farhan Ali", category: "Billing", priority: "high", status: "open", message: "I cancelled my consultation 3 days ago and haven't received the refund yet. Booking ID AP-4.", createdAt: "2026-07-22T10:00:00" },
  { id: "TCK-502", subject: "Can't upload documents larger than 5MB", requester: "Neha Kulkarni", category: "Technical", priority: "medium", status: "in-progress", message: "The upload keeps failing silently for files around 8MB. Tried both PDF and DOCX.", createdAt: "2026-07-21T14:30:00" },
  { id: "TCK-503", subject: "Wrong lawyer assigned to my booking", requester: "Sanjay Malhotra", category: "Booking", priority: "high", status: "open", message: "I booked a family law consultation but was matched with a tax lawyer.", createdAt: "2026-07-20T09:15:00" },
  { id: "TCK-504", subject: "Unable to reset password", requester: "Karan Vora", category: "Account", priority: "low", status: "resolved", message: "Reset link expired before I could use it.", createdAt: "2026-07-18T16:00:00" },
];

const STATUS_VARIANT: Record<Ticket["status"], "warning" | "brand" | "success"> = { open: "warning", "in-progress": "brand", resolved: "success" };
const PRIORITY_COLOR: Record<Ticket["priority"], string> = { high: "text-danger", medium: "text-warning", low: "text-muted-foreground" };
const STATUS_OPTIONS = [{ value: "open", label: "Open" }, { value: "in-progress", label: "In Progress" }, { value: "resolved", label: "Resolved" }];

export function AdminSupportTicketsPage() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [activeId, setActiveId] = useState(tickets[0]?.id);
  const [reply, setReply] = useState("");
  const active = tickets.find((t) => t.id === activeId) ?? tickets[0];

  const updateStatus = (id: string, status: Ticket["status"]) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    toast.success("Ticket status updated");
  };

  const sendReply = () => {
    if (!reply.trim()) { toast.error("Write a reply before sending"); return; }
    toast.success(`Reply sent to ${active.requester}`);
    setReply("");
  };

  if (!active) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Support Tickets</h2>
        <p className="mt-1 text-sm text-muted-foreground">{tickets.filter((t) => t.status !== "resolved").length} open tickets.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[380px_1fr]">
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => setActiveId(ticket.id)}
              className={cn("w-full rounded-xl border p-4 text-left transition-colors", ticket.id === activeId ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-border bg-surface hover:border-brand-300")}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted-foreground">{ticket.id}</span>
                <Badge variant={STATUS_VARIANT[ticket.status]} className="capitalize">{ticket.status.replace("-", " ")}</Badge>
              </div>
              <p className="mt-1.5 text-sm font-medium text-foreground">{ticket.subject}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{ticket.requester}</span>
                <span className={cn("font-medium capitalize", PRIORITY_COLOR[ticket.priority])}>{ticket.priority}</span>
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
                  <p className="text-xs text-muted-foreground">{active.requester} · {active.category} · {formatDate(active.createdAt)}</p>
                </div>
              </div>
              <Select options={STATUS_OPTIONS} value={active.status} onValueChange={(v) => updateStatus(active.id, v as Ticket["status"])} className="w-40" />
            </div>

            <div className="mt-4 flex gap-3 rounded-lg bg-surface-sunken p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10"><LifeBuoy className="h-4 w-4" /></span>
              <p className="text-sm text-foreground">{active.message}</p>
            </div>

            <div className="mt-5">
              <Textarea placeholder={`Reply to ${active.requester}…`} rows={4} value={reply} onChange={(e) => setReply(e.target.value)} />
              <div className="mt-2 flex justify-end">
                <Button size="sm" onClick={sendReply}><Send className="h-3.5 w-3.5" /> Send Reply</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
