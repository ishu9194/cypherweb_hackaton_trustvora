import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STORIES = [
  {
    metric: "5 days",
    headline: "Seed round closed with zero contract renegotiation",
    detail: "A Mumbai-based robotics startup used Trustix to finalize founder agreements and SAFE notes before their funding deadline.",
    tag: "Startup Law",
  },
  {
    metric: "₹18L saved",
    headline: "Title defect caught before possession",
    detail: "A property verification flagged an unresolved encumbrance, saving the buyer from a six-figure legal dispute after purchase.",
    tag: "Property Law",
  },
  {
    metric: "3 weeks",
    headline: "GST notice resolved without penalty",
    detail: "A retail business responded to a scrutiny notice with documentation prepared by a Trustix tax specialist — no penalty applied.",
    tag: "Taxation",
  },
];

export function SuccessStoriesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Success Stories</span>
        <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">Real outcomes, not just testimonials</h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {STORIES.map((story, index) => (
          <motion.div
            key={story.headline}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="card-lift group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-navy-900 to-navy-800 p-7 text-white"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-accent-500/20 blur-2xl transition-opacity group-hover:opacity-80" />
            <Badge variant="outline" className="border-white/20 text-white/80">{story.tag}</Badge>
            <div className="mt-5 flex items-center gap-2 text-accent-400">
              <TrendingUp className="h-4 w-4" />
              <span className="font-display text-2xl font-bold">{story.metric}</span>
            </div>
            <h3 className="mt-3 font-display text-base font-semibold leading-snug">{story.headline}</h3>
            <p className="mt-2 text-sm text-navy-200">{story.detail}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-accent-400">
              Read the case study <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
