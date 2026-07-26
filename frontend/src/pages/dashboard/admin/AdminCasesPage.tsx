import { useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { SearchBox } from "@/components/ui/search-box";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { adminService, type GlobalCase } from "@/services/api/admin";
import { useAsync } from "@/hooks/useAsync";
import { formatDate } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "closed", label: "Closed" },
];

const STATUS_VARIANT: Record<GlobalCase["status"], "warning" | "brand" | "success"> = {
  open: "warning",
  "in-progress": "brand",
  closed: "success",
};

export function AdminCasesPage() {
  const { data: cases, isLoading: casesLoading, error: casesError, refetch } = useAsync(() => adminService.getCases(), []);
  const { data: practiceAreas } = useAsync(() => adminService.getPracticeAreas(), []);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [area, setArea] = useState("all");

  const areaOptions = useMemo(() => {
    const defaultAreas = practiceAreas ?? [];
    return [{ value: "all", label: "All practice areas" }, ...defaultAreas.map((a) => ({ value: a, label: a }))];
  }, [practiceAreas]);

  const filtered = useMemo(() => {
    if (!cases) return [];
    return cases
      .filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.client.toLowerCase().includes(query.toLowerCase()) ||
          c.lawyer.toLowerCase().includes(query.toLowerCase())
      )
      .filter((c) => status === "all" || c.status === status)
      .filter((c) => area === "all" || c.practiceArea === area);
  }, [cases, query, status, area]);

  const columns: DataGridColumn<GlobalCase>[] = [
    { key: "id", header: "Case ID", render: (c) => <span className="font-mono text-xs">{c.id}</span> },
    { key: "title", header: "Title", render: (c) => c.title, sortValue: (c) => c.title },
    { key: "client", header: "Client", render: (c) => c.client },
    { key: "lawyer", header: "Lawyer", render: (c) => c.lawyer },
    { key: "area", header: "Practice Area", render: (c) => c.practiceArea },
    {
      key: "status",
      header: "Status",
      render: (c) => (
        <Badge variant={STATUS_VARIANT[c.status]} className="capitalize">
          {c.status.replace("-", " ")}
        </Badge>
      ),
    },
    { key: "updated", header: "Updated", render: (c) => formatDate(c.updatedAt), sortValue: (c) => c.updatedAt },
  ];

  if (casesError) {
    return <ErrorState description={casesError} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">All Cases</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {casesLoading ? "Loading cases…" : `${filtered.length} cases across the platform.`}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBox placeholder="Search by case, client, or lawyer…" onSearch={setQuery} className="sm:flex-1" />
        <Select options={STATUS_OPTIONS} value={status} onValueChange={setStatus} className="sm:w-48" />
        <Select options={areaOptions} value={area} onValueChange={setArea} className="sm:w-56" />
      </div>

      {casesLoading ? (
        <div className="rounded-xl border border-border p-14 text-center text-sm text-muted-foreground">Loading cases…</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Briefcase className="h-5 w-5" />} title="No cases match your filters" description="Try adjusting your search or filters." />
      ) : (
        <DataGrid columns={columns} rows={filtered} getRowId={(c) => c.id} />
      )}
    </div>
  );
}

export default AdminCasesPage;
