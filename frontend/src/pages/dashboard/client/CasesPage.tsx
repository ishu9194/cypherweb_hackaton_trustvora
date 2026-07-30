import { useState, useEffect } from "react";
import { Briefcase, Calendar, FileText, MessageSquare, Plus, StickyNote, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ErrorState } from "@/components/states/ErrorState";
import { toast } from "@/components/ui/toaster";
import { formatDate } from "@/lib/utils";
import { dashboardService } from "@/services/api/dashboard.service";
import { useAsync } from "@/hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes.constants";

const STATUS_VARIANT: Record<string, "warning" | "brand" | "success"> = {
  open: "warning",
  "in-progress": "brand",
  resolved: "success",
  closed: "success",
};

const PRACTICE_AREAS = [
  { value: "Startup Law", label: "Startup & Corporate Law" },
  { value: "Civil Litigation", label: "Civil Litigation" },
  { value: "Criminal Defence", label: "Criminal Defence" },
  { value: "Taxation", label: "Taxation & GST" },
  { value: "Real Estate", label: "Real Estate & Property" },
  { value: "Family & Divorce", label: "Family & Matrimonial" },
  { value: "Intellectual Property", label: "Intellectual Property" },
  { value: "Employment", label: "Employment & Labor" },
  { value: "Consumer Protection", label: "Consumer Protection" },
];

const PRIORITIES = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
];

