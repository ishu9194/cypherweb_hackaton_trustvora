import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes.constants";
import { LAWYERS } from "@/data/lawyers.data";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-32 pt-16 sm:pt-24">
      <div className="gradient-mesh pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl animate-float" />
      <div
        className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl animate-float"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent-500" />
              Trusted by 1M+ clients across India
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]"
            >
              Find <span className="text-gradient-brand">Trusted Lawyers</span> Across India
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Book verified lawyers in minutes for legal consultation, documentation, business
              registration, court matters, family disputes, and much more.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button size="lg" asChild>
                <Link to={ROUTES.findLawyers}>
                  Find a Lawyer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={ROUTES.services}>
                  <PlayCircle className="h-4 w-4" />
                  Watch Demo
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mt-9 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {LAWYERS.slice(0, 4).map((lawyer) => (
                  <Avatar key={lawyer.id} src={lawyer.avatarUrl} name={lawyer.name} size="sm" className="ring-2 ring-background" />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground">4.9 average rating from 12,400+ reviews</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto max-w-md">
              <div className="glass rounded-3xl p-6 shadow-lifted">
                <div className="flex items-center gap-3">
                  <Avatar src={LAWYERS[2].avatarUrl} name={LAWYERS[2].name} size="lg" online />
                  <div>
                    <p className="font-display font-semibold text-foreground">{LAWYERS[2].name}</p>
                    <p className="text-xs text-muted-foreground">{LAWYERS[2].specializations.join(" · ")}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-surface p-3">
                    <p className="font-display text-lg font-bold text-foreground">{LAWYERS[2].casesWon}</p>
                    <p className="text-[11px] text-muted-foreground">Cases Won</p>
                  </div>
                  <div className="rounded-xl bg-surface p-3">
                    <p className="font-display text-lg font-bold text-foreground">{LAWYERS[2].successRate}%</p>
                    <p className="text-[11px] text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="rounded-xl bg-surface p-3">
                    <p className="font-display text-lg font-bold text-foreground">{LAWYERS[2].experienceYears}y</p>
                    <p className="text-[11px] text-muted-foreground">Experience</p>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="glass absolute -left-10 top-6 flex items-center gap-2 rounded-2xl px-4 py-3 shadow-medium"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Verified Advocate</p>
                  <p className="text-muted-foreground">Bar Council checked</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="glass absolute -bottom-8 -right-6 rounded-2xl px-4 py-3 shadow-medium"
              >
                <p className="text-xs text-muted-foreground">Response time</p>
                <p className="font-display text-base font-bold text-brand-600">~12 minutes</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
