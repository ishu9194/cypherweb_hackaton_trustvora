import { useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
}

interface LegalDocumentLayoutProps {
  title: string;
  updatedAt: string;
  sections: LegalSection[];
}

export function LegalDocumentLayout({ title, updatedAt, sections }: LegalDocumentLayoutProps) {
  const [active, setActive] = useState(sections[0]?.id);

  const scrollTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10"><FileText className="h-5 w-5" /></span>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
          <p className="text-xs text-muted-foreground">Last updated {updatedAt}</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <nav className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 border-l border-border pl-4">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(section.id)}
                  className={cn(
                    "block w-full py-1.5 text-left text-sm transition-colors",
                    active === section.id ? "font-medium text-brand-600" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-10 lg:max-w-2xl">
          {sections.map((section, i) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: (i % 4) * 0.05 }}
              className="scroll-mt-24"
            >
              <h2 className="font-display text-lg font-semibold text-foreground">{section.title}</h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-sm leading-relaxed text-muted-foreground">{p}</p>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
