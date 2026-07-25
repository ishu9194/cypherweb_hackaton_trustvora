import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AdminClient { name: string; email: string; joined: string; cases: number; status: "Active" | "Inactive" }

const CLIENTS: AdminClient[] = [
  { name: "Meet Agrawal", email: "client@trustora.dev", joined: "2026-01-14", cases: 3, status: "Active" },
  { name: "Sanjay Malhotra", email: "sanjay@example.com", joined: "2025-11-02", cases: 1, status: "Active" },
  { name: "Neha Kulkarni", email: "neha@example.com", joined: "2025-09-20", cases: 1, status: "Inactive" },
  { name: "Farhan Ali", email: "farhan@example.com", joined: "2026-03-08", cases: 2, status: "Active" },
];

export function AdminClientsPage() {
  const columns: DataGridColumn<AdminClient>[] = [
    { key: "name", header: "Client", render: (c) => <div className="flex items-center gap-2.5"><Avatar name={c.name} size="sm" /><span className="text-foreground">{c.name}</span></div>, sortValue: (c) => c.name },
    { key: "email", header: "Email", render: (c) => c.email },
    { key: "cases", header: "Cases", render: (c) => c.cases, sortValue: (c) => c.cases, align: "right" },
    { key: "status", header: "Status", render: (c) => <Badge variant={c.status === "Active" ? "success" : "neutral"}>{c.status}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Manage Clients</h2>
        <p className="mt-1 text-sm text-muted-foreground">{CLIENTS.length} registered clients.</p>
      </div>
      <DataGrid columns={columns} rows={CLIENTS} getRowId={(c) => c.email} />
    </div>
  );
}
