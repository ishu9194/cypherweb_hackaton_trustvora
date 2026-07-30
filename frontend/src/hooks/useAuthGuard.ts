import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/toaster";
import { ROUTES } from "@/constants/routes.constants";

/**
 * useAuthGuard — wraps any action to require authentication.
 *
 * Usage:
 *   const { requireAuth } = useAuthGuard();
 *   <button onClick={() => requireAuth(() => doSomething(), "Log in to save lawyers")}>
 *     Save
 *   </button>
 */
export function useAuthGuard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (action: () => void, message?: string) => {
    if (isAuthenticated) {
      action();
    } else {
      toast.error(message || "Please log in to continue", {
        duration: 4000,
      });
      navigate(ROUTES.login, {
        state: { redirectTo: location.pathname + location.search },
      });
    }
  };

  return { requireAuth, isAuthenticated };
}
