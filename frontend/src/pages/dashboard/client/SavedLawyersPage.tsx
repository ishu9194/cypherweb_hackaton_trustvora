import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, LayoutGrid, List } from "lucide-react";
import type { Lawyer } from "@/types";
import { lawyersService } from "@/services/api/lawyers.service";
import { useFavoritesStore } from "@/hooks/useFavoritesStore";
import { LawyerCard } from "@/components/lawyers/LawyerCard";
import { LawyerListItem } from "@/components/lawyers/LawyerListItem";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

export function SavedLawyersPage() {
  const { favorites } = useFavoritesStore();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [saved, setSaved] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    lawyersService.getSavedLawyers().then(async (dbSaved) => {
      if (!cancelled && dbSaved.length > 0) {
        setSaved(dbSaved);
        setIsLoading(false);
        return;
      }

      const ids = Array.from(favorites);
      if (ids.length === 0) {
        if (!cancelled) {
          setSaved([]);
          setIsLoading(false);
        }
        return;
      }

      const results = await Promise.all(ids.map((id) => lawyersService.getById(id)));
      if (!cancelled) {
        setSaved(results.filter((l): l is Lawyer => l !== null));
        setIsLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setSaved([]);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [favorites]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Saved Lawyers</h2>
          <p className="mt-1 text-sm text-muted-foreground">{saved.length} lawyer{saved.length === 1 ? "" : "s"} saved for later.</p>
        </div>
        <div className="flex items-center rounded-lg border border-border p-0.5">
          <button type="button" aria-label="Grid view" onClick={() => setView("grid")} className={cn("flex h-8 w-8 items-center justify-center rounded-md", view === "grid" ? "bg-brand-600 text-white" : "text-muted-foreground")}>
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button type="button" aria-label="List view" onClick={() => setView("list")} className={cn("flex h-8 w-8 items-center justify-center rounded-md", view === "list" ? "bg-brand-600 text-white" : "text-muted-foreground")}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading saved lawyers…</div>
      ) : saved.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-5 w-5" />}
          title="No saved lawyers yet"
          description="Tap the heart icon on any lawyer's profile or card to save them here."
          action={<Button size="sm" asChild><Link to={ROUTES.findLawyers}>Browse lawyers</Link></Button>}
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {saved.map((lawyer) => <LawyerCard key={lawyer.id} lawyer={lawyer} />)}
        </div>
      ) : (
        <div className="space-y-4">
          {saved.map((lawyer) => <LawyerListItem key={lawyer.id} lawyer={lawyer} />)}
        </div>
      )}
    </div>
  );
}
