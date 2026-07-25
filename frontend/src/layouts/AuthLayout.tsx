import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Star, Users } from "lucide-react";
import { ROUTES } from "@/constants/routes.constants";
import { APP_NAME, APP_TAGLINE } from "@/constants/app.constants";

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Verified advocates only" },
  { icon: Users, label: "1M+ clients served" },
  { icon: Star, label: "4.8 average rating" },
];

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-900 p-10 text-white lg:flex">
        <div className="gradient-mesh pointer-events-none absolute inset-0 opacity-70" />

        <Link to={ROUTES.home} className="relative z-10 flex items-center gap-2">
          <img src="/assets/logo.png" alt={`${APP_NAME} logo`} className="h-9 w-9 object-contain" />
          <span className="font-display text-lg font-bold">{APP_NAME}</span>
        </Link>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl font-bold leading-tight"
          >
            {APP_TAGLINE}
          </motion.h2>
          <p className="mt-4 max-w-md text-sm text-navy-200">
            Join thousands of clients and verified advocates already resolving legal matters on {APP_NAME}.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-navy-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-navy-300">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
      </div>

      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link to={ROUTES.home} className="mb-8 flex items-center gap-2 lg:hidden">
            <img src="/assets/logo.png" alt={`${APP_NAME} logo`} className="h-9 w-9 object-contain" />
            <span className="font-display text-lg font-bold text-foreground">{APP_NAME}</span>
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
