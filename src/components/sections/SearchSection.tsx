import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, MapPin, Scale, Search } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PRACTICE_AREAS } from "@/data/practiceAreas.data";
import { ROUTES } from "@/constants/routes.constants";

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Chennai", "Hyderabad"];
const AVAILABILITY = [
  { value: "any", label: "Any time" },
  { value: "today", label: "Available today" },
  { value: "week", label: "This week" },
];

export function SearchSection() {
  const [practiceArea, setPracticeArea] = useState<string>();
  const [city, setCity] = useState<string>();
  const [availability, setAvailability] = useState<string>("any");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (practiceArea) params.set("area", practiceArea);
    if (city) params.set("city", city);
    if (availability !== "any") params.set("availability", availability);
    navigate(`${ROUTES.findLawyers}?${params.toString()}`);
  };

  return (
    <section className="relative z-10 mx-auto -mt-24 max-w-5xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-border bg-surface p-4 shadow-lifted sm:p-6"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto]">
          <Select
            label="Practice Area"
            placeholder="Any practice area"
            options={PRACTICE_AREAS.map((area) => ({ value: area.name, label: area.name }))}
            value={practiceArea}
            onValueChange={setPracticeArea}
          />
          <Select
            label="City"
            placeholder="Any city"
            options={CITIES.map((c) => ({ value: c, label: c }))}
            value={city}
            onValueChange={setCity}
          />
          <Select
            label="Availability"
            options={AVAILABILITY}
            value={availability}
            onValueChange={setAvailability}
          />
          <div className="flex items-end">
            <Button size="lg" className="w-full" onClick={handleSearch}>
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5 text-brand-600" />
            100,000+ verified lawyers
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            Available in 200+ cities
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarCheck className="h-3.5 w-3.5 text-brand-600" />
            Same-day appointments
          </span>
        </div>
      </motion.div>
    </section>
  );
}
