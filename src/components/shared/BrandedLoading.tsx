import { LoaderCircle } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export function BrandedSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-56 flex-col items-center justify-center gap-3 text-center"
    >
      <LoaderCircle
        aria-hidden="true"
        className="h-8 w-8 animate-spin text-primary"
      />
      <span className="text-sm font-semibold text-foreground">StudioSpace</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export function StudioGridSkeleton() {
  return (
    <div
      aria-label="Loading studios"
      aria-busy="true"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-border bg-card p-4"
        >
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          <div className="space-y-3 pt-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-9 w-28 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <main
      aria-label="Loading dashboard"
      aria-busy="true"
      className="min-h-screen bg-background"
    >
      <div className="mx-auto max-w-7xl space-y-9 px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-28 rounded-3xl" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-56 w-full rounded-3xl" />
        </div>
        <BrandedSpinner label="Loading your dashboard..." />
      </div>
    </main>
  );
}

export function StudioDetailSkeleton() {
  return (
    <main
      aria-label="Loading studio details"
      aria-busy="true"
      className="min-h-screen bg-background"
    >
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-12">
        <Skeleton className="h-4 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="aspect-[16/10] rounded-3xl md:col-span-2 md:aspect-auto md:h-[420px]" />
          <Skeleton className="hidden h-[420px] rounded-3xl md:block" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-3xl" />
        </div>
        <BrandedSpinner label="Loading studio details..." />
      </div>
    </main>
  );
}
