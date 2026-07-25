import { Download, FileBarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { downloadTextFile } from "@/lib/utils";

const REPORTS = ["Monthly Revenue Report", "Lawyer Verification Report", "Client Growth Report", "Consultation Analytics Report"];

export function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Reports</h2>
        <p className="mt-1 text-sm text-muted-foreground">Generate and export platform reports.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {REPORTS.map((report) => (
          <Card key={report} lift>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10"><FileBarChart className="h-4.5 w-4.5" /></span>
                <p className="text-sm font-medium text-foreground">{report}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => { downloadTextFile(`${report.replace(/\s+/g, "-")}.txt`, `${report}\nGenerated ${new Date().toLocaleString("en-IN")}`); toast.success("Report downloaded"); }}
              >
                <Download className="h-3.5 w-3.5" /> Export
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
