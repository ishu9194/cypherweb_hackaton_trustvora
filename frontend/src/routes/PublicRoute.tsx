import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes.constants";

export function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    const dashboardHref =
      user.role === "lawyer" ? ROUTES.lawyerDashboard : user.role === "admin" ? ROUTES.adminDashboard : ROUTES.clientDashboard;
    return <Navigate to={dashboardHref} replace />;
  }

  return <>{children}</>;
}
