import { MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

const CLIENTS = [
  { name: "Meet Agrawal", cases: 2, status: "Active" },
  { name: "Sanjay Malhotra", cases: 1, status: "Active" },
  { name: "Neha Kulkarni", cases: 1, status: "Closed" },
  { name: "Farhan Ali", cases: 3, status: "Active" },
];

export function LawyerClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Clients</h2>
        <p className="mt-1 text-sm text-muted-foreground">{CLIENTS.length} clients on your roster.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CLIENTS.map((c) => (
          <Card key={c.name} lift>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={c.name} size="md" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.cases} case{c.cases === 1 ? "" : "s"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={c.status === "Active" ? "success" : "neutral"}>{c.status}</Badge>
                <Button size="icon" variant="ghost" aria-label="Message" onClick={() => toast.success(`Opening chat with ${c.name}`)}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
