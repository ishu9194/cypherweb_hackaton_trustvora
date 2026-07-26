import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio";
import { Checkbox } from "@/components/ui/checkbox";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { ROUTES } from "@/constants/routes.constants";
import type { UserRole } from "@/types";

const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.literal(true, { error: "You must accept the terms to continue" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("client");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const password = watch("password", "");
  const agreeToTerms = watch("agreeToTerms");

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    navigate(ROUTES.verifyOtp, {
      state: { email: values.email, name: values.name, password: values.password, role, purpose: "register" },
    });
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Get matched with the right advocate in minutes.</p>

      <div className="mt-6">
        <RadioGroup
          orientation="horizontal"
          value={role}
          onValueChange={(v) => setRole(v as UserRole)}
          options={[
            { value: "client", label: "I'm a client" },
            { value: "lawyer", label: "I'm a lawyer" },
          ]}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input label="Full name" placeholder="Meet Agrawal" leftIcon={<User className="h-4 w-4" />} error={errors.name?.message} {...register("name")} />
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
        <div>
          <Input
            label="Password"
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
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          placeholder="Re-enter your password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          checked={agreeToTerms === true}
          onCheckedChange={(checked) => setValue("agreeToTerms", checked as true, { shouldValidate: true })}
        />
        {errors.agreeToTerms && <p className="text-xs font-medium text-danger">{errors.agreeToTerms.message}</p>}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">OR CONTINUE WITH</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <SocialLoginButtons />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to={ROUTES.login} className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
