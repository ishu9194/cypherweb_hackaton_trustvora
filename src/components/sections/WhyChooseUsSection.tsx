import { motion } from "framer-motion";
import { BadgeCheck, Clock3, Lock, Wallet } from "lucide-react";

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Every lawyer is verified",
    description: "Bar Council enrollment, practicing certificates, and court affiliations are checked manually before any profile goes live.",
  },
  {
    icon: Clock3,
    title: "Fast, transparent responses",
    description: "Average response time under 15 minutes. See exact response times and availability before you book — no guesswork.",
  },
  {
    icon: Wallet,
    title: "Upfront, honest pricing",
    description: "Consultation fees are shown before you book. No hidden platform charges, no surprise invoices later.",
  },
  {
    icon: Lock,
    title: "Your data stays private",
    description: "Documents and conversations are end-to-end encrypted and visible only to you and the advocate you choose.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Why Trustora</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Legal help you can actually trust
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            We built Trustora around the three things people say they hate most about hiring a
            lawyer: not knowing who's qualified, not knowing the cost, and waiting too long for a reply.
          </p>

          <div className="mt-9 space-y-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex gap-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-soft">
                  <feature.icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="glass rounded-3xl p-8 shadow-lifted">
            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="card-lift rounded-2xl border border-border bg-surface p-5">
                  <feature.icon className="h-5 w-5 text-brand-600" />
                  <p className="mt-3 text-sm font-semibold text-foreground">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute -inset-x-8 -bottom-8 -z-10 h-40 rounded-full bg-brand-500/10 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
