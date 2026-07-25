import { Video, CalendarClock } from "lucide-react";
import { APPOINTMENTS } from "@/data/testimonials.data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { formatDate } from "@/lib/utils";

export function LawyerAppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Appointments</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your client consultations.</p>
      </div>
      <div className="space-y-3">
        {APPOINTMENTS.map((a) => (
          <Card key={a.id} lift>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={a.clientName} size="md" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{a.clientName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(a.date)} · {a.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={a.status === "upcoming" ? "brand" : a.status === "completed" ? "success" : "danger"} className="capitalize">{a.status}</Badge>
                {a.status === "upcoming" && (
                  <>
                    <Button size="sm" onClick={() => toast.success("Joining call…")}><Video className="h-3.5 w-3.5" /> Join</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Reschedule flow opened")}><CalendarClock className="h-3.5 w-3.5" /> Reschedule</Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
