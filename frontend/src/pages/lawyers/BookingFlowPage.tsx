import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import type { ConsultationType, Lawyer } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Loader } from "@/components/ui/loader";
import { toast } from "@/components/ui/toaster";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { ConsultationTypeStep } from "@/components/booking/steps/ConsultationTypeStep";
import { DateStep } from "@/components/booking/steps/DateStep";
import { TimeSlotStep } from "@/components/booking/steps/TimeSlotStep";
import { ClientDetailsStep, type ClientDetailsStepHandle, type ClientDetailsValues } from "@/components/booking/steps/ClientDetailsStep";
import { DocumentUploadStep, type UploadedDoc } from "@/components/booking/steps/DocumentUploadStep";
import { PaymentSummaryStep } from "@/components/booking/steps/PaymentSummaryStep";
import { useAuth } from "@/context/AuthContext";
import { appointmentsService } from "@/services/api/appointments.service";
import { lawyersService } from "@/services/api/lawyers.service";
import { ROUTES } from "@/constants/routes.constants";
import { formatCurrency } from "@/lib/utils";

const STEPS = [
  { label: "Type" },
  { label: "Date" },
  { label: "Time" },
  { label: "Details" },
  { label: "Documents" },
  { label: "Payment" },
];

export function BookingFlowPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);
    lawyersService.getById(id).then((res) => {
      if (cancelled) return;
      if (res) {
        setLawyer(res);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const [step, setStep] = useState(1);
  const [consultationType, setConsultationType] = useState<ConsultationType | null>(null);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string | null>(null);
  const [clientDetails, setClientDetails] = useState<ClientDetailsValues>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    notes: "",
  });
  const [files, setFiles] = useState<UploadedDoc[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [couponApplied, setCouponApplied] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clientDetailsRef = useRef<ClientDetailsStepHandle>(null);

  if (notFound) return <Navigate to={ROUTES.notFound} replace />;
  if (isLoading || !lawyer) return <Loader fullPage label="Loading booking details…" />;

  const canProceed = () => {
    switch (step) {
      case 1:
        return consultationType !== null;
      case 2:
        return date !== undefined;
      case 3:
        return time !== null;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (step === 4) {
      const values = await clientDetailsRef.current?.submit();
      if (!values) return;
      setClientDetails(values);
      setStep(5);
      return;
    }
    if (!canProceed()) {
      toast.error("Please complete this step before continuing");
      return;
    }
    setStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleConfirmAndPay = async () => {
    if (!date || !time || !consultationType) return;
    if (!termsAccepted) {
      toast.error("Please accept the Terms & Conditions to confirm your booking");
      return;
    }
    setIsSubmitting(true);
    try {
      const [hourMinute, meridiem] = time.split(" ");
      const [hourStr, minuteStr] = hourMinute.split(":");
      let hour = parseInt(hourStr, 10);
      if (meridiem === "PM" && hour !== 12) hour += 12;
      if (meridiem === "AM" && hour === 12) hour = 0;
      const appointmentDate = new Date(date);
      appointmentDate.setHours(hour, parseInt(minuteStr, 10), 0, 0);

      const fee = lawyer.consultationFee + 49 - (couponApplied ? Math.round(lawyer.consultationFee * 0.1) : 0);

      const appointment = await appointmentsService.create({
        lawyerId: lawyer.id,
        lawyerName: lawyer.name,
        lawyerAvatarUrl: lawyer.avatarUrl,
        date: appointmentDate.toISOString(),
        type: consultationType,
        fee,
      });

      navigate(ROUTES.bookingSuccess, {
        state: {
          appointment,
          clientName: clientDetails.name,
          paymentMethod,
          documentCount: files.length,
        },
      });
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong confirming your booking. Please try again.");
    } finally {

      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Find Lawyers", href: ROUTES.findLawyers }, { label: lawyer.name, href: ROUTES.lawyerProfile(lawyer.id) }, { label: "Book" }]} />

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
        <Avatar src={lawyer.avatarUrl} name={lawyer.name} size="md" online={lawyer.online} verified={lawyer.verified} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{lawyer.name}</p>
          <p className="text-xs text-muted-foreground">{lawyer.specializations.join(" · ")}</p>
        </div>
        <p className="font-display text-base font-bold text-foreground">{formatCurrency(lawyer.consultationFee)}</p>
      </div>

      <div className="mt-6">
        <BookingStepper steps={STEPS} currentStep={step} />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && <ConsultationTypeStep value={consultationType} onChange={setConsultationType} />}
            {step === 2 && <DateStep value={date} onChange={setDate} />}
            {step === 3 && date && <TimeSlotStep date={date} lawyerId={lawyer.id} value={time} onChange={setTime} />}
            {step === 4 && <ClientDetailsStep ref={clientDetailsRef} defaultValues={clientDetails} />}
            {step === 5 && <DocumentUploadStep files={files} onFilesChange={setFiles} />}
            {step === 6 && date && time && consultationType && (
              <PaymentSummaryStep
                lawyer={lawyer}
                consultationType={consultationType}
                date={date}
                time={time}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                couponApplied={couponApplied}
                onApplyCoupon={() => setCouponApplied(true)}
                termsAccepted={termsAccepted}
                onTermsAcceptedChange={setTermsAccepted}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {step < STEPS.length ? (
            <Button onClick={handleNext}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleConfirmAndPay}
              isLoading={isSubmitting}
              disabled={!termsAccepted}
              aria-disabled={!termsAccepted}
              title={!termsAccepted ? "Accept the Terms & Conditions to continue" : undefined}
            >
              <ShieldCheck className="h-4 w-4" />
              Confirm & Pay
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingFlowPage;
