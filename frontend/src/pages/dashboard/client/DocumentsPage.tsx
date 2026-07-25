import { useState } from "react";
import { motion } from "framer-motion";
import { Download, File, Search, Trash2, Upload, Edit2 } from "lucide-react";
import { DASHBOARD_DOCUMENTS, type DashboardDocument } from "@/data/dashboardExtras.data";
import { SearchBox } from "@/components/ui/search-box";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/states/EmptyState";
import { toast } from "@/components/ui/toaster";
import { useDisclosure } from "@/hooks/useDisclosure";
import { downloadTextFile, formatDate, cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "all", label: "All categories" },
  { value: "Contracts", label: "Contracts" },
  { value: "Court Filings", label: "Court Filings" },
  { value: "ID Proof", label: "ID Proof" },
  { value: "Correspondence", label: "Correspondence" },
];

export function DocumentsPage() {
  const [docs, setDocs] = useState(DASHBOARD_DOCUMENTS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const renameModal = useDisclosure();
  const [renaming, setRenaming] = useState<DashboardDocument | null>(null);
  const [newName, setNewName] = useState("");

  const filtered = docs.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()) && (category === "all" || d.category === category));

  const addFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const id = `doc-${Date.now()}-${Math.random()}`;
      const doc: DashboardDocument = { id, name: file.name, category: "Correspondence", sizeLabel: `${(file.size / 1024).toFixed(0)} KB`, uploadedAt: new Date().toISOString() };
      setDocs((prev) => [doc, ...prev]);
      setUploadProgress((prev) => ({ ...prev, [id]: 0 }));
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25 + Math.random() * 25;
        setUploadProgress((prev) => ({ ...prev, [id]: Math.min(100, progress) }));
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress((prev) => { const next = { ...prev }; delete next[id]; return next; }), 500);
        }
      }, 300);
    });
    toast.success(`${files.length} file(s) uploading`);
  };

  const openRename = (doc: DashboardDocument) => { setRenaming(doc); setNewName(doc.name); renameModal.open(); };
  const saveRename = () => {
    if (!renaming) return;
    setDocs((prev) => prev.map((d) => (d.id === renaming.id ? { ...d, name: newName } : d)));
    renameModal.close();
    toast.success("Document renamed");
  };

  const deleteDoc = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    toast.success("Document deleted");
  };

  const downloadDoc = (doc: DashboardDocument) => {
    downloadTextFile(doc.name.replace(/\.[^.]+$/, ".txt"), `Trustix document placeholder for ${doc.name}\nCategory: ${doc.category}\nUploaded: ${formatDate(doc.uploadedAt)}`);
    toast.success("Download started");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">Documents</h2>
        <p className="mt-1 text-sm text-muted-foreground">{docs.length} documents stored securely.</p>
      </div>

      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
          dragging ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-border hover:border-brand-300",
        )}
      >
        <Upload className="h-7 w-7 text-brand-600" />
        <p className="mt-2 text-sm font-medium text-foreground">Drag & drop files, or click to browse</p>
        <input type="file" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBox placeholder="Search documents…" onSearch={setQuery} className="sm:flex-1" />
        <Select options={CATEGORIES} value={category} onValueChange={setCategory} className="sm:w-52" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Search className="h-5 w-5" />} title="No documents found" description="Try a different search or category." />
      ) : (
        <div className="space-y-2">
          {filtered.map((doc) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                <File className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.category} · {doc.sizeLabel} · {formatDate(doc.uploadedAt)}</p>
                {uploadProgress[doc.id] !== undefined && (
                  <div className="mt-1.5 h-1 w-full max-w-xs overflow-hidden rounded-full bg-surface-sunken">
                    <motion.div className="h-full rounded-full bg-accent-500" animate={{ width: `${uploadProgress[doc.id]}%` }} />
                  </div>
                )}
              </div>
              <Button size="icon" variant="ghost" aria-label="Rename" onClick={() => openRename(doc)}><Edit2 className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" aria-label="Download" onClick={() => downloadDoc(doc)}><Download className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => deleteDoc(doc.id)}><Trash2 className="h-4 w-4" /></Button>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={renameModal.isOpen} onOpenChange={renameModal.close} title="Rename document" footer={<><Button variant="outline" onClick={renameModal.close}>Cancel</Button><Button onClick={saveRename}>Save</Button></>}>
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </Modal>
    </div>
  );
}
