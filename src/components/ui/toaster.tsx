import { Toaster as HotToaster, toast } from "react-hot-toast";

export { toast };

/** Mount once near the root of the app (see App.tsx). */
export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 3800,
        style: {
          background: "var(--surface-raised)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: "0.625rem",
          boxShadow: "var(--shadow-medium)",
          fontSize: "0.875rem",
          padding: "0.75rem 1rem",
        },
        success: {
          iconTheme: { primary: "#10b981", secondary: "#ffffff" },
        },
        error: {
          iconTheme: { primary: "#dc2626", secondary: "#ffffff" },
        },
      }}
    />
  );
}
