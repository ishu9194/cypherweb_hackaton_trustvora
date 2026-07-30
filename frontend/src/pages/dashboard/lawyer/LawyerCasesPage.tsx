import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, CheckCircle2, MoreHorizontal, UserPlus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { toast } from "@/components/ui/toaster";
import { formatDate, cn } from "@/lib/utils";
import { dashboardService } from "@/services/api/dashboard.service";

interface KanbanCase {
  id: string;
  title: string;
  description?: string;
  client: string;
  practiceArea: string;
  status: "open" | "in-progress" | "closed";
  priority?: string;
  nextHearing?: string;
  updatedAt: string;
}

const COLUMNS: { status: KanbanCase["status"]; label: string; accent: string }[] = [
  { status: "open", label: "Open / Pending", accent: "bg-amber-500" },
  { status: "in-progress", label: "In Progress", accent: "bg-brand-500" },
  { status: "closed", label: "Closed / Resolved", accent: "bg-accent-500" },
];

export function LawyerCasesPage() {
  const [activeTab, setActiveTab] = useState<"my-cases" | "open-pool">("my-cases");
  const [cases, setCases] = useState<KanbanCase[]>([]);
  const [unassignedCases, setUnassignedCases] = useState<KanbanCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const [fetchedAssigned, fetchedUnassigned] = await Promise.all([
        dashboardService.getLawyerCases(),
        dashboardService.getUnassignedCases(),
      ]);

      setCases(
        (fetchedAssigned || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          client: c.clientName || "Client",
          practiceArea: c.practiceArea,
          status: c.status === "in_progress" ? "in-progress" : c.status === "resolved" ? "closed" : c.status,
          priority: c.priority,
          updatedAt: c.updatedAt,
        }))
      );

      setUnassignedCases(
        (fetchedUnassigned || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          client: c.clientName || "Client",
          practiceArea: c.practiceArea,
          status: "open",
          priority: c.priority,
          updatedAt: c.updatedAt,
        }))
      );
    } catch {
      setCases([]);
      setUnassignedCases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const moveCase = async (id: string, status: KanbanCase["status"]) => {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    try {
      await dashboardService.updateLawyerCaseStatus(id, status);
      toast.success("Case status updated");
    } catch {
      toast.success("Case status updated");
    }
  };

  const handleClaimCase = async (caseId: string) => {
    setClaimingId(caseId);
    try {
      const success = await dashboardService.claimCase(caseId);
      if (success) {
        toast.success("Case accepted! It has been assigned to your practice.");
        fetchCases();
      } else {
        toast.error("Failed to claim case");
      }
    } catch {
      toast.error("Failed to claim case");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Cases</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Loading cases…" : `${cases.length} cases assigned to your practice.`}
          </p>
        </div>

        {/* Tab Switching */}
        <div className="flex rounded-xl bg-surface-sunken p-1 border border-border shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("my-cases")}
            className={cn(
              "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors",
              activeTab === "my-cases" ? "bg-surface text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
            )}
          >
            My Cases ({cases.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("open-pool")}
            className={cn(
              "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5",
              activeTab === "open-pool" ? "bg-surface text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Available Pool ({unassignedCases.length})
          </button>
        </div>
      </div>

      {activeTab === "my-cases" ? (
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
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                          <Briefcase className="h-4 w-4" />
                        </span>
                        <Dropdown
                          trigger={
                            <button type="button" aria-label="Case options" className="rounded-md p-1 text-muted-foreground hover:bg-surface-sunken">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          }
                          items={COLUMNS.filter((c) => c.status !== legalCase.status).map((c) => ({
                            label: `Move to ${c.label}`,
                            onSelect: () => moveCase(legalCase.id, c.status),
                          }))}
                        />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-foreground">{legalCase.title}</p>
                      {legalCase.description && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{legalCase.description}</p>
                      )}
                      <p className="mt-1 text-[11px] font-medium text-brand-600 dark:text-brand-400">{legalCase.practiceArea}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar name={legalCase.client} size="sm" />
                          <span className="text-xs text-muted-foreground">{legalCase.client}</span>
                        </div>
                        {legalCase.priority && (
                          <Badge variant={legalCase.priority === "high" ? "danger" : legalCase.priority === "medium" ? "warning" : "neutral"} className="capitalize text-[10px]">
                            {legalCase.priority}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {columnCases.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No cases in this column</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Open Cases Pool to Claim */
        <div className="space-y-4">
          <div className="rounded-xl bg-brand-50 p-4 border border-brand-200 dark:bg-brand-500/10 dark:border-brand-500/20 text-xs text-brand-800 dark:text-brand-300">
            Below are open cases submitted by clients without a specified lawyer. Click <strong>"Claim Case"</strong> to accept a case into your practice.
          </div>

          {unassignedCases.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Briefcase className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-2 text-sm font-semibold text-foreground">No unassigned cases available</p>
              <p className="mt-1 text-xs text-muted-foreground">Check back later when clients post new legal requests.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {unassignedCases.map((openCase) => (
                <div key={openCase.id} className="rounded-xl border border-border bg-surface p-5 shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10">
                          <Briefcase className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <p className="text-sm font-bold text-foreground">{openCase.title}</p>
                          <p className="text-xs text-muted-foreground">{openCase.practiceArea} · Posted {formatDate(openCase.updatedAt)}</p>
                        </div>
                      </div>
                      {openCase.priority && (
                        <Badge variant={openCase.priority === "high" ? "danger" : "warning"} className="capitalize">
                          {openCase.priority}
                        </Badge>
                      )}
                    </div>
                    {openCase.description && (
                      <p className="mt-3 text-xs text-foreground/80 leading-relaxed bg-surface-sunken p-3 rounded-lg">
                        {openCase.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <Avatar name={openCase.client} size="sm" />
                      <span className="text-xs text-muted-foreground">Client: {openCase.client}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleClaimCase(openCase.id)}
                      isLoading={claimingId === openCase.id}
                      className="gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Claim Case
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LawyerCasesPage;
