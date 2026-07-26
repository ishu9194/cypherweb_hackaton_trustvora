import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MessagesSquare, FileEdit, FileWarning, SearchCheck, Building2, BadgeCheck,
  Receipt, Landmark, ArrowRight, type LucideIcon,
} from "lucide-react";
import { contentService, type ServiceItem } from "@/services/api/content.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toaster";
import { formatCurrency } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  MessagesSquare, FileEdit, FileWarning, SearchCheck, Building2, BadgeCheck, Receipt, Landmark,
};

export function ServicesSection() {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    contentService.getServices().then((res) => {
      if (!cancelled) setServices(res || []);
    }).catch(() => {
      if (!cancelled) setServices([]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (services.length === 0) return null;

  return (
    <section id="services" className="bg-surface-sunken py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Services</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need, in one place
          </h2>
          <p className="mt-3 text-muted-foreground">
            Transparent pricing, verified specialists, and a booking flow that takes minutes — not weeks.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = ICONS[service.category] ?? MessagesSquare;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
              >
                <Card lift className="flex h-full flex-col">
                  <CardContent className="flex flex-1 flex-col">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-semibold text-foreground">{service.name}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{service.shortDesc}</p>

                    <div className="mt-6 flex flex-1 items-end justify-between border-t border-border pt-4">
                      <div>
                        <p className="text-[11px] text-muted-foreground">Starting at</p>
                        <p className="font-display text-lg font-bold text-foreground">{formatCurrency(service.startingFee)}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast.success(`${service.name} — booking flow opens here`)}
                      >
                        Book <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
