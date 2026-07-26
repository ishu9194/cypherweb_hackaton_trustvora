/**
 * Central route registry. Import ROUTES instead of hardcoding path strings
 * so links, redirects, and route definitions never drift out of sync.
 */
export const ROUTES = {
  // Public / marketing
  home: "/",
  findLawyers: "/find-lawyers",
  practiceAreas: "/practice-areas",
  services: "/services",
  pricing: "/pricing",
  blog: "/blog",
  about: "/about",
  contact: "/contact",
  lawyerProfile: (id: string = ":id") => `/lawyers/${id}`,
  bookLawyer: (id: string = ":id") => `/booking/${id}`,
  bookingSuccess: "/booking/success",

  // Auth
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  verifyOtp: "/verify-otp",
  resetPassword: "/reset-password",
  emailVerified: "/email-verified",
  passwordResetSuccess: "/password-reset-success",

  // Client
  clientDashboard: "/dashboard",
  clientAppointments: "/dashboard/appointments",
  clientCases: "/dashboard/cases",
  clientDocuments: "/dashboard/documents",
  clientMessages: "/dashboard/messages",
  clientPayments: "/dashboard/payments",
  clientSavedLawyers: "/dashboard/saved-lawyers",
  clientCompareLawyers: "/dashboard/compare",
  clientReviews: "/dashboard/reviews",
  clientNotifications: "/dashboard/notifications",
  clientProfile: "/dashboard/profile",
  clientSettings: "/dashboard/settings",

  // Lawyer
  lawyerDashboard: "/lawyer",
  lawyerAppointments: "/lawyer/appointments",
  lawyerCases: "/lawyer/cases",
  lawyerMessages: "/lawyer/messages",
  lawyerClients: "/lawyer/clients",
  lawyerPayments: "/lawyer/payments",
  lawyerReviews: "/lawyer/reviews",
  lawyerAnalytics: "/lawyer/analytics",
  lawyerSettings: "/lawyer/settings",

  // Admin
  adminDashboard: "/admin",
  adminLawyers: "/admin/lawyers",
  adminClients: "/admin/clients",
  adminCases: "/admin/cases",
  adminPayments: "/admin/payments",
  adminSupport: "/admin/support",
  adminReports: "/admin/reports",

  // System
  styleGuide: "/style-guide",
  privacyPolicy: "/privacy",
  termsConditions: "/terms",
  notFound: "/404",
  forbidden: "/403",
  serverError: "/500",
  maintenance: "/maintenance",
} as const;
