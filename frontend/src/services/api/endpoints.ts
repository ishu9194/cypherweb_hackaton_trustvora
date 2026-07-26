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
    updateStatus: (id: string) => `/appointments/${id}/status`,
  },
  reviews: {
    create: "/reviews",
  },
  cases: {
    list: "/cases",
    detail: (id: string) => `/cases/${id}`,
  },
  payments: {
    list: "/payments",
    invoice: (id: string) => `/payments/${id}/invoice`,
  },
  admin: {
    stats: "/admin/stats",
    revenue: "/admin/revenue",
    cases: "/admin/cases",
    clients: "/admin/clients",
    lawyers: "/admin/lawyers",
    lawyerVerify: (id: string) => `/admin/lawyers/${id}/verify`,
    payments: "/admin/payments",
    payouts: "/admin/payouts",
    refunds: "/admin/refunds",
    refundDecision: (id: string) => `/admin/refunds/${id}/decision`,
    reports: "/admin/reports",
    reportExport: (id: string) => `/admin/reports/${id}/export`,
    tickets: "/admin/tickets",
    ticketDetail: (id: string) => `/admin/tickets/${id}`,
    ticketStatus: (id: string) => `/admin/tickets/${id}/status`,
    ticketReply: (id: string) => `/admin/tickets/${id}/reply`,
  },
} as const;
