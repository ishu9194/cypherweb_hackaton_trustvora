import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { motion } from "framer-motion";
import { File, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedDoc {
  id: string;
  name: string;
  sizeLabel: string;
  progress: number;
}

interface DocumentUploadStepProps {
  files: UploadedDoc[];
  onFilesChange: Dispatch<SetStateAction<UploadedDoc[]>>;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUploadStep({ files, onFilesChange }: DocumentUploadStepProps) {
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (fileList: FileList) => {
      const newDocs: UploadedDoc[] = Array.from(fileList).map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name,
        sizeLabel: formatSize(file.size),
        progress: 0,
      }));
      onFilesChange([...files, ...newDocs]);

      // Simulate an upload progress animation for each new file.
      newDocs.forEach((doc) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20 + Math.random() * 25;
          onFilesChange((prevFiles: UploadedDoc[]) =>
            prevFiles.map((f) => (f.id === doc.id ? { ...f, progress: Math.min(100, progress) } : f)),
          );
          if (progress >= 100) clearInterval(interval);
        }, 250);
      });
    },
    [files, onFilesChange],
  );

  const removeFile = (id: string) => onFilesChange(files.filter((f) => f.id !== id));

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground">Upload documents (optional)</h2>
      <p className="mt-1 text-sm text-muted-foreground">Share anything relevant — contracts, notices, or ID proof. PDF, JPG, or DOCX up to 10MB each.</p>

      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
        className={cn(
          "mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
          dragging ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-border hover:border-brand-300",
        )}
      >
        <Upload className="h-8 w-8 text-brand-600" />
        <p className="mt-3 text-sm font-medium text-foreground">Drag & drop files, or click to browse</p>
        <p className="mt-1 text-xs text-muted-foreground">Maximum 10MB per file</p>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </label>

      {files.length > 0 && (
        <div className="mt-5 space-y-3">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                <File className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
                    <motion.div
                      className="h-full rounded-full bg-accent-500"
                      animate={{ width: `${file.progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{file.sizeLabel}</span>
                </div>
              </div>
              <button type="button" onClick={() => removeFile(file.id)} aria-label={`Remove ${file.name}`} className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-surface-sunken hover:text-danger">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
