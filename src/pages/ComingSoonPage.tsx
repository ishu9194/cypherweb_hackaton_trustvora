import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Home, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { ROUTES } from "@/constants/routes.constants";
import { useState } from "react";

interface ComingSoonPageProps {
  title?: string;
  description?: string;
}

export function ComingSoonPage({
  title = "This page is coming soon",
  description = "We're actively building this part of Trustora. Leave your email and we'll let you know the moment it's live.",
}: ComingSoonPageProps) {
  const [email, setEmail] = useState("");

  const handleNotify = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    toast.success("You're on the list — we'll email you when this ships.");
    setEmail("");
  };

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6">
      <div className="gradient-mesh pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-md text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-lifted"
        >
          <Rocket className="h-9 w-9" />
        </motion.div>
        <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>

        <form onSubmit={handleNotify} className="mt-6 flex gap-2">
          <Input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <Button type="submit" className="shrink-0">
            <Bell className="h-4 w-4" />
            Notify me
          </Button>
        </form>

        <Button asChild variant="ghost" className="mt-4">
          <Link to={ROUTES.home}>
            <Home className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
