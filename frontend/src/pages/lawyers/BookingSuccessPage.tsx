import { Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarPlus, CheckCircle2, Download, Home, LayoutDashboard, Receipt } from "lucide-react";
import type { Appointment } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { ROUTES } from "@/constants/routes.constants";
import { downloadTextFile, formatCurrency, formatDate, formatTime } from "@/lib/utils";

interface BookingSuccessState {
  appointment: Appointment;
  clientName: string;
  paymentMethod: string;
  documentCount: number;
}

function buildIcsFile(appointment: Appointment): string {
  const start = new Date(appointment.date);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Trustix//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${appointment.id}@trustix.in`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:Consultation with ${appointment.lawyerName}`,
    `DESCRIPTION:Trustix ${appointment.type} consultation.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function BookingSuccessPage() {
  const location = useLocation();
  const state = location.state as BookingSuccessState | null;

  if (!state?.appointment) return <Navigate to={ROUTES.home} replace />;

  const { appointment, clientName, paymentMethod, documentCount } = state;

  const handleAddToCalendar = () => {
    downloadTextFile(`trustix-${appointment.id}.ics`, buildIcsFile(appointment));
    toast.success("Calendar event downloaded — open it to add to your calendar");
  };

  const handleDownloadReceipt = () => {
    const content = [
      "Trustix — Booking Receipt",
      "================================",
      `Receipt ID: ${appointment.id}`,
      `Client: ${clientName}`,
      `Lawyer: ${appointment.lawyerName}`,
      `Consultation Type: ${appointment.type}`,
      `Date & Time: ${formatDate(appointment.date)} at ${formatTime(appointment.date)}`,
      `Payment Method: ${paymentMethod.toUpperCase()}`,
      `Documents Shared: ${documentCount}`,
      `Amount Paid: ${formatCurrency(appointment.fee)}`,
      "================================",
      `Generated ${new Date().toLocaleString("en-IN")}`,
    ].join("\n");
    downloadTextFile(`trustix-receipt-${appointment.id}.txt`, content);
    toast.success("Receipt downloaded");
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-500 text-white shadow-lifted"
      >
        <CheckCircle2 className="h-10 w-10" />
      </motion.div>

      <h1 className="mt-6 font-display text-2xl font-bold text-foreground sm:text-3xl">Booking Confirmed!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A confirmation has been sent to your email. {appointment.lawyerName} will see you soon.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mt-8 w-full rounded-2xl border border-border bg-surface p-6 text-left shadow-soft"
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Avatar src={appointment.lawyerAvatarUrl} name={appointment.lawyerName} size="md" />
            <div>
              <p className="text-sm font-semibold text-foreground">{appointment.lawyerName}</p>
              <Badge variant="brand" className="mt-1 capitalize">{appointment.type}</Badge>
            </div>
          </div>
          <p className="font-display text-lg font-bold text-foreground">{formatCurrency(appointment.fee)}</p>
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Receipt ID</dt>
            <dd className="font-medium text-foreground">{appointment.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Date & Time</dt>
            <dd className="font-medium text-foreground">{formatDate(appointment.date)} · {formatTime(appointment.date)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Payment Method</dt>
            <dd className="font-medium uppercase text-foreground">{paymentMethod}</dd>
          </div>
          {documentCount > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Documents Shared</dt>
              <dd className="font-medium text-foreground">{documentCount}</dd>
            </div>
          )}
        </dl>
      </motion.div>

      <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <Button variant="outline" onClick={handleAddToCalendar}>
          <CalendarPlus className="h-4 w-4" />
          Add to Calendar
        </Button>
        <Button variant="outline" onClick={handleDownloadReceipt}>
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>
      </div>

      <div className="mt-3 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <Button asChild>
          <Link to={ROUTES.clientDashboard}>
            <LayoutDashboard className="h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to={ROUTES.home}>
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <Link to={ROUTES.findLawyers} className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:underline">
        <Receipt className="h-3.5 w-3.5" />
        Book another consultation
      </Link>
    </div>
  );
}
