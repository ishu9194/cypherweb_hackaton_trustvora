import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Loader } from "@/components/ui/loader";

import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ClientDashboardLayout, LawyerDashboardLayout, AdminDashboardLayout } from "@/layouts/DashboardLayout";

import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "@/routes/PublicRoute";

import { ROUTES } from "@/constants/routes.constants";

// Route-level code splitting: each page ships as its own chunk, fetched on demand.
const HomePage = lazy(() => import("@/pages/HomePage").then((m) => ({ default: m.HomePage })));
const StyleGuidePage = lazy(() => import("@/pages/StyleGuidePage").then((m) => ({ default: m.StyleGuidePage })));
const ComingSoonPage = lazy(() => import("@/pages/ComingSoonPage").then((m) => ({ default: m.ComingSoonPage })));
const AboutUsPage = lazy(() => import("@/pages/AboutUsPage").then((m) => ({ default: m.AboutUsPage })));
const ServicesPage = lazy(() => import("@/pages/ServicesPage").then((m) => ({ default: m.ServicesPage })));
const BlogPage = lazy(() => import("@/pages/BlogPage").then((m) => ({ default: m.BlogPage })));
const ContactPage = lazy(() => import("@/pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage").then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsConditionsPage = lazy(() => import("@/pages/TermsConditionsPage").then((m) => ({ default: m.TermsConditionsPage })));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage").then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage").then((m) => ({ default: m.ForgotPasswordPage })));
const OtpVerificationPage = lazy(() => import("@/pages/auth/OtpVerificationPage").then((m) => ({ default: m.OtpVerificationPage })));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage").then((m) => ({ default: m.ResetPasswordPage })));
const EmailVerificationSuccessPage = lazy(() => import("@/pages/auth/EmailVerificationSuccessPage").then((m) => ({ default: m.EmailVerificationSuccessPage })));
const PasswordResetSuccessPage = lazy(() => import("@/pages/auth/PasswordResetSuccessPage").then((m) => ({ default: m.PasswordResetSuccessPage })));
const DashboardHomePage = lazy(() => import("@/pages/dashboard/client/DashboardHomePage").then((m) => ({ default: m.DashboardHomePage })));
const AppointmentsPage = lazy(() => import("@/pages/dashboard/client/AppointmentsPage").then((m) => ({ default: m.AppointmentsPage })));
const CasesPage = lazy(() => import("@/pages/dashboard/client/CasesPage").then((m) => ({ default: m.CasesPage })));
const MessagesPage = lazy(() => import("@/pages/dashboard/client/MessagesPage").then((m) => ({ default: m.MessagesPage })));
const DocumentsPage = lazy(() => import("@/pages/dashboard/client/DocumentsPage").then((m) => ({ default: m.DocumentsPage })));
const PaymentsPage = lazy(() => import("@/pages/dashboard/client/PaymentsPage").then((m) => ({ default: m.PaymentsPage })));
const SavedLawyersPage = lazy(() => import("@/pages/dashboard/client/SavedLawyersPage").then((m) => ({ default: m.SavedLawyersPage })));
const CompareLawyersPage = lazy(() => import("@/pages/dashboard/client/CompareLawyersPage").then((m) => ({ default: m.CompareLawyersPage })));
const ReviewsPage = lazy(() => import("@/pages/dashboard/client/ReviewsPage").then((m) => ({ default: m.ReviewsPage })));
const NotificationsPage = lazy(() => import("@/pages/dashboard/client/NotificationsPage").then((m) => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import("@/pages/dashboard/client/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import("@/pages/dashboard/client/SettingsPage").then((m) => ({ default: m.SettingsPage })));
const LawyerDashboardHomePage = lazy(() => import("@/pages/dashboard/lawyer/LawyerDashboardHomePage").then((m) => ({ default: m.LawyerDashboardHomePage })));
const LawyerAppointmentsPage = lazy(() => import("@/pages/dashboard/lawyer/LawyerAppointmentsPage").then((m) => ({ default: m.LawyerAppointmentsPage })));
const LawyerClientsPage = lazy(() => import("@/pages/dashboard/lawyer/LawyerClientsPage").then((m) => ({ default: m.LawyerClientsPage })));
const LawyerAnalyticsPage = lazy(() => import("@/pages/dashboard/lawyer/LawyerAnalyticsPage").then((m) => ({ default: m.LawyerAnalyticsPage })));
const LawyerSettingsPage = lazy(() => import("@/pages/dashboard/lawyer/LawyerSettingsPage").then((m) => ({ default: m.LawyerSettingsPage })));
const LawyerCasesPage = lazy(() => import("@/pages/dashboard/lawyer/LawyerCasesPage").then((m) => ({ default: m.LawyerCasesPage })));
const LawyerMessagesPage = lazy(() => import("@/pages/dashboard/lawyer/LawyerMessagesPage").then((m) => ({ default: m.LawyerMessagesPage })));
const LawyerPaymentsPage = lazy(() => import("@/pages/dashboard/lawyer/LawyerPaymentsPage").then((m) => ({ default: m.LawyerPaymentsPage })));
const LawyerReviewsPage = lazy(() => import("@/pages/dashboard/lawyer/LawyerReviewsPage").then((m) => ({ default: m.LawyerReviewsPage })));
const AdminCasesPage = lazy(() => import("@/pages/dashboard/admin/AdminCasesPage").then((m) => ({ default: m.AdminCasesPage })));
const AdminPaymentsPage = lazy(() => import("@/pages/dashboard/admin/AdminPaymentsPage").then((m) => ({ default: m.AdminPaymentsPage })));
const AdminSupportTicketsPage = lazy(() => import("@/pages/dashboard/admin/AdminSupportTicketsPage").then((m) => ({ default: m.AdminSupportTicketsPage })));
const AdminOverviewPage = lazy(() => import("@/pages/dashboard/admin/AdminOverviewPage").then((m) => ({ default: m.AdminOverviewPage })));
const AdminLawyersPage = lazy(() => import("@/pages/dashboard/admin/AdminLawyersPage").then((m) => ({ default: m.AdminLawyersPage })));
const AdminClientsPage = lazy(() => import("@/pages/dashboard/admin/AdminClientsPage").then((m) => ({ default: m.AdminClientsPage })));
const AdminReportsPage = lazy(() => import("@/pages/dashboard/admin/AdminReportsPage").then((m) => ({ default: m.AdminReportsPage })));
const NotFoundPage = lazy(() => import("@/pages/errors/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));
const ForbiddenPage = lazy(() => import("@/pages/errors/ForbiddenPage").then((m) => ({ default: m.ForbiddenPage })));
const ServerErrorPage = lazy(() => import("@/pages/errors/ServerErrorPage").then((m) => ({ default: m.ServerErrorPage })));
const MaintenancePage = lazy(() => import("@/pages/errors/MaintenancePage").then((m) => ({ default: m.MaintenancePage })));
const FindLawyersPage = lazy(() => import("@/pages/lawyers/FindLawyersPage").then((m) => ({ default: m.FindLawyersPage })));
const LawyerProfilePage = lazy(() => import("@/pages/lawyers/LawyerProfilePage").then((m) => ({ default: m.LawyerProfilePage })));
const BookingFlowPage = lazy(() => import("@/pages/lawyers/BookingFlowPage").then((m) => ({ default: m.BookingFlowPage })));
const BookingSuccessPage = lazy(() => import("@/pages/lawyers/BookingSuccessPage").then((m) => ({ default: m.BookingSuccessPage })));

function AppRoutes() {
  return (
    <Routes>
      {/* Public marketing site */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.findLawyers} element={<FindLawyersPage />} />
        <Route path={ROUTES.practiceAreas} element={<ComingSoonPage title="Practice Areas — coming soon" description="A dedicated directory of all 20 practice areas is on the way." />} />
        <Route path={ROUTES.services} element={<ServicesPage />} />
        <Route path={ROUTES.pricing} element={<ComingSoonPage title="Pricing — coming soon" description="Transparent plan comparisons are being finalized." />} />
        <Route path={ROUTES.blog} element={<BlogPage />} />
        <Route path={ROUTES.about} element={<AboutUsPage />} />
        <Route path={ROUTES.contact} element={<ContactPage />} />
        <Route path={ROUTES.privacyPolicy} element={<PrivacyPolicyPage />} />
        <Route path={ROUTES.termsConditions} element={<TermsConditionsPage />} />
        <Route path={ROUTES.lawyerProfile()} element={<LawyerProfilePage />} />
        <Route path={ROUTES.bookLawyer()} element={<BookingFlowPage />} />
        <Route path={ROUTES.bookingSuccess} element={<BookingSuccessPage />} />
        <Route path={ROUTES.styleGuide} element={<StyleGuidePage />} />
      </Route>

      {/* Auth entry points — redirect away if already logged in */}
      <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
      </Route>

      {/* Auth flow continuations — reachable mid-flow regardless of auth state */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.verifyOtp} element={<OtpVerificationPage />} />
        <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />
        <Route path={ROUTES.emailVerified} element={<EmailVerificationSuccessPage />} />
        <Route path={ROUTES.passwordResetSuccess} element={<PasswordResetSuccessPage />} />
      </Route>

      {/* Client dashboard */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["client"]}>
            <ClientDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.clientDashboard} element={<DashboardHomePage />} />
        <Route path={ROUTES.clientAppointments} element={<AppointmentsPage />} />
        <Route path={ROUTES.clientCases} element={<CasesPage />} />
        <Route path={ROUTES.clientDocuments} element={<DocumentsPage />} />
        <Route path={ROUTES.clientMessages} element={<MessagesPage />} />
        <Route path={ROUTES.clientPayments} element={<PaymentsPage />} />
        <Route path={ROUTES.clientSavedLawyers} element={<SavedLawyersPage />} />
        <Route path={ROUTES.clientCompareLawyers} element={<CompareLawyersPage />} />
        <Route path={ROUTES.clientReviews} element={<ReviewsPage />} />
        <Route path={ROUTES.clientNotifications} element={<NotificationsPage />} />
        <Route path={ROUTES.clientProfile} element={<ProfilePage />} />
        <Route path={ROUTES.clientSettings} element={<SettingsPage />} />
      </Route>

      {/* Lawyer dashboard */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["lawyer"]}>
            <LawyerDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.lawyerDashboard} element={<LawyerDashboardHomePage />} />
        <Route path={ROUTES.lawyerAppointments} element={<LawyerAppointmentsPage />} />
        <Route path={ROUTES.lawyerCases} element={<LawyerCasesPage />} />
        <Route path={ROUTES.lawyerMessages} element={<LawyerMessagesPage />} />
        <Route path={ROUTES.lawyerClients} element={<LawyerClientsPage />} />
        <Route path={ROUTES.lawyerPayments} element={<LawyerPaymentsPage />} />
        <Route path={ROUTES.lawyerReviews} element={<LawyerReviewsPage />} />
        <Route path={ROUTES.lawyerAnalytics} element={<LawyerAnalyticsPage />} />
        <Route path={ROUTES.lawyerSettings} element={<LawyerSettingsPage />} />
      </Route>

      {/* Admin panel */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.adminDashboard} element={<AdminOverviewPage />} />
        <Route path={ROUTES.adminLawyers} element={<AdminLawyersPage />} />
        <Route path={ROUTES.adminClients} element={<AdminClientsPage />} />
        <Route path={ROUTES.adminCases} element={<AdminCasesPage />} />
        <Route path={ROUTES.adminPayments} element={<AdminPaymentsPage />} />
        <Route path={ROUTES.adminSupport} element={<AdminSupportTicketsPage />} />
        <Route path={ROUTES.adminReports} element={<AdminReportsPage />} />
      </Route>

      {/* System pages */}
      <Route path={ROUTES.forbidden} element={<ForbiddenPage />} />
      <Route path={ROUTES.serverError} element={<ServerErrorPage />} />
      <Route path={ROUTES.maintenance} element={<MaintenancePage />} />
      <Route path={ROUTES.notFound} element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider delayDuration={200}>
            <Suspense fallback={<Loader fullPage label="Loading Trustix…" />}>
              <AnimatePresence mode="wait">
                <AppRoutes />
              </AnimatePresence>
            </Suspense>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
