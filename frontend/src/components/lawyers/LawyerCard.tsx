import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, Heart, MessageCircle, Scale as ScaleIcon, Share2, Star, TrendingUp } from "lucide-react";
import type { Lawyer } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toaster";
import { ROUTES } from "@/constants/routes.constants";
import { formatCurrency, cn } from "@/lib/utils";
import { useCompareStore } from "@/hooks/useCompareStore";
import { useFavoritesStore } from "@/hooks/useFavoritesStore";

interface LawyerCardProps {
  lawyer: Lawyer;
  className?: string;
}

export function LawyerCard({ lawyer, className }: LawyerCardProps) {
  const navigate = useNavigate();
  const { isFavorited, toggleFavorite } = useFavoritesStore();
  const { isCompared, toggleCompare, isFull } = useCompareStore();
  const [shared, setShared] = useState(false);

  const favorited = isFavorited(lawyer.id);
  const compared = isCompared(lawyer.id);

  const handleToggleFavorite = () => {
    toggleFavorite(lawyer.id);
    toast.success(favorited ? `Removed ${lawyer.name} from favorites` : `Added ${lawyer.name} to favorites`);
  };

  const handleToggleCompare = () => {
    if (!compared && isFull) {
      toast.error("You can compare up to 3 lawyers at a time");
      return;
    }
    toggleCompare(lawyer.id);
    toast.success(compared ? "Removed from comparison" : `Added ${lawyer.name} to comparison`);
  };

  const handleShare = () => {
    setShared(true);
    toast.success("Profile link copied to clipboard");
    setTimeout(() => setShared(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className={cn("card-lift group flex flex-col rounded-2xl border border-border bg-surface p-6", className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={lawyer.avatarUrl} name={lawyer.name} size="lg" online={lawyer.online} verified={lawyer.verified} />
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">{lawyer.name}</h3>
            <p className="text-xs text-muted-foreground">{lawyer.qualification}</p>
            <p className="text-xs text-muted-foreground">{lawyer.court}</p>
          </div>
        </div>
        <Tooltip content={favorited ? "Remove favorite" : "Add to favorites"}>
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label="Toggle favorite"
            aria-pressed={favorited}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-surface-sunken hover:text-danger"
          >
            <Heart className={cn("h-4.5 w-4.5", favorited && "fill-danger text-danger")} />
          </button>
        </Tooltip>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {lawyer.specializations.map((spec) => (
          <Badge key={spec} variant="brand">{spec}</Badge>
        ))}
        {lawyer.verified && <Badge variant="success">Verified</Badge>}
        {lawyer.online && <Badge variant="accent">Available today</Badge>}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 font-medium text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="text-foreground">{lawyer.rating}</span> ({lawyer.reviewCount})
        </span>
        <span>{lawyer.experienceYears} yrs experience</span>
        <span>{lawyer.languages.slice(0, 2).join(", ")}</span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{lawyer.bio}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-surface-sunken p-3 text-center">
        <div>
          <p className="font-display text-sm font-bold text-foreground">{lawyer.casesWon}</p>
          <p className="text-[10px] text-muted-foreground">Cases Handled</p>
        </div>
        <div className="border-l border-border">
          <p className="flex items-center justify-center gap-1 font-display text-sm font-bold text-accent-600">
            <TrendingUp className="h-3 w-3" /> {lawyer.successRate}%
          </p>
          <p className="text-[10px] text-muted-foreground">Success Rate</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-[11px] text-muted-foreground">Consultation fee</p>
          <p className="font-display text-base font-bold text-foreground">{formatCurrency(lawyer.consultationFee)}</p>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Responds in <span className="font-medium text-accent-600">~{lawyer.responseTimeMinutes} min</span>
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={ROUTES.lawyerProfile(lawyer.id)}>
            <ScaleIcon className="h-3.5 w-3.5" />
            Profile
          </Link>
        </Button>
        <Button size="sm" className="flex-1" onClick={() => navigate(ROUTES.bookLawyer(lawyer.id))}>
          <CalendarCheck className="h-3.5 w-3.5" />
          Book
        </Button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Tooltip content="Chat now">
          <Button
            size="icon"
            variant="ghost"
            aria-label="Chat"
            className="flex-1"
            onClick={() => toast.success(`Starting a chat with ${lawyer.name}`)}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content={compared ? "Remove from compare" : "Add to compare"}>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Compare"
            aria-pressed={compared}
            className={cn("flex-1", compared && "text-brand-600")}
            onClick={handleToggleCompare}
          >
            <ScaleIcon className="h-4 w-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Share profile">
          <Button size="icon" variant="ghost" aria-label="Share" className="flex-1" onClick={handleShare}>
            <Share2 className={cn("h-4 w-4", shared && "text-accent-600")} />
          </Button>
        </Tooltip>
      </div>
    </motion.div>
  );
}
