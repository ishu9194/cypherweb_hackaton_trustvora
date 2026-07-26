import { motion } from "framer-motion";
import {
  MessagesSquare, FileEdit, FileWarning, SearchCheck, Building2, BadgeCheck,
  Receipt, Landmark, Check, ArrowRight, Sparkles, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/states/ErrorState";
import { toast } from "@/components/ui/toaster";
import { formatCurrency } from "@/lib/utils";
import { contentService } from "@/services/api/content.service";
import { useAsync } from "@/hooks/useAsync";

const ICONS: Record<string, LucideIcon> = {
  MessagesSquare, FileEdit, FileWarning, SearchCheck, Building2, BadgeCheck, Receipt, Landmark,
};

const POPULAR_ID = "drafting";

export function ServicesPage() {
  const { data: services, isLoading, error, refetch } = useAsync(() => contentService.getServices(), []);
  const servicesList = services ?? [];

  if (error) return <ErrorState description={error} onRetry={refetch} />;

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden pb-16 pt-16 sm:pt-24">
        <div className="gradient-mesh pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent-500" /> Transparent, upfront pricing
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Legal services, <span className="text-gradient-brand">priced honestly</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Every service below shows its starting price before you book — no vague quotes, no billing surprises.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Loading services catalog…</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesList.map((service, index) => {
              const Icon = ICONS[service.icon ?? service.category] ?? MessagesSquare;
              const popular = service.id === POPULAR_ID || Boolean(service.popular);
              const desc = service.description || service.shortDesc;
              const benefits = service.benefits || [];
              const price = service.startingPrice ?? service.startingFee;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: (index % 3) * 0.07 }}
                >
                  <Card lift className={popular ? "relative border-brand-400 ring-2 ring-brand-500/20" : "relative"}>
                    {popular && (
                      <Badge variant="brand" className="absolute -top-3 left-6">Most booked</Badge>
                    )}
                    <CardContent className="flex h-full flex-col">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-soft">
                        <Icon className="h-5.5 w-5.5" />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{service.name}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>

                      <ul className="mt-5 space-y-2.5">
                        {benefits.map((benefit: string) => (
                          <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" /> {benefit}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 flex flex-1 items-end justify-between border-t border-border pt-5">
                        <div>
                          <p className="text-[11px] text-muted-foreground">Starting at</p>
                          <p className="font-display text-xl font-bold text-foreground">{formatCurrency(price)}</p>
                        </div>
                        <Button size="sm" onClick={() => toast.success(`${service.name} — booking flow opens here`)}>
                          Book Now <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto mt-20 max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 px-6 py-14 text-center text-white sm:px-14">
          <div className="gradient-mesh pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Not sure which service you need?</h2>
            <p className="mt-3 text-sm text-brand-100">Describe your situation and we'll match you with the right specialist and service in minutes.</p>
            <Button size="lg" variant="secondary" className="mt-7 bg-white text-brand-700 hover:bg-brand-50" onClick={() => toast.success("Matching you with a specialist…")}>
              Get matched for free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicesPage;
