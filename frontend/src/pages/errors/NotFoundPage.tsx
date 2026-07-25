import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="mx-auto max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10"
        >
          <Compass className="h-9 w-9" />
        </motion.div>
        <p className="font-display text-6xl font-bold text-gradient-brand">404</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for may have moved or no longer exists. Let's get you back on track.
        </p>
        <Button asChild className="mt-8">
          <Link to={ROUTES.home}>
            <Home className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
