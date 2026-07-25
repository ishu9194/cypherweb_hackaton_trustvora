import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { FilterFields } from "./FilterFields";
import { countActiveFilters, type LawyerFilterState } from "@/lib/lawyerFilters";

interface AdvancedFiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: LawyerFilterState;
  onChange: <K extends keyof LawyerFilterState>(key: K, value: LawyerFilterState[K]) => void;
  onClearAll: () => void;
  resultCount: number;
}

export function AdvancedFiltersDrawer({ open, onOpenChange, filters, onChange, onClearAll, resultCount }: AdvancedFiltersDrawerProps) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Advanced Search"
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={onClearAll}>
            Clear all ({countActiveFilters(filters)})
          </Button>
          <Button className="flex-1" onClick={() => onOpenChange(false)}>
            Show {resultCount} results
          </Button>
        </>
      }
    >
      <FilterFields filters={filters} onChange={onChange} />
    </Drawer>
  );
}
