import type { ReactNode } from "react";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: (DropdownItem | "separator")[];
  align?: "start" | "center" | "end";
}

export function Dropdown({ trigger, items, align = "end" }: DropdownProps) {
  return (
    <DropdownPrimitive.Root>
      <DropdownPrimitive.Trigger asChild>{trigger}</DropdownPrimitive.Trigger>
      <DropdownPrimitive.Portal>
        <DropdownPrimitive.Content
          align={align}
          sideOffset={8}
          className="z-50 min-w-[12rem] rounded-lg border border-border bg-surface-raised p-1.5 shadow-lifted animate-scale-in origin-[var(--radix-dropdown-menu-content-transform-origin)]"
        >
          {items.map((item, index) =>
            item === "separator" ? (
              <DropdownPrimitive.Separator key={`sep-${index}`} className="my-1.5 h-px bg-border" />
            ) : (
              <DropdownPrimitive.Item
                key={item.label}
                disabled={item.disabled}
                onSelect={item.onSelect}
                className={cn(
                  "flex cursor-pointer select-none items-center gap-2.5 rounded-md px-3 py-2 text-sm outline-none transition-colors",
                  item.destructive ? "text-danger data-[highlighted]:bg-danger/10" : "text-foreground data-[highlighted]:bg-surface-sunken",
                  item.disabled && "opacity-50",
                )}
              >
                {item.icon}
                {item.label}
              </DropdownPrimitive.Item>
            ),
          )}
        </DropdownPrimitive.Content>
      </DropdownPrimitive.Portal>
    </DropdownPrimitive.Root>
  );
}
