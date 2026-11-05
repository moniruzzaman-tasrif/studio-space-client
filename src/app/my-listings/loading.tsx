import { BrandedSpinner } from "@/components/shared/BrandedLoading";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      aria-label="Loading listings"
      aria-busy="true"
      className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:py-12"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <BrandedSpinner label="Loading your studio listings..." />
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 sm:flex-row sm:items-center"
          >
            <Skeleton className="h-44 w-full rounded-2xl sm:h-32 sm:w-48" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
