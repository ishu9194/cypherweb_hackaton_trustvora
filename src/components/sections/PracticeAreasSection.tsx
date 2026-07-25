import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, Scale, Gavel, Users, Home as HomeIcon, ShieldAlert, Rocket, Receipt,
  Landmark, Plane, Briefcase, ShieldCheck, BadgeCheck, Lightbulb, FileText, Building,
  HeartCrack, Umbrella, GraduationCap, PiggyBank, ArrowUpRight, ArrowRight, type LucideIcon,
} from "lucide-react";
import { PRACTICE_AREAS } from "@/data/practiceAreas.data";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";

const ICONS: Record<string, LucideIcon> = {
  Building2, Scale, Gavel, Users, Home: HomeIcon, ShieldAlert, Rocket, Receipt,
  Landmark, Plane, Briefcase, ShieldCheck, BadgeCheck, Lightbulb, FileText, Building,
  HeartCrack, Umbrella, GraduationCap, PiggyBank,
};

export function PracticeAreasSection() {
  const featured = PRACTICE_AREAS.slice(0, 8);

  return (
    <section id="practice-areas" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Practice Areas</span>
        <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
          Legal expertise for every situation
        </h2>
        <p className="mt-3 text-muted-foreground">
          From startup incorporation to family disputes, find a specialist who's handled cases exactly like yours.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((area, index) => {
          const Icon = ICONS[area.icon] ?? Scale;
          return (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
              className="card-lift group relative overflow-hidden rounded-2xl border border-border bg-surface p-6"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-500/0 transition-colors duration-300 group-hover:bg-brand-500/10" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-soft">
                <Icon className="h-5.5 w-5.5" />
              </div>
              <h3 className="relative mt-4 font-display text-base font-semibold text-foreground">{area.name}</h3>
              <p className="relative mt-1.5 text-sm text-muted-foreground">{area.description}</p>
              <div className="relative mt-5 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {new Intl.NumberFormat("en-IN").format(area.casesServed)}+ cases
                </span>
                <Link
                  to={`${ROUTES.practiceAreas}?area=${area.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5"
                >
                  Explore <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Button variant="outline" asChild>
          <Link to={ROUTES.practiceAreas}>
            View all 20 practice areas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
