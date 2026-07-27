import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, Scale, Gavel, Users, Home as HomeIcon, ShieldAlert, Rocket, Receipt,
  Landmark, Plane, Briefcase, ShieldCheck, BadgeCheck, Lightbulb, FileText, Building,
  HeartCrack, Umbrella, GraduationCap, PiggyBank, ArrowRight, type LucideIcon,
} from "lucide-react";
import { PRACTICE_AREAS } from "@/data/practiceAreas.data";
import { SearchBox } from "@/components/ui/search-box";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ROUTES } from "@/constants/routes.constants";

const ICONS: Record<string, LucideIcon> = {
  Building2, Scale, Gavel, Users, Home: HomeIcon, ShieldAlert, Rocket, Receipt,
  Landmark, Plane, Briefcase, ShieldCheck, BadgeCheck, Lightbulb, FileText, Building,
  HeartCrack, Umbrella, GraduationCap, PiggyBank,
};

export function PracticeAreasPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = PRACTICE_AREAS.filter((area) =>
    area.name.toLowerCase().includes(query.toLowerCase()) ||
    area.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Practice Areas" }]} className="[&_*]:text-white/70 [&_a:hover]:text-white" />
          <div className="mt-6 max-w-3xl">
            <h1 className="font-display text-3xl font-bold sm:text-5xl">Explore Practice Areas</h1>
            <p className="mt-4 text-base text-navy-200 sm:text-lg">
              Browse all 20 specialized legal domains. Connect with verified Bar Council lawyers experienced in handling your specific case.
            </p>
          </div>
          <div className="mt-8 max-w-md">
            <SearchBox placeholder="Search practice areas…" onSearch={setQuery} className="bg-surface text-foreground" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-muted-foreground">Showing {filtered.length} of {PRACTICE_AREAS.length} practice areas</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((area, index) => {
            const Icon = ICONS[area.icon] ?? Scale;
            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                onClick={() => navigate(`${ROUTES.findLawyers}?area=${encodeURIComponent(area.name)}`)}
                className="group cursor-pointer rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-lifted"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-soft">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground group-hover:text-brand-600">{area.name}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{area.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs font-semibold text-brand-600">
                    {new Intl.NumberFormat("en-IN").format(area.casesServed)}+ cases handled
                  </span>
                  <ArrowRight className="h-4 w-4 text-brand-600 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
