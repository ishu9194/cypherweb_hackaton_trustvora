import { Link } from "react-router-dom";
import { SuccessState } from "@/components/states/SuccessState";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";

export function PasswordResetSuccessPage() {
  return (
    <SuccessState
      title="Password reset"
      description="Your password has been updated. Use it the next time you log in."
      action={
        <Button asChild>
          <Link to={ROUTES.login}>Continue to login</Link>
        </Button>
      }
    />
  );
}
