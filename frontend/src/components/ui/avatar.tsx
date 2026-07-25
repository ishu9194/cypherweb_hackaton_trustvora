import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { BadgeCheck } from "lucide-react";
import { getInitials, cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  verified?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-base",
  xl: "h-24 w-24 text-xl",
};

const badgeSize = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3.5 w-3.5",
  xl: "h-5 w-5",
};

export function Avatar({ src, name, size = "md", online, verified, className }: AvatarProps) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <AvatarPrimitive.Root className={cn("flex items-center justify-center overflow-hidden rounded-full bg-brand-100 font-semibold text-brand-700", sizeClasses[size])}>
        <AvatarPrimitive.Image src={src} alt={name} className="h-full w-full object-cover" />
        <AvatarPrimitive.Fallback delayMs={300}>{getInitials(name)}</AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {online && (
        <span
          className={cn("absolute bottom-0 right-0 rounded-full border-2 border-surface bg-accent-500", badgeSize[size])}
          aria-label="Online"
        />
      )}
      {verified && !online && (
        <BadgeCheck className={cn("absolute -bottom-0.5 -right-0.5 rounded-full bg-surface text-brand-600", badgeSize[size])} aria-label="Verified" />
      )}
    </div>
  );
}
