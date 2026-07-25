import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ServerCrash, RotateCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";

export function ServerErrorPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="mx-auto max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-warning/10 text-warning"
        >
          <ServerCrash className="h-9 w-9" />
        </motion.div>
        <p className="font-display text-6xl font-bold text-warning">500</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-foreground">Something broke on our end</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Our team has been notified. Try refreshing the page, or head back home for now.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RotateCw className="h-4 w-4" />
            Retry
          </Button>
          <Button asChild>
            <Link to={ROUTES.home}>
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