export function CasesPage() {
  const navigate = useNavigate();
  const { data: cases, isLoading, error, refetch } = useAsync(() => dashboardService.getCases(), []);
  const { data: documents } = useAsync(() => dashboardService.getDocuments(), []);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savingNotes, setSavingNotes] = useState<Record<string, boolean>>({});

  // New Case Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [practiceArea, setPracticeArea] = useState("Startup Law");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [description, setDescription] = useState("");
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>("unassigned");
  const [lawyerOptions, setLawyerOptions] = useState<{ value: string; label: string }[]>([
    { value: "unassigned", label: "Open to All Lawyers (Post in Pool)" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const casesList = cases ?? [];
  const docsList = documents ?? [];

  useEffect(() => {
    import("@/services/api/lawyers.service").then(({ lawyersService }) => {
      lawyersService.list({ pageSize: 50 }).then((res) => {
        if (res?.lawyers && res.lawyers.length > 0) {
          setLawyerOptions([
            { value: "unassigned", label: "Open to All Lawyers (Post in Pool)" },
            ...res.lawyers.map((l) => ({ value: l.id, label: `${l.name} (${l.city})` })),
          ]);
        }
      });
    });
  }, []);

  const handleOpenCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a case title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a case description");
      return;
    }

    setIsSubmitting(true);
    try {
      await dashboardService.createCase({
        title: title.trim(),
        practiceArea,
        priority,
        description: description.trim(),
        lawyerId: selectedLawyerId !== "unassigned" ? selectedLawyerId : undefined,
      });
      toast.success("New case opened successfully!");
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setSelectedLawyerId("unassigned");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to open case");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveNotes = async (caseId: string) => {
    const noteText = notes[caseId];
    if (noteText === undefined) return;
    setSavingNotes((prev) => ({ ...prev, [caseId]: true }));
    try {
      await dashboardService.updateCaseNotes(caseId, noteText);
      toast.success("Private note saved!");
    } catch {
      toast.error("Failed to save note");
    } finally {
      setSavingNotes((prev) => ({ ...prev, [caseId]: false }));
    }
  };

  if (error) return <ErrorState description={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">My Cases</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track progress, documents, and notes for each active matter.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Open New Case
        </Button>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading cases…</p>
      ) : casesList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
          <Briefcase className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <h3 className="mt-3 text-base font-semibold text-foreground">No legal cases yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Open your first case to track legal progress and manage documents with your lawyer.</p>
          <Button onClick={() => setIsModalOpen(true)} className="mt-5 gap-2">
            <Plus className="h-4 w-4" />
            Open New Case
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {casesList.map((legalCase) => {
            const isOpen = expanded === legalCase.id || (expanded === null && casesList[0]?.id === legalCase.id);
            const caseDocs = legalCase.documents && legalCase.documents.length > 0
              ? legalCase.documents
              : docsList.filter((d) => d.caseId === legalCase.id);

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
                        <p className="text-xs text-muted-foreground">
                          Case ID: {legalCase.id.toUpperCase().slice(0, 12)} · {legalCase.practiceArea} · {legalCase.lawyerName || "Unassigned"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {legalCase.priority && (
                        <Badge variant={legalCase.priority === "high" ? "danger" : legalCase.priority === "medium" ? "warning" : "neutral"} className="capitalize">
                          {legalCase.priority}
                        </Badge>
                      )}
                      <Badge variant={STATUS_VARIANT[legalCase.status] || "neutral"} className="capitalize">
                        {legalCase.status.replace("-", " ").replace("_", " ")}
                      </Badge>
                    </div>
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
                        {legalCase.description && (
                          <div className="mb-5">
                            <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</h4>
                            <p className="text-xs text-foreground/80 leading-relaxed bg-surface-sunken p-3 rounded-lg">{legalCase.description}</p>
                          </div>
                        )}

                        <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" /> Timeline
                        </h4>
                        <Timeline
                          steps={[
                            { title: "Case opened", timestamp: formatDate(legalCase.createdAt || legalCase.updatedAt), status: "complete" },
                            { title: "Documents reviewed", status: legalCase.progress > 30 ? "complete" : "upcoming" },
                            { title: "In progress", status: legalCase.status === "in-progress" || legalCase.status === "in_progress" ? "current" : legalCase.progress > 60 ? "complete" : "upcoming" },
                            { title: "Resolved", status: legalCase.status === "resolved" || legalCase.status === "closed" ? "complete" : "upcoming" },
                          ]}
                        />

                        <h4 className="mb-2 mt-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" /> Case Documents
                        </h4>
                        {caseDocs.length > 0 ? (
                          <ul className="space-y-1.5">
                            {caseDocs.map((doc) => (
                              <li key={doc.id} className="flex items-center justify-between rounded-lg bg-surface-sunken px-3 py-2 text-xs">
                                <span className="text-foreground font-medium">{doc.name}</span>
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
                          <StickyNote className="h-3.5 w-3.5" /> Private Notes
                        </h4>
                        <Textarea
                          placeholder="Add private notes about this case…"
                          rows={4}
                          value={notes[legalCase.id] ?? legalCase.notes ?? ""}
                          onChange={(e) => setNotes((prev) => ({ ...prev, [legalCase.id]: e.target.value }))}
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(ROUTES.clientMessages)}>
                            <MessageSquare className="h-3.5 w-3.5" /> Chat
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveNotes(legalCase.id)}
                            isLoading={savingNotes[legalCase.id]}
                          >
                            Save Note
                          </Button>
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

      {/* Open New Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-display text-lg font-bold text-foreground">Open a New Legal Case</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-surface-sunken"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleOpenCase} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Case Title *</label>
                <Input
                  placeholder="e.g. Property Title Verification or Trademark Registration"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Practice Area *</label>
                  <Select
                    options={PRACTICE_AREAS}
                    value={practiceArea}
                    onValueChange={setPracticeArea}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Priority</label>
                  <Select
                    options={PRIORITIES}
                    value={priority}
                    onValueChange={(v) => setPriority(v as any)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Assign to Preferred Lawyer (Optional)</label>
                <Select
                  options={lawyerOptions}
                  value={selectedLawyerId}
                  onValueChange={setSelectedLawyerId}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Description / Details *</label>
                <Textarea
                  placeholder="Describe your legal matter, key dates, or specific requests for counsel…"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Open Case
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CasesPage;
