import { useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { LAWYERS } from "@/data/lawyers.data";
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/ui/search-box";
import { toast } from "@/components/ui/toaster";
import type { Lawyer } from "@/types";

export function AdminLawyersPage() {
  const [lawyers, setLawyers] = useState(LAWYERS);
  const [query, setQuery] = useState("");

  const toggleVerified = (id: string) => {
    setLawyers((prev) => prev.map((l) => (l.id === id ? { ...l, verified: !l.verified } : l)));
    toast.success("Lawyer status updated");
  };

  const filtered = lawyers.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()));

  const columns: DataGridColumn<Lawyer>[] = [
    { key: "name", header: "Lawyer", render: (l) => (
      <div className="flex items-center gap-2.5"><Avatar src={l.avatarUrl} name={l.name} size="sm" /><span className="text-foreground">{l.name}</span></div>
    ), sortValue: (l) => l.name },
    { key: "city", header: "City", render: (l) => l.city, sortValue: (l) => l.city },
    { key: "rating", header: "Rating", render: (l) => l.rating.toFixed(1), sortValue: (l) => l.rating, align: "right" },
    { key: "status", header: "Status", render: (l) => <Badge variant={l.verified ? "success" : "warning"}>{l.verified ? "Verified" : "Pending"}</Badge> },
    { key: "actions", header: "", render: (l) => (
      <Button size="sm" variant="ghost" onClick={() => toggleVerified(l.id)}>
        {l.verified ? <><ShieldOff className="h-3.5 w-3.5" /> Suspend</> : <><ShieldCheck className="h-3.5 w-3.5" /> Verify</>}
      </Button>
    ), align: "right" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Manage Lawyers</h2>
          <p className="mt-1 text-sm text-muted-foreground">{lawyers.length} lawyers on the platform.</p>
        </div>
        <SearchBox placeholder="Search lawyers…" onSearch={setQuery} className="sm:w-64" />
      </div>
      <DataGrid columns={columns} rows={filtered} getRowId={(l) => l.id} />
    </div>
  );
}
