import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";

export function CTABannerSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-16 text-center sm:px-14"
      >
        <div className="gradient-mesh pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to get the legal help you need?
          </h2>
          <p className="mt-3 text-navy-200">
            Join over a million clients who found the right lawyer on Trustora — often the same day.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="accent" asChild>
              <Link to={ROUTES.findLawyers}>
                Find a Lawyer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to={ROUTES.contact}>
                <MessagesSquare className="h-4 w-4" />
                Talk to Us
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
