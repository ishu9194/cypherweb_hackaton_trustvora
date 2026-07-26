import type { User, UserRole } from "@/types";
import { STORAGE_KEYS } from "@/constants/app.constants";
import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

/** Backend enum is uppercase (CLIENT/LAWYER/ADMIN); the rest of the app uses lowercase. */
type BackendRole = "CLIENT" | "LAWYER" | "ADMIN";

interface BackendUser {
  id: string;
  email: string;
  name: string;
  role: BackendRole;
  createdAt: string;
  avatarUrl?: string;
  lawyerProfile?: unknown;
}

interface AuthResponse {
  user: User;
  token: string;
}

function toRole(role: BackendRole): UserRole {
  return role.toLowerCase() as UserRole;
}

function toFrontendUser(user: BackendUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: toRole(user.role),
    avatarUrl: user.avatarUrl,
  };
}

function persistSession(user: User, token: string) {
  localStorage.setItem(STORAGE_KEYS.authToken, token);
  localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { user, token } = await apiClient.post<{ user: BackendUser; token: string }>(
      ENDPOINTS.auth.login,
      { email, password },
    );
    const frontendUser = toFrontendUser(user);
    persistSession(frontendUser, token);
    return { user: frontendUser, token };
  },

  async register(name: string, email: string, password: string, role: UserRole = "client"): Promise<AuthResponse> {
    const { user, token } = await apiClient.post<{ user: BackendUser; token: string }>(
      ENDPOINTS.auth.register,
      { name, email, password, role: role.toUpperCase() },
    );
    const frontendUser = toFrontendUser(user);
    persistSession(frontendUser, token);
    return { user: frontendUser, token };
  },

  /** The backend has no /auth/logout route (JWTs are stateless) — just drop the local session. */
  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.authUser);
  },

  /** Re-hydrates the current user from the token on app mount. Returns null if there's no valid session. */
  async fetchCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    if (!token) return null;

    try {
      const user = await apiClient.get<BackendUser>(ENDPOINTS.auth.me);
      const frontendUser = toFrontendUser(user);
      localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(frontendUser));
      return frontendUser;
    } catch {
      // Token missing/expired/invalid — clear the stale session.
      localStorage.removeItem(STORAGE_KEYS.authToken);
      localStorage.removeItem(STORAGE_KEYS.authUser);
      return null;
    }
  },

  getStoredUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.authUser);
    return raw ? (JSON.parse(raw) as User) : null;
  },
};
