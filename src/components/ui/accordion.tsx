import type { ReactNode } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemData {
  value: string;
  question: string;
  answer: ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  type?: "single" | "multiple";
  className?: string;
}

export function Accordion({ items, type = "single", className }: AccordionProps) {
  const rootProps = type === "single" ? { type: "single" as const, collapsible: true } : { type: "multiple" as const };

  return (
    <AccordionPrimitive.Root {...rootProps} className={cn("divide-y divide-border rounded-xl border border-border bg-surface", className)}>
      {items.map((item) => (
        <AccordionPrimitive.Item key={item.value} value={item.value}>
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:text-brand-600 focus-visible:outline-none">
              {item.question}
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden text-sm text-muted-foreground data-[state=open]:animate-fade-in">
            <div className="px-5 pb-4">{item.answer}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
