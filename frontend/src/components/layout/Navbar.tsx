import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Menu, Search, X } from "lucide-react";
import { NAV_LINKS, APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/routes.constants";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown } from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { LogOut, LayoutDashboard, Settings } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const dashboardHref =
    user?.role === "lawyer" ? ROUTES.lawyerDashboard : user?.role === "admin" ? ROUTES.adminDashboard : ROUTES.clientDashboard;

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <motion.div
        animate={{
          marginTop: scrolled ? 12 : 0,
          borderRadius: scrolled ? 20 : 0,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-shadow sm:px-6 lg:px-8",
          scrolled ? "glass shadow-medium py-2.5" : "bg-transparent py-4",
        )}
      >
        <Link to={ROUTES.home} className="flex items-center gap-2">
          <img src="/assets/logo.png" alt={`${APP_NAME} logo`} className="h-9 w-9 object-contain" />
          <span className="font-display text-lg font-bold text-foreground">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-600"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-sunken sm:flex"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          {isAuthenticated && (
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => navigate(user?.role === "lawyer" ? ROUTES.lawyerNotifications : user?.role === "admin" ? ROUTES.adminNotifications : ROUTES.clientNotifications)}
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-sunken sm:flex"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-danger" />
            </button>
          )}

          <ThemeToggle className="hidden sm:flex" />

          {isAuthenticated && user ? (
            <Dropdown
              trigger={
                <button type="button" className="ml-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30">
                  <Avatar src={user.avatarUrl} name={user.name} size="sm" />
                </button>
              }
              items={[
                { label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, onSelect: () => navigate(dashboardHref) },
                { label: "Settings", icon: <Settings className="h-4 w-4" />, onSelect: () => navigate(ROUTES.clientSettings) },
                "separator",
                { label: "Log out", icon: <LogOut className="h-4 w-4" />, destructive: true, onSelect: () => logout() },
              ]}
            />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link to={ROUTES.login}>Log in</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link to={ROUTES.register}>Register</Link>
              </Button>
            </div>
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-surface-sunken lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass mx-4 mt-2 overflow-hidden rounded-2xl shadow-medium lg:hidden"
          >
            <nav className="flex flex-col p-3">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-sunken hover:text-foreground",
                      isActive && "bg-surface-sunken text-foreground",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-border px-4 pt-3">
                <ThemeToggle />
                {!isAuthenticated && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={ROUTES.login}>Log in</Link>
                    </Button>
                    <Button variant="primary" size="sm" asChild>
                      <Link to={ROUTES.register}>Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
