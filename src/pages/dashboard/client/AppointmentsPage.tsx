import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, Download, MessageCircle, Star, Video } from "lucide-react";
import { APPOINTMENTS } from "@/data/testimonials.data";
import type { Appointment, AppointmentStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { SearchBox } from "@/components/ui/search-box";
import { Pagination } from "@/components/ui/pagination";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/states/EmptyState";
import { toast } from "@/components/ui/toaster";
import { useDisclosure } from "@/hooks/useDisclosure";
import { downloadTextFile, formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

const PAGE_SIZE = 5;

function AppointmentRow({ appointment, onReview }: { appointment: Appointment; onReview: (a: Appointment) => void }) {
  return (
    <Card lift>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={appointment.lawyerAvatarUrl} name={appointment.lawyerName} size="md" />
          <div>
            <p className="text-sm font-semibold text-foreground">{appointment.lawyerName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(appointment.date)} · {formatTime(appointment.date)} · <span className="capitalize">{appointment.type}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={appointment.status === "upcoming" ? "brand" : appointment.status === "completed" ? "success" : appointment.status === "cancelled" ? "danger" : "warning"}
            className="capitalize"
          >
            {appointment.status}
          </Badge>
          <span className="text-sm font-semibold text-foreground">{formatCurrency(appointment.fee)}</span>
          {appointment.status === "upcoming" && (
            <>
              <Button size="sm" onClick={() => toast.success("Joining video consultation…")}>
                <Video className="h-3.5 w-3.5" /> Join
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Reschedule flow opened")}>
                <CalendarClock className="h-3.5 w-3.5" /> Reschedule
              </Button>
            </>
          )}
          {appointment.status === "completed" && (
            <>
              <Button size="sm" variant="outline" onClick={() => onReview(appointment)}>
                <Star className="h-3.5 w-3.5" /> Review
              </Button>
              <Button size="sm" variant="ghost" onClick={() => toast.success("Receipt opened")}>
                View Receipt
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Download invoice"
                onClick={() => {
                  downloadTextFile(`invoice-${appointment.id}.txt`, `Trustora Invoice\n${appointment.lawyerName}\n${formatDate(appointment.date)}\nAmount: ${formatCurrency(appointment.fee)}`);
                  toast.success("Invoice downloaded");
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button size="icon" variant="ghost" aria-label="Message" onClick={() => toast.success(`Opening chat with ${appointment.lawyerName}`)}>
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AppointmentsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const reviewModal = useDisclosure();
  const [reviewTarget, setReviewTarget] = useState<Appointment | null>(null);
  const [reviewText, setReviewText] = useState("");

  const filterByStatus = (status: AppointmentStatus) =>
    APPOINTMENTS.filter((a) => a.status === status && a.lawyerName.toLowerCase().includes(query.toLowerCase()));

  const renderList = (status: AppointmentStatus) => {
    const list = filterByStatus(status);
    const pageItems = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    if (list.length === 0) {
      return (
        <EmptyState
          icon={<CalendarClock className="h-5 w-5" />}
          title={`No ${status} appointments`}
          description="Book a consultation to see it appear here."
          action={<Button size="sm" asChild><Link to={ROUTES.findLawyers}>Find a lawyer</Link></Button>}
        />
      );
    }
    return (
      <div className="space-y-3">
        {pageItems.map((a) => <AppointmentRow key={a.id} appointment={a} onReview={(target) => { setReviewTarget(target); reviewModal.open(); }} />)}
        <Pagination page={page} totalPages={Math.max(1, Math.ceil(list.length / PAGE_SIZE))} onPageChange={setPage} className="pt-2" />
      </div>
    );
  };

  const submitReview = () => {
    reviewModal.close();
    toast.success(`Review submitted for ${reviewTarget?.lawyerName}`);
    setReviewText("");
  };

  const tabs = useMemo(
    () => [
      { value: "upcoming", label: "Upcoming", content: renderList("upcoming") },
      { value: "completed", label: "Completed", content: renderList("completed") },
      { value: "cancelled", label: "Cancelled", content: renderList("cancelled") },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, page],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">My Appointments</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage your upcoming, completed, and cancelled consultations.</p>
        </div>
        <SearchBox placeholder="Search by lawyer name…" onSearch={(q) => { setQuery(q); setPage(1); }} className="sm:w-64" />
      </div>

      <Tabs tabs={tabs} />

      <Modal
        open={reviewModal.isOpen}
        onOpenChange={reviewModal.close}
        title={`Review ${reviewTarget?.lawyerName ?? ""}`}
        footer={<><Button variant="outline" onClick={reviewModal.close}>Cancel</Button><Button onClick={submitReview}>Submit Review</Button></>}
      >
        <div className="mb-3 flex gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 cursor-pointer fill-current" />)}
        </div>
        <Textarea placeholder="Share your experience…" value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={4} />
      </Modal>
    </div>
  );
}
