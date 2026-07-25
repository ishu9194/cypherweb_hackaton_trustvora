import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

export function MaintenancePage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 gradient-mesh">
      <div className="mx-auto max-w-md text-center">
        <motion.div
          animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-white shadow-lifted"
        >
          <Wrench className="h-9 w-9" />
        </motion.div>
        <h1 className="font-display text-2xl font-bold text-foreground">We'll be right back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Trustix is undergoing scheduled maintenance to make things faster and more reliable. Thanks for your patience.
        </p>
      </div>
    </div>
  );
}
