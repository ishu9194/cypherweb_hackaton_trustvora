import { useMemo, useState } from "react";
import { ShieldCheck, ShieldOff, Users } from "lucide-react";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/ui/search-box";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { toast } from "@/components/ui/toaster";
import { adminService } from "@/services/api/admin";
import { useAsync } from "@/hooks/useAsync";
import type { Lawyer } from "@/types";

export function AdminLawyersPage() {
  const { data: lawyers, isLoading, error, refetch } = useAsync(() => adminService.getLawyers(), []);
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const toggleVerified = async (l: Lawyer) => {
    setPendingId(l.id);
    try {
      await adminService.setLawyerVerified(l.id, !l.verified);
      toast.success(`Lawyer ${l.name} status updated to ${!l.verified ? "Verified" : "Pending"}`);
      refetch();
    } catch {
      toast.error("Failed to update lawyer verification status");
    } finally {
      setPendingId(null);
    }
  };

  const filtered = useMemo(() => {
    if (!lawyers) return [];
    return lawyers.filter(
      (l) => l.name.toLowerCase().includes(query.toLowerCase()) || l.city.toLowerCase().includes(query.toLowerCase())
    );
  }, [lawyers, query]);

  const columns: DataGridColumn<Lawyer>[] = [
    {
      key: "name",
      header: "Lawyer",
      render: (l) => (
        <div className="flex items-center gap-2.5">
          <Avatar src={l.avatarUrl} name={l.name} size="sm" />
          <span className="text-foreground font-medium">{l.name}</span>
        </div>
      ),
      sortValue: (l) => l.name,
    },
    { key: "city", header: "City", render: (l) => l.city, sortValue: (l) => l.city },
    { key: "qualification", header: "Qualification", render: (l) => l.qualification },
    { key: "rating", header: "Rating", render: (l) => l.rating.toFixed(1), sortValue: (l) => l.rating, align: "right" },
    {
      key: "status",
      header: "Status",
      render: (l) => (
        <Badge variant={l.verified ? "success" : "warning"}>
          {l.verified ? "Verified" : "Pending"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (l) => (
        <Button
          size="sm"
          variant="ghost"
          disabled={pendingId === l.id}
          onClick={() => toggleVerified(l)}
        >
          {pendingId === l.id ? (
            "Updating…"
          ) : l.verified ? (
            <>
              <ShieldOff className="h-3.5 w-3.5" /> Suspend
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5" /> Verify
            </>
          )}
        </Button>
      ),
      align: "right",
    },
  ];

  if (error) {
    return <ErrorState description={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Manage Lawyers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Loading lawyers…" : `${lawyers?.length ?? 0} lawyers on the platform.`}
          </p>
        </div>
        <SearchBox placeholder="Search lawyers by name or city…" onSearch={setQuery} className="sm:w-72" />
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border p-14 text-center text-sm text-muted-foreground">Loading lawyers…</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Users className="h-5 w-5" />} title="No lawyers found" description="Try adjusting your search filters." />
      ) : (
        <DataGrid columns={columns} rows={filtered} getRowId={(l) => l.id} />
      )}
    </div>
  );
}

export default AdminLawyersPage;
