import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GitCompareArrows } from "lucide-react";
import type { Lawyer } from "@/types";
import { lawyersService } from "@/services/api/lawyers.service";
import { MAX_COMPARE, useCompareStore } from "@/hooks/useCompareStore";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/states/EmptyState";
import { formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

export function CompareLawyersPage() {
  const { compareList, toggleCompare, clearCompare } = useCompareStore();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (compareList.length === 0) {
      setLawyers([]);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    Promise.all(compareList.map((id) => lawyersService.getById(id))).then((results) => {
      if (!cancelled) {
        setLawyers(results.filter((l): l is Lawyer => l !== null));
        setIsLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setLawyers([]);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [compareList]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Compare Lawyers</h2>
          <p className="mt-1 text-sm text-muted-foreground">Compare up to {MAX_COMPARE} lawyers side by side.</p>
        </div>
        {lawyers.length > 0 && <Button variant="outline" size="sm" onClick={clearCompare}>Clear all</Button>}
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading lawyers to compare…</div>
      ) : lawyers.length === 0 ? (
        <EmptyState
          icon={<GitCompareArrows className="h-5 w-5" />}
          title="No lawyers to compare"
          description="Tap the compare icon on any lawyer card to add them here."
          action={<Button size="sm" asChild><Link to={ROUTES.findLawyers}>Browse lawyers</Link></Button>}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lawyer</TableHead>
              {lawyers.map((l) => (
                <TableHead key={l.id} className="text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <Avatar src={l.avatarUrl} name={l.name} size="md" />
                    <span className="text-foreground">{l.name}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { label: "Rating", render: (l: Lawyer) => `${l.rating} (${l.reviewCount})` },
              { label: "Experience", render: (l: Lawyer) => `${l.experienceYears} yrs` },
              { label: "Consultation Fee", render: (l: Lawyer) => formatCurrency(l.consultationFee) },
              { label: "Response Time", render: (l: Lawyer) => `~${l.responseTimeMinutes} min` },
              { label: "Success Rate", render: (l: Lawyer) => `${l.successRate}%` },
              { label: "Cases Handled", render: (l: Lawyer) => l.casesWon },
              { label: "Languages", render: (l: Lawyer) => l.languages.join(", ") },
              { label: "City", render: (l: Lawyer) => l.city },
            ].map((row) => (
              <TableRow key={row.label}>
                <TableCell className="font-medium">{row.label}</TableCell>
                {lawyers.map((l) => <TableCell key={l.id} className="text-center">{row.render(l)}</TableCell>)}
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-medium">Actions</TableCell>
              {lawyers.map((l) => (
                <TableCell key={l.id} className="text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <Button size="sm" asChild><Link to={ROUTES.bookLawyer(l.id)}>Book</Link></Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleCompare(l.id)}>Remove</Button>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}
