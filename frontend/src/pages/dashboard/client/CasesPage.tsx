import { useState } from "react";
import { Briefcase, Calendar, FileText, MessageSquare, StickyNote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import { Textarea } from "@/components/ui/textarea";
import { ErrorState } from "@/components/states/ErrorState";
import { toast } from "@/components/ui/toaster";
import { formatDate } from "@/lib/utils";
import { dashboardService } from "@/services/api/dashboard.service";
import { useAsync } from "@/hooks/useAsync";

const STATUS_VARIANT: Record<string, "warning" | "brand" | "success"> = {
  open: "warning",
  "in-progress": "brand",
  closed: "success",
};

export function CasesPage() {
  const { data: cases, isLoading, error, refetch } = useAsync(() => dashboardService.getCases(), []);
  const { data: documents } = useAsync(() => dashboardService.getDocuments(), []);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const casesList = cases ?? [];
  const docsList = documents ?? [];

  if (error) return <ErrorState description={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">My Cases</h2>
        <p className="mt-1 text-sm text-muted-foreground">Track progress, documents, and notes for each active matter.</p>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading cases…</p>
      ) : casesList.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No active cases found.</p>
      ) : (
        <div className="space-y-4">
          {casesList.map((legalCase) => {
            const isOpen = expanded === legalCase.id || (expanded === null && casesList[0]?.id === legalCase.id);
            const caseDocs = docsList.filter((d) => d.caseId === legalCase.id);

            return (
              <Card key={legalCase.id} lift>
                <CardContent>
                  <button type="button" onClick={() => setExpanded(isOpen ? null : legalCase.id)} className="flex w-full items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                        <Briefcase className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{legalCase.title}</p>
                        <p className="text-xs text-muted-foreground">Case ID: {legalCase.id.toUpperCase()} · {legalCase.practiceArea} · {legalCase.lawyerName}</p>
                      </div>
                    </div>
                    <Badge variant={STATUS_VARIANT[legalCase.status]} className="capitalize">{legalCase.status.replace("-", " ")}</Badge>
                  </button>

                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{legalCase.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${legalCase.progress}%` }} />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-6 grid grid-cols-1 gap-6 border-t border-border pt-6 lg:grid-cols-2">
                      <div>
                        <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" /> Timeline · Next hearing {formatDate(legalCase.updatedAt)}
                        </h4>
                        <Timeline
                          steps={[
                            { title: "Case opened", timestamp: formatDate(legalCase.updatedAt), status: "complete" },
                            { title: "Documents reviewed", status: legalCase.progress > 30 ? "complete" : "upcoming" },
                            { title: "In progress", status: legalCase.status === "in-progress" ? "current" : legalCase.progress > 60 ? "complete" : "upcoming" },
                            { title: "Resolved", status: legalCase.status === "closed" ? "complete" : "upcoming" },
                          ]}
                        />

                        <h4 className="mb-2 mt-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" /> Documents
                        </h4>
                        {caseDocs.length > 0 ? (
                          <ul className="space-y-1.5">
                            {caseDocs.map((doc) => (
                              <li key={doc.id} className="flex items-center justify-between rounded-lg bg-surface-sunken px-3 py-2 text-xs">
                                <span className="text-foreground">{doc.name}</span>
                                <span className="text-muted-foreground">{doc.sizeLabel}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground">No documents linked to this case yet.</p>
                        )}
                      </div>

                      <div>
                        <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <StickyNote className="h-3.5 w-3.5" /> Notes
                        </h4>
                        <Textarea
                          placeholder="Add a private note about this case…"
                          rows={4}
                          value={notes[legalCase.id] ?? ""}
                          onChange={(e) => setNotes((prev) => ({ ...prev, [legalCase.id]: e.target.value }))}
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => toast.success("Message thread opened")}>
                            <MessageSquare className="h-3.5 w-3.5" /> Message Lawyer
                          </Button>
                          <Button size="sm" onClick={() => toast.success("Note saved")}>Save Note</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CasesPage;
