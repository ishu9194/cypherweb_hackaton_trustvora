import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { User, UserRole } from "@/types";
import { authService } from "@/services/api/auth.service";
import { STORAGE_KEYS } from "@/constants/app.constants";

/**
 * Fixed demo personas used only by the dev role switcher (bottom-right
 * floating widget). These are separate from the mock login flow in
 * auth.service.ts, which generates its own users from whatever email
 * the person types into the login form.
 */
export const DEV_PERSONAS: Record<UserRole, User> = {
  client: { id: "dev-client", name: "Sarah Jenkins", email: "sarah@client.com", role: "client", avatarUrl: "https://i.pravatar.cc/80?img=32" },
  lawyer: { id: "dev-lawyer", name: "Elena Rostova, Esq.", email: "elena@lawyer.com", role: "lawyer", avatarUrl: "https://i.pravatar.cc/80?img=44" },
  admin: { id: "dev-admin", name: "System Administrator", email: "admin@trustix.com", role: "admin", avatarUrl: "https://i.pravatar.cc/80?img=68" },
};

export type DevPersonaKey = UserRole | "guest";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<User>;
  register: (name: string, email: string, role?: UserRole) => Promise<User>;
  logout: () => Promise<void>;
  /** Dev-only: instantly swap the active session to a preset persona (or "guest" to sign out). */
  switchPersona: (persona: DevPersonaKey) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string, role: UserRole = "client") => {
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await authService.login(email, password, role);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, role: UserRole = "client") => {
    setIsLoading(true);
    try {
      const { user: newUser } = await authService.register(name, email, role);
      setUser(newUser);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const switchPersona = (persona: DevPersonaKey) => {
    if (persona === "guest") {
      localStorage.removeItem(STORAGE_KEYS.authToken);
      localStorage.removeItem(STORAGE_KEYS.authUser);
      setUser(null);
      return;
    }
    const nextUser = DEV_PERSONAS[persona];
    localStorage.setItem(STORAGE_KEYS.authToken, `dev-token-${nextUser.id}`);
    localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, isLoading, login, register, logout, switchPersona }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
