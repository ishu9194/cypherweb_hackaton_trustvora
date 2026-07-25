import { useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import { PRACTICE_AREAS } from "@/data/practiceAreas.data";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { SearchBox } from "@/components/ui/search-box";
import { EmptyState } from "@/components/states/EmptyState";
import { formatDate } from "@/lib/utils";

interface GlobalCase { id: string; title: string; client: string; lawyer: string; practiceArea: string; status: "open" | "in-progress" | "closed"; updatedAt: string }

const CASES: GlobalCase[] = [
  { id: "GC-1001", title: "Founders' Agreement Drafting", client: "Meet Agrawal", lawyer: "Adv. Priya Sharma", practiceArea: "Startup Law", status: "in-progress", updatedAt: "2026-07-19T00:00:00" },
  { id: "GC-1002", title: "Flat Purchase Title Verification", client: "Neha Kulkarni", lawyer: "Adv. Vikram Nair", practiceArea: "Property Law", status: "closed", updatedAt: "2026-06-02T00:00:00" },
  { id: "GC-1003", title: "GST Notice Response", client: "Farhan Ali", lawyer: "Adv. Kavita Desai", practiceArea: "Taxation", status: "open", updatedAt: "2026-07-15T00:00:00" },
  { id: "GC-1004", title: "Employment Dispute Review", client: "Sanjay Malhotra", lawyer: "Adv. Simran Kaur", practiceArea: "Employment", status: "open", updatedAt: "2026-07-18T00:00:00" },
  { id: "GC-1005", title: "Trademark Opposition", client: "Karan Vora", lawyer: "Adv. Meher Fernandes", practiceArea: "Trademark", status: "in-progress", updatedAt: "2026-07-12T00:00:00" },
  { id: "GC-1006", title: "Business Registration — LLP", client: "Ayesha Khan", lawyer: "Adv. Devendra Rao", practiceArea: "Business Registration", status: "closed", updatedAt: "2026-05-28T00:00:00" },
];

const STATUS_OPTIONS = [{ value: "all", label: "All statuses" }, { value: "open", label: "Open" }, { value: "in-progress", label: "In Progress" }, { value: "closed", label: "Closed" }];
const STATUS_VARIANT: Record<GlobalCase["status"], "warning" | "brand" | "success"> = { open: "warning", "in-progress": "brand", closed: "success" };

export function AdminCasesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [area, setArea] = useState("all");

  const filtered = useMemo(
    () =>
      CASES.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()) || c.client.toLowerCase().includes(query.toLowerCase()))
        .filter((c) => status === "all" || c.status === status)
        .filter((c) => area === "all" || c.practiceArea === area),
    [query, status, area],
  );

  const columns: DataGridColumn<GlobalCase>[] = [
    { key: "id", header: "Case ID", render: (c) => <span className="font-mono text-xs">{c.id}</span> },
    { key: "title", header: "Title", render: (c) => c.title, sortValue: (c) => c.title },
    { key: "client", header: "Client", render: (c) => c.client },
    { key: "lawyer", header: "Lawyer", render: (c) => c.lawyer },
    { key: "area", header: "Practice Area", render: (c) => c.practiceArea },
    { key: "status", header: "Status", render: (c) => <Badge variant={STATUS_VARIANT[c.status]} className="capitalize">{c.status.replace("-", " ")}</Badge> },
    { key: "updated", header: "Updated", render: (c) => formatDate(c.updatedAt), sortValue: (c) => c.updatedAt },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">All Cases</h2>
        <p className="mt-1 text-sm text-muted-foreground">{CASES.length} cases across the platform.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBox placeholder="Search by case or client…" onSearch={setQuery} className="sm:flex-1" />
        <Select options={STATUS_OPTIONS} value={status} onValueChange={setStatus} className="sm:w-48" />
        <Select options={[{ value: "all", label: "All practice areas" }, ...PRACTICE_AREAS.map((a) => ({ value: a.name, label: a.name }))]} value={area} onValueChange={setArea} className="sm:w-56" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Briefcase className="h-5 w-5" />} title="No cases match your filters" description="Try adjusting your search or filters." />
      ) : (
        <DataGrid columns={columns} rows={filtered} getRowId={(c) => c.id} />
      )}
    </div>
  );
}
