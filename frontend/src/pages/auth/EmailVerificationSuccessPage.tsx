import { Link, Navigate, useLocation } from "react-router-dom";
import { SuccessState } from "@/components/states/SuccessState";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";

export function EmailVerificationSuccessPage() {
  const location = useLocation();
  const state = location.state as { email: string } | null;

  if (!state?.email) return <Navigate to={ROUTES.register} replace />;

  return (
    <SuccessState
      title="Email verified"
      description={`${state.email} is now confirmed. Your account is ready to use.`}
      action={
        <Button asChild>
          <Link to={ROUTES.home}>Go to Trustix</Link>
        </Button>
      }
    />
  );
}
