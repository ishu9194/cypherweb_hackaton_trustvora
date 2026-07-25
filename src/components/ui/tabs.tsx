import type { ReactNode } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
}

export function Tabs({ tabs, defaultValue, className }: TabsProps) {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue ?? tabs[0]?.value} className={className}>
      <TabsPrimitive.List className="flex gap-1 overflow-x-auto rounded-lg bg-surface-sunken p-1">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
          >
            {tab.icon}
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab) => (
        <TabsPrimitive.Content key={tab.value} value={tab.value} className="mt-4 animate-fade-in focus-visible:outline-none">
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
