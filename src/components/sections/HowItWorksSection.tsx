import { motion } from "framer-motion";
import { CalendarCheck, MessageCircle, Search, ThumbsUp } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Search & compare", description: "Filter by practice area, city, language, and rating to shortlist the right advocates." },
  { icon: CalendarCheck, title: "Book a slot", description: "Pick a time that works, choose video, voice, chat, or in-person, and confirm instantly." },
  { icon: MessageCircle, title: "Consult with confidence", description: "Share your documents securely and discuss your case with a verified specialist." },
  { icon: ThumbsUp, title: "Get it resolved", description: "Move forward with drafting, filing, or representation — all tracked in one dashboard." },
];

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">How It Works</span>
        <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">From search to resolution in four steps</h2>
      </div>

      <div className="relative mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-border lg:block" />
        {STEPS.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative text-center"
          >
            <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface shadow-medium ring-1 ring-border">
              <step.icon className="h-6 w-6 text-brand-600" />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-[11px] font-bold text-white dark:bg-white dark:text-navy-900">
                {index + 1}
              </span>
            </div>
            <h3 className="mt-5 font-display text-base font-semibold text-foreground">{step.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
