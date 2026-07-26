import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Lawyer } from "@/types";
import { lawyersService } from "@/services/api/lawyers.service";
import { LawyerCard } from "@/components/lawyers/LawyerCard";
import { LawyerCardSkeleton } from "@/components/lawyers/LawyerCardSkeleton";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";

export function FeaturedLawyersSection() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    lawyersService.list({ pageSize: 6 }).then((res) => {
      if (cancelled) return;
      setLawyers(res.lawyers || []);
      setIsLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setLawyers([]);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-surface-sunken py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Featured Advocates</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Meet a few of our top-rated lawyers
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link to={ROUTES.findLawyers}>
              Browse all lawyers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <LawyerCardSkeleton key={i} />
            ))}
          </div>
        ) : lawyers.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted-foreground">
            No lawyers available at the moment.
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lawyers.map((lawyer) => (
              <LawyerCard key={lawyer.id} lawyer={lawyer} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
