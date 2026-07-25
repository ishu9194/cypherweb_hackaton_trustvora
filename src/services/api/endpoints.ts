/**
 * Every backend route the frontend will eventually call, in one place.
 * Keeps *.service.ts files free of hardcoded path strings.
 */
export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
  },
  lawyers: {
    list: "/lawyers",
    detail: (id: string) => `/lawyers/${id}`,
    reviews: (id: string) => `/lawyers/${id}/reviews`,
  },
  appointments: {
    list: "/appointments",
    create: "/appointments",
    detail: (id: string) => `/appointments/${id}`,
    cancel: (id: string) => `/appointments/${id}/cancel`,
  },
  cases: {
    list: "/cases",
    detail: (id: string) => `/cases/${id}`,
  },
  payments: {
    list: "/payments",
    invoice: (id: string) => `/payments/${id}/invoice`,
  },
} as const;
