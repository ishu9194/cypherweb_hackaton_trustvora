import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { RadioGroup } from "@/components/ui/radio";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

const REASONS = [
  { value: "inaccurate", label: "Inaccurate profile information" },
  { value: "unresponsive", label: "Unresponsive after booking" },
  { value: "unprofessional", label: "Unprofessional conduct" },
  { value: "other", label: "Something else" },
];

export function ReportLawyerModal({ open, onOpenChange, lawyerName }: { open: boolean; onOpenChange: (open: boolean) => void; lawyerName: string }) {
  const [reason, setReason] = useState("inaccurate");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    onOpenChange(false);
    setDetails("");
    toast.success("Report submitted — our trust & safety team will review it within 24 hours.");
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Report ${lawyerName}`}
      description="Help us keep Trustix trustworthy. Reports are reviewed confidentially."
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit} isLoading={submitting}>Submit Report</Button>
        </>
      }
    >
      <div className="space-y-5">
        <RadioGroup options={REASONS} value={reason} onValueChange={setReason} />
        <Textarea
          label="Additional details (optional)"
          placeholder="Tell us more about what happened…"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>
    </Modal>
  );
}
