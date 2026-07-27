import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { OtpInput } from "@/components/auth/OtpInput";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes.constants";
import { sleep } from "@/lib/utils";
import type { UserRole } from "@/types";

interface OtpLocationState {
  email: string;
  purpose: "reset" | "register";
  name?: string;
  password?: string;
  role?: UserRole;
}

const RESEND_SECONDS = 30;
const DEMO_CODE = "123456";

export function OtpVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OtpLocationState | null;
  const { register: registerUser } = useAuth();

  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [otpKey, setOtpKey] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  if (!state?.email) return <Navigate to={ROUTES.forgotPassword} replace />;

  const handleComplete = async (code: string) => {
    setIsVerifying(true);
    await sleep(600);
    setIsVerifying(false);

    if (code !== DEMO_CODE) {
      setError(true);
      toast.error("Incorrect verification code. Please try again.");
      return;
    }

    setError(false);
    if (state.purpose === "reset") {
      navigate(ROUTES.resetPassword, { state: { email: state.email } });
    } else {
      try {
        await registerUser(state.name ?? "New User", state.email, state.password ?? "", state.role ?? "client");
        navigate(ROUTES.emailVerified, { state: { email: state.email } });
      } catch {
        toast.error("Couldn't create your account. Please try registering again.");
      }
    }
  };

  const handleResend = async () => {
    setSecondsLeft(RESEND_SECONDS);
    setOtpKey((k) => k + 1);
    toast.success(`New code sent to ${state.email}`);
  };

  return (
    <div>
      <Link to={ROUTES.login} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to login
      </Link>

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10">
        <ShieldCheck className="h-5.5 w-5.5" />
      </div>

      <h1 className="mt-4 text-center font-display text-2xl font-bold text-foreground">Verify your email</h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        We sent a 6-digit code to <span className="font-medium text-foreground">{state.email}</span>. Enter it below to complete verification.
      </p>


      <div className="mt-8">
        <OtpInput key={otpKey} onComplete={handleComplete} error={error} />
      </div>

      {isVerifying && <p className="mt-4 text-center text-xs text-muted-foreground">Verifying…</p>}

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {secondsLeft > 0 ? (
          <span>Resend code in {secondsLeft}s</span>
        ) : (
          <Button variant="link" size="sm" onClick={handleResend} className="h-auto p-0">
            Resend code
          </Button>
        )}
      </div>
    </div>
  );
}
