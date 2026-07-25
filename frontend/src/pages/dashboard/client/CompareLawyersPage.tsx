import { Link } from "react-router-dom";
import { GitCompareArrows } from "lucide-react";
import { LAWYERS } from "@/data/lawyers.data";
import { MAX_COMPARE, useCompareStore } from "@/hooks/useCompareStore";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/states/EmptyState";
import { formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

export function CompareLawyersPage() {
  const { compareList, toggleCompare, clearCompare } = useCompareStore();
  const lawyers = LAWYERS.filter((l) => compareList.includes(l.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Compare Lawyers</h2>
          <p className="mt-1 text-sm text-muted-foreground">Compare up to {MAX_COMPARE} lawyers side by side.</p>
        </div>
        {lawyers.length > 0 && <Button variant="outline" size="sm" onClick={clearCompare}>Clear all</Button>}
      </div>

      {lawyers.length === 0 ? (
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
              { label: "Rating", render: (l: typeof lawyers[number]) => `${l.rating} (${l.reviewCount})` },
              { label: "Experience", render: (l: typeof lawyers[number]) => `${l.experienceYears} yrs` },
              { label: "Consultation Fee", render: (l: typeof lawyers[number]) => formatCurrency(l.consultationFee) },
              { label: "Response Time", render: (l: typeof lawyers[number]) => `~${l.responseTimeMinutes} min` },
              { label: "Success Rate", render: (l: typeof lawyers[number]) => `${l.successRate}%` },
              { label: "Cases Handled", render: (l: typeof lawyers[number]) => l.casesWon },
              { label: "Languages", render: (l: typeof lawyers[number]) => l.languages.join(", ") },
              { label: "City", render: (l: typeof lawyers[number]) => l.city },
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
