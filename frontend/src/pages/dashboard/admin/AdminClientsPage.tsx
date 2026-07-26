import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchBox } from "@/components/ui/search-box";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { adminService, type AdminClient } from "@/services/api/admin";
import { useAsync } from "@/hooks/useAsync";

export function AdminClientsPage() {
  const { data: clients, isLoading, error, refetch } = useAsync(() => adminService.getClients(), []);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!clients) return [];
    return clients.filter(
      (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase())
    );
  }, [clients, query]);

  const columns: DataGridColumn<AdminClient>[] = [
    {
      key: "name",
      header: "Client",
      render: (c) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={c.name} size="sm" />
          <span className="text-foreground font-medium">{c.name}</span>
        </div>
      ),
      sortValue: (c) => c.name,
    },
    { key: "email", header: "Email", render: (c) => c.email },
    { key: "joined", header: "Joined Date", render: (c) => c.joined, sortValue: (c) => c.joined },
    { key: "cases", header: "Cases", render: (c) => c.cases, sortValue: (c) => c.cases, align: "right" },
    {
      key: "status",
      header: "Status",
      render: (c) => <Badge variant={c.status === "Active" ? "success" : "neutral"}>{c.status}</Badge>,
    },
  ];

  if (error) {
    return <ErrorState description={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Manage Clients</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Loading clients…" : `${clients?.length ?? 0} registered clients.`}
          </p>
        </div>
        <SearchBox placeholder="Search clients by name or email…" onSearch={setQuery} className="sm:w-72" />
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border p-14 text-center text-sm text-muted-foreground">Loading clients…</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Users className="h-5 w-5" />} title="No clients found" description="Try adjusting your search query." />
      ) : (
        <DataGrid columns={columns} rows={filtered} getRowId={(c) => c.email} />
      )}
    </div>
  );
}

export default AdminClientsPage;
