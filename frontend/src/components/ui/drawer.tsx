import type { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: "left" | "right";
  width?: string;
}

export function Drawer({ open, onOpenChange, title, children, footer, side = "right", width = "max-w-md" }: DrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-0 z-50 flex h-full w-full flex-col border-border bg-surface-raised shadow-lifted focus:outline-none",
            width,
            side === "right" ? "right-0 border-l animate-drawer-in-right" : "left-0 border-r animate-drawer-in-left",
          )}
        >
          <div className="flex items-center justify-between border-b border-border p-6">
            {title && (
              <DialogPrimitive.Title className="font-display text-lg font-semibold text-foreground">
                {title}
              </DialogPrimitive.Title>
            )}
            <DialogPrimitive.Close
              aria-label="Close drawer"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-surface-sunken hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
          {footer && <div className="flex items-center justify-end gap-3 border-t border-border p-6">{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
