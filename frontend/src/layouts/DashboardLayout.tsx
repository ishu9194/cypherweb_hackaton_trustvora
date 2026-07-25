import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bell, LogOut, Scale, Settings, LayoutDashboard, Menu } from "lucide-react";
import { Sidebar, CLIENT_LINKS, LAWYER_LINKS, ADMIN_LINKS } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { PageTransition } from "@/components/common/PageTransition";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown } from "@/components/ui/dropdown";
import { Drawer } from "@/components/ui/drawer";
import { toast } from "@/components/ui/toaster";
import { useAuth } from "@/context/AuthContext";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ROUTES } from "@/constants/routes.constants";
import { APP_NAME } from "@/constants/app.constants";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  variant?: "client" | "lawyer" | "admin";
  title?: string;
}

export function DashboardLayout({ variant = "client", title }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const mobileNav = useDisclosure();

  const dashboardHref = variant === "lawyer" ? ROUTES.lawyerDashboard : variant === "admin" ? ROUTES.adminDashboard : ROUTES.clientDashboard;
  const settingsHref = variant === "lawyer" ? ROUTES.lawyerSettings : ROUTES.clientSettings;
  const links = variant === "lawyer" ? LAWYER_LINKS : variant === "admin" ? ADMIN_LINKS : CLIENT_LINKS;

  const handleLogout = async () => {
    await logout();
    toast.success("You've been logged out");
    mobileNav.close();
    navigate(ROUTES.home);
  };

  return (
    <div className="flex min-h-screen bg-surface-sunken">
      <Sidebar variant={variant} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={mobileNav.open}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-surface-sunken md:hidden"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
            <div className="flex items-center gap-2 md:hidden">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 text-white">
                <Scale className="h-4 w-4" />
              </span>
              <span className="font-display text-sm font-bold text-foreground">{APP_NAME}</span>
            </div>
            <h1 className="hidden font-display text-lg font-semibold text-foreground md:block">{title}</h1>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => navigate(ROUTES.clientNotifications)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-sunken"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-danger" />
            </button>
            <ThemeToggle />
            {user && (
              <Dropdown
                trigger={
                  <button type="button" className="ml-1 flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30">
                    <Avatar src={user.avatarUrl} name={user.name} size="sm" />
                  </button>
                }
                items={[
                  { label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, onSelect: () => navigate(dashboardHref) },
                  { label: "Settings", icon: <Settings className="h-4 w-4" />, onSelect: () => navigate(settingsHref) },
                  "separator",
                  { label: "Log out", icon: <LogOut className="h-4 w-4" />, destructive: true, onSelect: handleLogout },
                ]}
              />
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      <Drawer open={mobileNav.isOpen} onOpenChange={mobileNav.close} title={title ?? APP_NAME} side="left" width="max-w-xs">
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === dashboardHref}
              onClick={mobileNav.close}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-sunken hover:text-foreground",
                  isActive && "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300",
                )
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout
          </button>
        </nav>
      </Drawer>
    </div>
  );
}

export function ClientDashboardLayout() {
  return <DashboardLayout variant="client" title="Client Dashboard" />;
}
export function LawyerDashboardLayout() {
  return <DashboardLayout variant="lawyer" title="Lawyer Dashboard" />;
}
export function AdminDashboardLayout() {
  return <DashboardLayout variant="admin" title="Admin Panel" />;
}
