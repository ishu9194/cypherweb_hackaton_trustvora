import { AnimatePresence, motion } from "framer-motion";
import { Scale as ScaleIcon, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompareStore } from "@/hooks/useCompareStore";
import { useDisclosure } from "@/hooks/useDisclosure";
import { LAWYERS } from "@/data/lawyers.data";
import { formatCurrency } from "@/lib/utils";

export function CompareBar() {
  const { compareList, toggleCompare, clearCompare } = useCompareStore();
  const modal = useDisclosure();
  const lawyers = LAWYERS.filter((lawyer) => compareList.includes(lawyer.id));

  return (
    <>
      <AnimatePresence>
        {lawyers.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-2xl items-center justify-between gap-4 rounded-2xl px-5 py-3 shadow-lifted sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {lawyers.map((lawyer) => (
                  <Avatar key={lawyer.id} src={lawyer.avatarUrl} name={lawyer.name} size="sm" className="ring-2 ring-background" />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">{lawyers.length} selected to compare</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={clearCompare} aria-label="Clear comparison">
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" onClick={modal.open} disabled={lawyers.length < 2}>
                <ScaleIcon className="h-3.5 w-3.5" />
                Compare
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={modal.isOpen} onOpenChange={modal.close} title="Compare Lawyers" size="lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lawyer</TableHead>
              {lawyers.map((lawyer) => (
                <TableHead key={lawyer.id} className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Avatar src={lawyer.avatarUrl} name={lawyer.name} size="sm" />
                    <span className="text-foreground">{lawyer.name}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Rating</TableCell>
              {lawyers.map((l) => <TableCell key={l.id} className="text-center">{l.rating} ({l.reviewCount})</TableCell>)}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Experience</TableCell>
              {lawyers.map((l) => <TableCell key={l.id} className="text-center">{l.experienceYears} yrs</TableCell>)}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Consultation Fee</TableCell>
              {lawyers.map((l) => <TableCell key={l.id} className="text-center">{formatCurrency(l.consultationFee)}</TableCell>)}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Response Time</TableCell>
              {lawyers.map((l) => <TableCell key={l.id} className="text-center">~{l.responseTimeMinutes} min</TableCell>)}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Success Rate</TableCell>
              {lawyers.map((l) => <TableCell key={l.id} className="text-center">{l.successRate}%</TableCell>)}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Cases Handled</TableCell>
              {lawyers.map((l) => <TableCell key={l.id} className="text-center">{l.casesWon}</TableCell>)}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Remove</TableCell>
              {lawyers.map((l) => (
                <TableCell key={l.id} className="text-center">
                  <Button size="sm" variant="ghost" onClick={() => toggleCompare(l.id)}>Remove</Button>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Modal>
    </>
  );
}
