import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { contentService, type TestimonialItem } from "@/services/api/content.service";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    contentService.getTestimonials().then((res) => {
      if (!cancelled) setTestimonials(res || []);
    }).catch(() => {
      if (!cancelled) setTestimonials([]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (paused || testimonials.length === 0) return;
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, [paused, testimonials.length]);

  if (testimonials.length === 0) return null;

  const testimonial = testimonials[index % testimonials.length];

  return (
    <section className="bg-surface-sunken py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Testimonials</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">Loved by clients across India</h2>
        </div>

        <div
          className="relative mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative min-h-[260px] rounded-3xl border border-border bg-surface p-8 shadow-soft sm:p-10">
            <Quote className="h-8 w-8 text-brand-200 dark:text-brand-500/30" />
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
              >
                <div className="mt-4 flex items-center gap-1 text-amber-500">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-lg leading-relaxed text-foreground sm:text-xl">"{testimonial.comment}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar src={testimonial.authorAvatarUrl} name={testimonial.authorName} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{testimonial.authorName}</p>
                      {testimonial.verifiedClient && <Badge variant="success">Verified Client</Badge>}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn("h-1.5 rounded-full transition-all", i === index ? "w-6 bg-brand-600" : "w-1.5 bg-border-strong")}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
