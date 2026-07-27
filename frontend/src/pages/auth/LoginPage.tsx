import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup } from "@/components/ui/radio";
import { toast } from "@/components/ui/toaster";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes.constants";
import type { UserRole } from "@/types";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [role, setRole] = useState<UserRole>("client");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { remember: true } });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      toast.success("Welcome back!");
      const redirectTo = (location.state as { from?: Location })?.from?.pathname;
      navigate(redirectTo || ROUTES.home);
    } catch {
      toast.error("Couldn't log you in. Check your details and try again.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Log in to manage your consultations and cases.</p>


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
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="pointer-events-auto" aria-label="Toggle password visibility">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" checked={remember} onCheckedChange={setRemember} />
          <Link to={ROUTES.forgotPassword} className="text-sm font-medium text-brand-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Log in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">OR CONTINUE WITH</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <SocialLoginButtons />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Trustix?{" "}
        <Link to={ROUTES.register} className="font-medium text-brand-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
