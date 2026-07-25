import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

/** Loading placeholder for LawyerProfilePage, shown while the profile "fetch" resolves. */
export function LawyerProfileSkeleton() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900 px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Skeleton className="h-24 w-24 shrink-0 rounded-full ring-4 ring-white/10" />
          <div className="w-full flex-1 space-y-3">
            <Skeleton className="h-5 w-52 bg-white/10" />
            <Skeleton className="h-3.5 w-40 bg-white/10" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-24 rounded-full bg-white/10" />
              <Skeleton className="h-5 w-20 rounded-full bg-white/10" />
              <Skeleton className="h-5 w-28 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Skeleton className="h-9 w-28 rounded-lg bg-white/10" />
            <Skeleton className="h-9 w-9 rounded-lg bg-white/10" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 px-4 sm:px-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <Skeleton className="mb-4 h-4 w-32" />
            <SkeletonText lines={4} />
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <Skeleton className="mb-4 h-4 w-40" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="mt-3 h-7 w-32" />
            <Skeleton className="mt-4 h-9 w-full rounded-lg" />
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <Skeleton className="mb-3 h-3.5 w-28" />
            <SkeletonText lines={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
