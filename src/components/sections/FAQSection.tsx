import { useMemo, useState } from "react";
import { FAQ_ITEMS } from "@/data/blog.data";
import { Accordion } from "@/components/ui/accordion";
import { SearchBox } from "@/components/ui/search-box";
import { EmptyState } from "@/components/states/EmptyState";

export function FAQSection() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return FAQ_ITEMS;
    const q = query.toLowerCase();
    return FAQ_ITEMS.filter((item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q));
  }, [query]);

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
          <EmptyState title="No matching questions" description="Try a different search term, or browse all questions above." />
        )}
      </div>
    </section>
  );
}
