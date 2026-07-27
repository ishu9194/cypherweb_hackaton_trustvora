import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Scale, ThumbsUp, Users } from "lucide-react";
import { CountUp } from "@/components/common/CountUp";
import { lawyersService, type PublicStats } from "@/services/api/lawyers.service";

export function StatisticsSection() {
  const [statsData, setStatsData] = useState<PublicStats>({
    verifiedLawyersCount: 12,
    totalLawyersCount: 12,
    clientsServedCount: 3250,
    successRate: 94,
    totalReviews: 2430,
  });

  useEffect(() => {
    lawyersService.getStats().then((data) => {
      if (data) setStatsData(data);
    }).catch(() => {});
  }, []);

  const stats = [
    { icon: Scale, value: statsData.verifiedLawyersCount, suffix: "+", label: "Verified Lawyers" },
    { icon: Users, value: statsData.clientsServedCount, suffix: "+", label: "Clients Served" },
    { icon: ThumbsUp, value: statsData.successRate, suffix: "%", label: "Success Rate" },
    { icon: Clock, value: 24, suffix: "×7", label: "Support Available" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-10 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="text-center"
          >
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10">
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
