import { useEffect, useState } from "react";
import { Video, CalendarClock, Check, X } from "lucide-react";
import type { Appointment, AppointmentStatus } from "@/types";
import { appointmentsService } from "@/services/api/appointments.service";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/states/EmptyState";
import { toast } from "@/components/ui/toaster";
import { formatDate } from "@/lib/utils";

export function LawyerAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const handleStatusChange = async (appointment: Appointment, status: AppointmentStatus) => {
    setUpdatingId(appointment.id);
    try {
      await appointmentsService.updateStatus(appointment.id, status);
      toast.success(
        status === "upcoming"
          ? `Confirmed appointment with ${appointment.clientName}`
          : status === "completed"
            ? `Marked appointment with ${appointment.clientName} as completed`
            : `Cancelled appointment with ${appointment.clientName}`,
      );
      await fetchAppointments();
    } catch {
      toast.error("Couldn't update the appointment. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Appointments</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your client consultations.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={<CalendarClock className="h-5 w-5" />}
          title="No appointments yet"
          description="Confirmed client bookings will show up here."
        />
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => {
            const isUpdating = updatingId === a.id;
            return (
              <Card key={a.id} lift>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={a.clientName} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{a.clientName}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(a.date)} · {a.type}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={a.status === "upcoming" ? "brand" : a.status === "completed" ? "success" : a.status === "cancelled" ? "danger" : "warning"}
                      className="capitalize"
                    >
                      {a.status}
                    </Badge>
                    {a.status === "pending" && (
                      <>
                        <Button size="sm" isLoading={isUpdating} onClick={() => handleStatusChange(a, "upcoming")}>
                          <Check className="h-3.5 w-3.5" /> Confirm
                        </Button>
                        <Button size="sm" variant="outline" isLoading={isUpdating} onClick={() => handleStatusChange(a, "cancelled")}>
                          <X className="h-3.5 w-3.5" /> Cancel
                        </Button>
                      </>
                    )}
                    {a.status === "upcoming" && (
                      <>
                        <Button size="sm" onClick={() => toast.success("Joining call…")}><Video className="h-3.5 w-3.5" /> Join</Button>
                        <Button size="sm" variant="outline" isLoading={isUpdating} onClick={() => handleStatusChange(a, "completed")}>
                          <Check className="h-3.5 w-3.5" /> Complete
                        </Button>
                        <Button size="sm" variant="ghost" isLoading={isUpdating} onClick={() => handleStatusChange(a, "cancelled")}>
                          <X className="h-3.5 w-3.5" /> Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
