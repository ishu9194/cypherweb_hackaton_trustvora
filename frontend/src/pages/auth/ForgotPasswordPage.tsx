import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";
import { sleep } from "@/lib/utils";

const schema = z.object({ email: z.string().min(1, "Email is required").email("Enter a valid email address") });
type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    await sleep(600);
    setIsSubmitting(false);
    navigate(ROUTES.verifyOtp, { state: { email: values.email, purpose: "reset" } });
  };

  return (
    <div>
      <Link to={ROUTES.login} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to login
      </Link>
      <h1 className="font-display text-2xl font-bold text-foreground">Reset your password</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Enter the email tied to your account and we'll send a verification code.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Send verification code
        </Button>
      </form>
    </div>
  );
}
