import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { TEAM_MEMBERS, COMPANY_TIMELINE, COMPANY_VALUES } from "@/data/team.data";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/common/CountUp";
import { ROUTES } from "@/constants/routes.constants";

const VALUE_ICONS = [Sparkles, ShieldCheck, Heart];

export function AboutUsPage() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24">
        <div className="gradient-mesh pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent-500" /> Our story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-5 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            Legal help shouldn't feel like a <span className="text-gradient-brand">legal problem</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            We started Trustora because finding a lawyer you can trust took too long, cost too
            much to figure out, and rarely came with a straight answer. Four years later, we're
            still solving that — at a much bigger scale.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:grid-cols-4 sm:p-10">
          {[
            { value: 100000, suffix: "+", label: "Verified Lawyers" },
            { value: 1000000, suffix: "+", label: "Clients Served" },
            { value: 200, suffix: "+", label: "Cities Covered" },
            { value: 99, suffix: "%", label: "Satisfaction Rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-bold text-foreground sm:text-3xl"><CountUp value={stat.value} suffix={stat.suffix} /></p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">What we believe</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground">The principles behind every decision</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {COMPANY_VALUES.map((value, i) => {
            const Icon = VALUE_ICONS[i];
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08 }}
                className="card-lift rounded-2xl border border-border bg-surface p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-soft">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">{value.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="bg-surface-sunken py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Our journey</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground">From spreadsheet to a million clients</h2>
          </div>
          <ol className="relative mt-12 space-y-8 border-l border-border pl-6">
            {COMPANY_TIMELINE.map((milestone, i) => (
              <motion.li
                key={milestone.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <span className="absolute -left-[1.95rem] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white ring-4 ring-surface-sunken">
                  {milestone.year.slice(2)}
                </span>
                <p className="text-xs font-semibold text-brand-600">{milestone.year}</p>
                <p className="mt-0.5 font-display text-base font-semibold text-foreground">{milestone.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{milestone.description}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Meet the team</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground">The people building Trustora</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="card-lift rounded-2xl border border-border bg-surface p-6 text-center"
            >
              <Avatar src={member.avatarUrl} name={member.name} size="xl" className="mx-auto" />
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">{member.name}</h3>
              <p className="text-xs font-medium text-brand-600">{member.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-16 text-center sm:px-14">
          <div className="gradient-mesh pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-white">Want to join us?</h2>
            <p className="mt-3 text-navy-200">We're always looking for people who care about making legal help accessible.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" variant="accent" asChild>
                <Link to={ROUTES.contact}>Get in touch <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link to="/careers">View open roles</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
