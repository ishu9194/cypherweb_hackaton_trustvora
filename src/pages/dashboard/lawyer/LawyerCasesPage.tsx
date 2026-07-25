import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MoreHorizontal } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/dropdown";
import { toast } from "@/components/ui/toaster";
import { formatDate, cn } from "@/lib/utils";

interface KanbanCase {
  id: string;
  title: string;
  client: string;
  practiceArea: string;
  status: "open" | "in-progress" | "closed";
  nextHearing?: string;
  updatedAt: string;
}

const INITIAL_CASES: KanbanCase[] = [
  { id: "cs-1", title: "Founders' Agreement Drafting", client: "Meet Agrawal", practiceArea: "Startup Law", status: "in-progress", nextHearing: "2026-08-02", updatedAt: "2026-07-19T00:00:00" },
  { id: "cs-2", title: "GST Notice Response", client: "Farhan Ali", practiceArea: "Taxation", status: "open", updatedAt: "2026-07-20T00:00:00" },
  { id: "cs-3", title: "Employment Dispute Review", client: "Sanjay Malhotra", practiceArea: "Employment", status: "open", updatedAt: "2026-07-15T00:00:00" },
  { id: "cs-4", title: "Trademark Opposition", client: "Neha Kulkarni", practiceArea: "Trademark", status: "in-progress", nextHearing: "2026-08-10", updatedAt: "2026-07-12T00:00:00" },
  { id: "cs-5", title: "Property Title Verification", client: "Karan Vora", practiceArea: "Property Law", status: "closed", updatedAt: "2026-06-02T00:00:00" },
  { id: "cs-6", title: "Business Registration — LLP", client: "Ayesha Khan", practiceArea: "Business Registration", status: "closed", updatedAt: "2026-05-28T00:00:00" },
];

const COLUMNS: { status: KanbanCase["status"]; label: string; accent: string }[] = [
  { status: "open", label: "Open", accent: "bg-amber-500" },
  { status: "in-progress", label: "In Progress", accent: "bg-brand-500" },
  { status: "closed", label: "Closed", accent: "bg-accent-500" },
];

export function LawyerCasesPage() {
  const [cases, setCases] = useState(INITIAL_CASES);

  const moveCase = (id: string, status: KanbanCase["status"]) => {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    toast.success("Case status updated");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Cases</h2>
        <p className="mt-1 text-sm text-muted-foreground">{cases.length} cases across your practice.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnCases = cases.filter((c) => c.status === column.status);
          return (
            <div key={column.status} className="rounded-2xl border border-border bg-surface-sunken p-4">
              <div className="mb-4 flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", column.accent)} />
                <h3 className="text-sm font-semibold text-foreground">{column.label}</h3>
                <Badge variant="neutral">{columnCases.length}</Badge>
              </div>
              <div className="space-y-3">
                {columnCases.map((legalCase) => (
                  <motion.div
                    key={legalCase.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-border bg-surface p-4 shadow-soft"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10"><Briefcase className="h-4 w-4" /></span>
                      <Dropdown
                        trigger={<button type="button" aria-label="Case options" className="rounded-md p-1 text-muted-foreground hover:bg-surface-sunken"><MoreHorizontal className="h-4 w-4" /></button>}
                        items={COLUMNS.filter((c) => c.status !== legalCase.status).map((c) => ({ label: `Move to ${c.label}`, onSelect: () => moveCase(legalCase.id, c.status) }))}
                      />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-foreground">{legalCase.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{legalCase.practiceArea}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Avatar name={legalCase.client} size="sm" />
                      <span className="text-xs text-muted-foreground">{legalCase.client}</span>
                    </div>
                    {legalCase.nextHearing && (
                      <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-surface-sunken px-2.5 py-1.5 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" /> Next hearing {formatDate(legalCase.nextHearing)}
                      </div>
                    )}
                  </motion.div>
                ))}
                {columnCases.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No cases here</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
