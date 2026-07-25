import type { User, UserRole } from "@/types";
import { sleep } from "@/lib/utils";
import { STORAGE_KEYS } from "@/constants/app.constants";
import { apiClient, USE_MOCK_DATA } from "./client";
import { ENDPOINTS } from "./endpoints";

interface AuthResponse {
  user: User;
  token: string;
}

const MOCK_USERS: Record<string, User> = {
  client: { id: "u-1", name: "Meet Agrawal", email: "client@trustora.dev", role: "client", avatarUrl: "https://i.pravatar.cc/80?img=13" },
  lawyer: { id: "u-2", name: "Adv. Priya Sharma", email: "lawyer@trustora.dev", role: "lawyer", avatarUrl: "https://i.pravatar.cc/80?img=47" },
  admin: { id: "u-3", name: "Admin", email: "admin@trustora.dev", role: "admin", avatarUrl: "https://i.pravatar.cc/80?img=5" },
};

export const authService = {
  async login(email: string, _password: string, role: UserRole = "client"): Promise<AuthResponse> {
    void _password; // mock only — never validated client-side in a real build
    if (USE_MOCK_DATA) {
      await sleep(600);
      const user = { ...MOCK_USERS[role], email };
      const token = `mock-token-${user.id}`;
      localStorage.setItem(STORAGE_KEYS.authToken, token);
      localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
      return { user, token };
    }
    return apiClient.post<AuthResponse>(ENDPOINTS.auth.login, { email, password: _password });
  },

  async register(name: string, email: string, role: UserRole = "client"): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      await sleep(600);
      const user: User = { id: `u-${Date.now()}`, name, email, role };
      const token = `mock-token-${user.id}`;
      localStorage.setItem(STORAGE_KEYS.authToken, token);
      localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
      return { user, token };
    }
    return apiClient.post<AuthResponse>(ENDPOINTS.auth.register, { name, email, role });
  },

  async logout(): Promise<void> {
    if (USE_MOCK_DATA) {
      await sleep(200);
      localStorage.removeItem(STORAGE_KEYS.authToken);
      localStorage.removeItem(STORAGE_KEYS.authUser);
      return;
    }
    await apiClient.post(ENDPOINTS.auth.logout);
  },

  getStoredUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.authUser);
    return raw ? (JSON.parse(raw) as User) : null;
  },
};
