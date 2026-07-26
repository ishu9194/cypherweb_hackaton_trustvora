import { useState } from "react";
import { Download, FileBarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/states/ErrorState";
import { toast } from "@/components/ui/toaster";
import { downloadTextFile } from "@/lib/utils";
import { adminService } from "@/services/api/admin";
import { useAsync } from "@/hooks/useAsync";

export function AdminReportsPage() {
  const { data: reports, isLoading, error, refetch } = useAsync(() => adminService.getReports(), []);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const handleExport = async (id: string, name: string) => {
    setExportingId(id);
    try {
      const { filename, content } = await adminService.exportReport(id, name);
      downloadTextFile(filename, content);
      toast.success(`Report "${name}" downloaded successfully`);
    } catch {
      toast.error("Failed to export report");
    } finally {
      setExportingId(null);
    }
  };

  if (error) {
    return <ErrorState description={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Reports</h2>
        <p className="mt-1 text-sm text-muted-foreground">Generate and export platform reports.</p>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading reports…</p>
      ) : !reports || reports.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No reports available for export.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {reports.map((report) => (
            <Card key={report.id} lift>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                    <FileBarChart className="h-4.5 w-4.5" />
                  </span>
                  <p className="text-sm font-medium text-foreground">{report.name}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={exportingId === report.id}
                  onClick={() => handleExport(report.id, report.name)}
                >
                  {exportingId === report.id ? (
                    "Exporting…"
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" /> Export
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReportsPage;
