import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarCheck, Heart, MessageCircle, Scale as ScaleIcon, Share2, Star, TrendingUp } from "lucide-react";
import type { Lawyer } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toaster";
import { formatCurrency, cn } from "@/lib/utils";
import { MAX_COMPARE, useCompareStore } from "@/hooks/useCompareStore";
import { useFavoritesStore } from "@/hooks/useFavoritesStore";
import { ROUTES } from "@/constants/routes.constants";
import { lawyersService } from "@/services/api/lawyers.service";

export const LawyerListItem = memo(function LawyerListItem({ lawyer, className }: { lawyer: Lawyer; className?: string }) {
  const navigate = useNavigate();
  const { isFavorited, toggleFavorite } = useFavoritesStore();
  const { isCompared, toggleCompare, isFull } = useCompareStore();
  const favorited = isFavorited(lawyer.id);
  const compared = isCompared(lawyer.id);

  return (
    <div
      className={cn("card-lift animate-fade-up flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center", className)}
    >

      <div className="flex items-center gap-4 sm:w-64 sm:shrink-0">
        <Avatar src={lawyer.avatarUrl} name={lawyer.name} size="lg" online={lawyer.online} verified={lawyer.verified} />
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">{lawyer.name}</h3>
          <p className="text-xs text-muted-foreground">{lawyer.qualification}</p>
          <span className="mt-1 flex items-center gap-1 text-xs font-medium text-amber-500">
            <Star className="h-3 w-3 fill-current" /> {lawyer.rating} ({lawyer.reviewCount})
          </span>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap gap-1.5">
          {lawyer.specializations.map((spec) => <Badge key={spec} variant="brand">{spec}</Badge>)}
          {lawyer.verified && <Badge variant="success">Verified</Badge>}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {lawyer.experienceYears} yrs · {lawyer.city} · {lawyer.languages.slice(0, 2).join(", ")}
        </p>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span>{lawyer.casesWon} cases handled</span>
          <span className="flex items-center gap-1 text-accent-600"><TrendingUp className="h-3 w-3" /> {lawyer.successRate}% success</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
        <div className="text-left sm:text-right">
          <p className="font-display text-lg font-bold text-foreground">{formatCurrency(lawyer.consultationFee)}</p>
          <p className="text-[11px] text-muted-foreground">~{lawyer.responseTimeMinutes} min response</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Tooltip content={favorited ? "Remove favorite" : "Add to favorites"}>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Favorite"
              onClick={async () => {
                toggleFavorite(lawyer.id);
                try {
                  await lawyersService.toggleSaveLawyer(lawyer.id);
                } catch {
                  // Fall back
                }
                toast.success(favorited ? "Removed from favorites" : "Added to favorites");
              }}
            >
              <Heart className={cn("h-4 w-4", favorited && "fill-danger text-danger")} />
            </Button>
          </Tooltip>
          <Tooltip content={compared ? "Remove from compare" : "Add to compare"}>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Compare"
              className={cn(compared && "text-brand-600")}
              onClick={() => {
                if (!compared && isFull) { toast.error(`You can compare up to ${MAX_COMPARE} lawyers at a time`); return; }
                toggleCompare(lawyer.id);
                toast.success(compared ? "Removed from comparison" : "Added to comparison");
              }}
            >
              <ScaleIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Chat now">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Chat"
              onClick={() => navigate(`/dashboard/messages?lawyerId=${lawyer.id}&lawyerName=${encodeURIComponent(lawyer.name)}`)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Share profile">
            <Button size="icon" variant="ghost" aria-label="Share" onClick={() => toast.success("Profile link copied to clipboard")}>
              <Share2 className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
        <div className="flex w-full gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={ROUTES.lawyerProfile(lawyer.id)}>Profile</Link>
          </Button>
          <Button size="sm" onClick={() => navigate(ROUTES.bookLawyer(lawyer.id))}>
            <CalendarCheck className="h-3.5 w-3.5" /> Book
          </Button>
        </div>
      </div>
    </div>
  );
});

