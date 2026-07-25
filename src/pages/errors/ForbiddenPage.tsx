import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";

export function ForbiddenPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="mx-auto max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-danger/10 text-danger"
        >
          <ShieldAlert className="h-9 w-9" />
        </motion.div>
        <p className="font-display text-6xl font-bold text-danger">403</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-foreground">Access restricted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You don't have permission to view this page. If you think this is a mistake, contact support.
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
