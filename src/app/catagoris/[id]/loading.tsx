import { BrandedSpinner, StudioGridSkeleton } from "@/components/shared/BrandedLoading";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <BrandedSpinner label="Loading studios in this category..." />
        <StudioGridSkeleton />
      </div>
    </main>
  );
}
