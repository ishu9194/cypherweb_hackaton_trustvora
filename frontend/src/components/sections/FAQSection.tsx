import { useEffect, useMemo, useState } from "react";
import { contentService, type FaqItem } from "@/services/api/content.service";
import { Accordion } from "@/components/ui/accordion";
import { SearchBox } from "@/components/ui/search-box";
import { EmptyState } from "@/components/states/EmptyState";

export function FAQSection() {
  const [query, setQuery] = useState("");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    contentService.getFaqs().then((res) => {
      if (!cancelled) setFaqs(res || []);
    }).catch(() => {
      if (!cancelled) setFaqs([]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return faqs;
    const q = query.toLowerCase();
    return faqs.filter((item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q));
  }, [query, faqs]);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">FAQ</span>
        <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">Frequently asked questions</h2>
        <p className="mt-3 text-muted-foreground">Can't find what you're looking for? Reach out through the contact section below.</p>
      </div>

      <SearchBox placeholder="Search questions…" onSearch={setQuery} className="mx-auto mt-8 max-w-md" />

      <div className="mt-8">
        {filtered.length > 0 ? (
          <Accordion items={filtered.map((item, i) => ({ value: `faq-${i}`, question: item.question, answer: item.answer }))} />
        ) : (
          <EmptyState title="No questions found" description="Try a different search term, or reach out to support." />
        )}
      </div>
    </section>
  );
}
