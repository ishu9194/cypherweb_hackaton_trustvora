import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, Download, MessageCircle, Star, Video } from "lucide-react";
import type { Appointment, AppointmentStatus } from "@/types";
import { appointmentsService } from "@/services/api/appointments.service";
import { reviewsService } from "@/services/api/reviews.service";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { SearchBox } from "@/components/ui/search-box";
import { Pagination } from "@/components/ui/pagination";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/states/EmptyState";
import { toast } from "@/components/ui/toaster";
import { useDisclosure } from "@/hooks/useDisclosure";
import { cn, downloadTextFile, formatCurrency, formatDate, formatTime } from "@/lib/utils";
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
          {appointment.status === "pending" && (
            <span className="text-xs text-muted-foreground">Awaiting lawyer confirmation</span>
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
                  downloadTextFile(`invoice-${appointment.id}.txt`, `Trustix Invoice\n${appointment.lawyerName}\n${formatDate(appointment.date)}\nAmount: ${formatCurrency(appointment.fee)}`);
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const reviewModal = useDisclosure();
  const [reviewTarget, setReviewTarget] = useState<Appointment | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchAppointments = () => {
    setIsLoading(true);
    return appointmentsService
      .list()
      .then((data) => setAppointments(data))
      .catch(() => toast.error("Couldn't load your appointments. Please try again."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Pending appointments haven't been confirmed by the lawyer yet, but they
  // still belong in "Upcoming" from the client's point of view — there's no
  // separate tab for them.
  const filterByStatus = (status: AppointmentStatus) =>
    appointments.filter((a) => {
      const matchesStatus = status === "upcoming" ? a.status === "upcoming" || a.status === "pending" : a.status === status;
      return matchesStatus && a.lawyerName.toLowerCase().includes(query.toLowerCase());
    });

  const openReviewModal = (target: Appointment) => {
    setReviewTarget(target);
    setReviewRating(0);
    setHoverRating(0);
    setReviewText("");
    reviewModal.open();
  };

  const renderList = (status: AppointmentStatus) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }
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
        {pageItems.map((a) => <AppointmentRow key={a.id} appointment={a} onReview={openReviewModal} />)}
        <Pagination page={page} totalPages={Math.max(1, Math.ceil(list.length / PAGE_SIZE))} onPageChange={setPage} className="pt-2" />
      </div>
    );
  };

  const submitReview = async () => {
    if (!reviewTarget) return;
    if (reviewRating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please share a few words about your experience");
      return;
    }
    setIsSubmittingReview(true);
    try {
      await reviewsService.create({
        lawyerId: reviewTarget.lawyerId,
        rating: reviewRating,
        comment: reviewText.trim(),
      });
      toast.success(`Review submitted for ${reviewTarget.lawyerName}`);
      reviewModal.close();
      setReviewText("");
      setReviewRating(0);
      await fetchAppointments();
    } catch {
      toast.error("Couldn't submit your review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const tabs = useMemo(
    () => [
      { value: "upcoming", label: "Upcoming", content: renderList("upcoming") },
      { value: "completed", label: "Completed", content: renderList("completed") },
      { value: "cancelled", label: "Cancelled", content: renderList("cancelled") },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, page, appointments, isLoading],
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
        footer={
          <>
            <Button variant="outline" onClick={reviewModal.close} disabled={isSubmittingReview}>Cancel</Button>
            <Button onClick={submitReview} isLoading={isSubmittingReview}>Submit Review</Button>
          </>
        }
      >
        <div className="mb-3 flex gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            const filled = value <= (hoverRating || reviewRating);
            return (
              <button
                key={i}
                type="button"
                aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                onClick={() => setReviewRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5"
              >
                <Star className={cn("h-5 w-5", filled ? "fill-current" : "fill-none")} />
              </button>
            );
          })}
        </div>
        <Textarea placeholder="Share your experience…" value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={4} />
      </Modal>
    </div>
  );
}
