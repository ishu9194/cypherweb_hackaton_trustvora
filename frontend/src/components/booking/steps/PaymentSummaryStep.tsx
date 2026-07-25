import { useState } from "react";
import { BadgePercent, Building2, CreditCard, Smartphone, Wallet } from "lucide-react";
import type { ConsultationType, Lawyer } from "@/types";
import { RadioGroup } from "@/components/ui/radio";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toaster";
import { formatCurrency, formatDate } from "@/lib/utils";

const CONSULTATION_LABELS: Record<ConsultationType, string> = {
  video: "Video Call",
  voice: "Voice Call",
  chat: "Chat Consultation",
  office: "Office Visit",
};

const PAYMENT_METHODS = [
  { value: "upi", label: "UPI", icon: Smartphone },
  { value: "card", label: "Credit / Debit Card", icon: CreditCard },
  { value: "netbanking", label: "Net Banking", icon: Building2 },
  { value: "wallet", label: "Wallet", icon: Wallet },
];

interface PaymentSummaryStepProps {
  lawyer: Lawyer;
  consultationType: ConsultationType;
  date: Date;
  time: string;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  couponApplied: boolean;
  onApplyCoupon: () => void;
  termsAccepted: boolean;
  onTermsAcceptedChange: (accepted: boolean) => void;
}

export function PaymentSummaryStep({
  lawyer, consultationType, date, time, paymentMethod, onPaymentMethodChange, couponApplied, onApplyCoupon,
  termsAccepted, onTermsAcceptedChange,
}: PaymentSummaryStepProps) {
  const [couponCode, setCouponCode] = useState("");
  const platformFee = 49;
  const discount = couponApplied ? Math.round(lawyer.consultationFee * 0.1) : 0;
  const total = lawyer.consultationFee + platformFee - discount;

  const handleApply = () => {
    if (couponCode.trim().toUpperCase() !== "FIRST10") {
      toast.error("Invalid coupon code. Try FIRST10 for 10% off.");
      return;
    }
    onApplyCoupon();
    toast.success("Coupon applied — 10% off your consultation fee");
  };

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground">Payment summary</h2>
      <p className="mt-1 text-sm text-muted-foreground">Review your booking details before confirming.</p>

      <div className="mt-6 rounded-xl border border-border bg-surface-sunken p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Lawyer</span>
          <span className="font-medium text-foreground">{lawyer.name}</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Type</span>
          <span className="font-medium text-foreground">{CONSULTATION_LABELS[consultationType]}</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Date & Time</span>
          <span className="font-medium text-foreground">{formatDate(date.toISOString())} · {time}</span>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Input placeholder="Coupon code (try FIRST10)" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} disabled={couponApplied} />
        <Button variant="outline" onClick={handleApply} disabled={couponApplied} className="shrink-0">
          <BadgePercent className="h-4 w-4" />
          {couponApplied ? "Applied" : "Apply"}
        </Button>
      </div>

      <div className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Consultation fee</span>
          <span>{formatCurrency(lawyer.consultationFee)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Platform fee</span>
          <span>{formatCurrency(platformFee)}</span>
        </div>
        {couponApplied && (
          <div className="flex justify-between text-accent-600">
            <span>Discount (FIRST10)</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-foreground">Payment method</p>
        <RadioGroup
          options={PAYMENT_METHODS.map((m) => ({ value: m.value, label: m.label }))}
          value={paymentMethod}
          onValueChange={onPaymentMethodChange}
        />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface-sunken p-4">
        <Checkbox
          checked={termsAccepted}
          onCheckedChange={onTermsAcceptedChange}
          label="I agree to the Terms & Conditions and Cancellation Policy"
          description="You must accept these to confirm your booking."
        />
      </div>
    </div>
  );
}
