import { BrandedSpinner } from "@/components/shared/BrandedLoading";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      aria-label="Loading bookings"
      aria-busy="true"
      className="min-h-screen bg-background p-6"
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-9 w-52" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-3xl" />
          ))}
        </div>
        <BrandedSpinner label="Loading your bookings..." />
      </div>
    </main>
  );
}
