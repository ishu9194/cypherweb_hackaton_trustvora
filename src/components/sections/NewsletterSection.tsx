import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    toast.success("You're subscribed to The Brief — our biweekly legal digest.");
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 px-6 py-14 text-center text-white sm:px-14"
      >
        <div className="gradient-mesh pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-lg">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Mail className="h-5.5 w-5.5" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-bold sm:text-3xl">Join "The Brief" — legal news, twice a month</h2>
          <p className="mt-3 text-sm text-brand-100">
            Short, practical updates on law changes that actually affect your business or family. No jargon, unsubscribe anytime.
          </p>
          <form onSubmit={handleSubmit} className="mx-auto mt-7 flex max-w-sm gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              className="h-12 w-full rounded-lg border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-brand-100 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            <Button type="submit" size="lg" variant="secondary" className="shrink-0 bg-white text-brand-700 hover:bg-brand-50">
              <Send className="h-4 w-4" />
              Subscribe
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
