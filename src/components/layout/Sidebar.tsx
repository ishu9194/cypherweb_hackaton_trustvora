import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, CalendarClock, Briefcase, FileText, MessageSquare, CreditCard,
  Star, Heart, Bell, Settings, Scale, ChevronLeft, Users, BarChart3, Shield, Gavel,
  UserCircle, LogOut, GitCompareArrows,
} from "lucide-react";
import { ROUTES } from "@/constants/routes.constants";
import { APP_NAME } from "@/constants/app.constants";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

interface SidebarLink {
  label: string;
  href: string;
  icon: ReactNode;
}

export const CLIENT_LINKS: SidebarLink[] = [
  { label: "Dashboard", href: ROUTES.clientDashboard, icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
  { label: "My Appointments", href: ROUTES.clientAppointments, icon: <CalendarClock className="h-4.5 w-4.5" /> },
  { label: "My Cases", href: ROUTES.clientCases, icon: <Briefcase className="h-4.5 w-4.5" /> },
  { label: "Messages", href: ROUTES.clientMessages, icon: <MessageSquare className="h-4.5 w-4.5" /> },
  { label: "Documents", href: ROUTES.clientDocuments, icon: <FileText className="h-4.5 w-4.5" /> },
  { label: "Payments", href: ROUTES.clientPayments, icon: <CreditCard className="h-4.5 w-4.5" /> },
  { label: "Saved Lawyers", href: ROUTES.clientSavedLawyers, icon: <Heart className="h-4.5 w-4.5" /> },
  { label: "Compare Lawyers", href: ROUTES.clientCompareLawyers, icon: <GitCompareArrows className="h-4.5 w-4.5" /> },
  { label: "Reviews", href: ROUTES.clientReviews, icon: <Star className="h-4.5 w-4.5" /> },
  { label: "Notifications", href: ROUTES.clientNotifications, icon: <Bell className="h-4.5 w-4.5" /> },
  { label: "Profile", href: ROUTES.clientProfile, icon: <UserCircle className="h-4.5 w-4.5" /> },
  { label: "Settings", href: ROUTES.clientSettings, icon: <Settings className="h-4.5 w-4.5" /> },
];

export const LAWYER_LINKS: SidebarLink[] = [
  { label: "Dashboard", href: ROUTES.lawyerDashboard, icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
  { label: "Appointments", href: ROUTES.lawyerAppointments, icon: <CalendarClock className="h-4.5 w-4.5" /> },
  { label: "Cases", href: ROUTES.lawyerCases, icon: <Briefcase className="h-4.5 w-4.5" /> },
  { label: "Messages", href: ROUTES.lawyerMessages, icon: <MessageSquare className="h-4.5 w-4.5" /> },
  { label: "Clients", href: ROUTES.lawyerClients, icon: <Users className="h-4.5 w-4.5" /> },
  { label: "Payments", href: ROUTES.lawyerPayments, icon: <CreditCard className="h-4.5 w-4.5" /> },
  { label: "Reviews", href: ROUTES.lawyerReviews, icon: <Star className="h-4.5 w-4.5" /> },
  { label: "Analytics", href: ROUTES.lawyerAnalytics, icon: <BarChart3 className="h-4.5 w-4.5" /> },
  { label: "Settings", href: ROUTES.lawyerSettings, icon: <Settings className="h-4.5 w-4.5" /> },
];

export const ADMIN_LINKS: SidebarLink[] = [
  { label: "Overview", href: ROUTES.adminDashboard, icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
  { label: "Lawyers", href: ROUTES.adminLawyers, icon: <Gavel className="h-4.5 w-4.5" /> },
  { label: "Clients", href: ROUTES.adminClients, icon: <Users className="h-4.5 w-4.5" /> },
  { label: "Cases", href: ROUTES.adminCases, icon: <Briefcase className="h-4.5 w-4.5" /> },
  { label: "Payments", href: ROUTES.adminPayments, icon: <CreditCard className="h-4.5 w-4.5" /> },
  { label: "Support", href: ROUTES.adminSupport, icon: <FileText className="h-4.5 w-4.5" /> },
  { label: "Reports", href: ROUTES.adminReports, icon: <Shield className="h-4.5 w-4.5" /> },
];

interface SidebarProps {
  variant?: "client" | "lawyer" | "admin";
}

export function Sidebar({ variant = "client" }: SidebarProps) {
  const { isOpen: expanded, toggle } = useDisclosure(true);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const links = variant === "lawyer" ? LAWYER_LINKS : variant === "admin" ? ADMIN_LINKS : CLIENT_LINKS;

  const handleLogout = async () => {
    await logout();
    toast.success("You've been logged out");
    navigate(ROUTES.home);
  };

  return (
    <motion.aside
      animate={{ width: expanded ? 264 : 84 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-surface md:flex"
    >
      <div className={cn("flex items-center gap-2 px-5 py-6", !expanded && "justify-center px-0")}>
        <Link to={ROUTES.home} className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 text-white">
            <Scale className="h-4.5 w-4.5" />
          </span>
          {expanded && <span className="font-display text-base font-bold text-foreground">{APP_NAME}</span>}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {links.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            end={link.href === ROUTES.clientDashboard || link.href === ROUTES.lawyerDashboard || link.href === ROUTES.adminDashboard}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-sunken hover:text-foreground",
                isActive && "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300",
                !expanded && "justify-center",
              )
            }
            title={!expanded ? link.label : undefined}
          >
            {link.icon}
            {expanded && link.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-border p-3">
        <button
          type="button"
          onClick={handleLogout}
          title={!expanded ? "Logout" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger",
            !expanded && "justify-center",
          )}
        >
          <LogOut className="h-4.5 w-4.5" />
          {expanded && "Logout"}
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-border text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-sunken"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", !expanded && "rotate-180")} />
          {expanded && "Collapse"}
        </button>
      </div>
    </motion.aside>
  );
}
