import { useEffect, useState } from "react";
import { useNavigate } from "react"
import { MessageCircle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";
import { lawyerDashboardService } from "@/services/api/lawyerDashboard.service";

interface RosterClient {
  id: string;
  name: string;
  email?: string;
  casesCount: number;
  status: string;
}

export function LawyerClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<RosterClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lawyerDashboardService.getClients().then((res) => {
      setClients(res || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Clients</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? "Loading clients…" : `${clients.length} client${clients.length === 1 ? "" : "s"} on your roster.`}
        </p>
      </div>

      {clients.length === 0 && !loading ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <p className="mt-2 text-sm font-semibold text-foreground">No clients on your roster yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Clients who book appointments or assign cases to you will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {clients.map((c) => (
            <Card key={c.id || c.name} lift>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.casesCount} case{c.casesCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={c.status === "Active" ? "success" : "neutral"}>{c.status}</Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Message"
                    onClick={() => navigate(ROUTES.lawyerMessages)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default LawyerClientsPage;
