import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes.constants";

/**
 * PrivateRoute — Redirects unauthenticated users to /login with a returnTo state
 * so they come back to the page they wanted after logging in.
 */
export function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null; // Wait for auth check to complete

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.login}
        state={{ redirectTo: location.pathname + location.search }}
        replace
      />
    );
  }

  return <>{children}</>;
}
