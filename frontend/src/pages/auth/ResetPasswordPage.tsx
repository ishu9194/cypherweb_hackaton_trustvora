import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { ROUTES } from "@/constants/routes.constants";
import { sleep } from "@/lib/utils";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { email: string } | null;

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (!state?.email) return <Navigate to={ROUTES.forgotPassword} replace />;

  const password = watch("password", "");

  const onSubmit = async () => {
    setIsSubmitting(true);
    await sleep(700);
    setIsSubmitting(false);
    navigate(ROUTES.passwordResetSuccess);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Set a new password</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Choose a strong password you haven't used before.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Input
            label="New password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 8 characters"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="pointer-events-auto" aria-label="Toggle password visibility">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <Input
          label="Confirm new password"
          type={showPassword ? "text" : "password"}
          placeholder="Re-enter your password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Reset password
        </Button>
      </form>
    </div>
  );
}
