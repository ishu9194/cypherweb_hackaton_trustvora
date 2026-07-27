import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";
import { ROUTES } from "@/constants/routes.constants";
import { Loader } from "@/components/ui/loader";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader fullPage label="Checking your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  if (allowedRoles && user) {
    const userRoleLower = user.role.toLowerCase();
    const allowedLower = allowedRoles.map((r) => r.toLowerCase());
    if (!allowedLower.includes(userRoleLower)) {
      return <Navigate to={ROUTES.forbidden} replace />;
    }
  }

  return <>{children}</>;
}
