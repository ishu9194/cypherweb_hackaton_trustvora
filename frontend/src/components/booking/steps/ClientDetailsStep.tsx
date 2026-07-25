import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const clientDetailsSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(10, "Enter a valid phone number").max(15),
  notes: z
    .string()
    .min(20, "Please describe your situation in at least 20 characters")
    .max(500, "Keep your case overview under 500 characters"),
});

export type ClientDetailsValues = z.infer<typeof clientDetailsSchema>;

export interface ClientDetailsStepHandle {
  submit: () => Promise<ClientDetailsValues | null>;
}

interface ClientDetailsStepProps {
  defaultValues: ClientDetailsValues;
}

export const ClientDetailsStep = forwardRef<ClientDetailsStepHandle, ClientDetailsStepProps>(({ defaultValues }, ref) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientDetailsValues>({ resolver: zodResolver(clientDetailsSchema), defaultValues });

  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise((resolve) => {
        handleSubmit(
          (values) => resolve(values),
          () => resolve(null),
        )();
      }),
  }));

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground">Your details</h2>
      <p className="mt-1 text-sm text-muted-foreground">This is who the lawyer will be speaking with.</p>

      <form className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full name" placeholder="Meet Agrawal" error={errors.name?.message} {...register("name")} />
          <Input label="Phone number" placeholder="98765 43210" error={errors.phone?.message} {...register("phone")} />
        </div>
        <Input label="Email address" type="email" placeholder="you@email.com" error={errors.email?.message} {...register("email")} />
        <Textarea
          label="Case overview"
          placeholder="Briefly describe your situation… (minimum 20 characters)"
          rows={4}
          hint="This helps the lawyer prepare before your consultation."
          error={errors.notes?.message}
          {...register("notes")}
        />
      </form>
    </div>
  );
});
ClientDetailsStep.displayName = "ClientDetailsStep";
