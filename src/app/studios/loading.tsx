import { BrandedSpinner, StudioGridSkeleton } from "@/components/shared/BrandedLoading";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <BrandedSpinner label="Finding creative studios..." />
        <StudioGridSkeleton />
      </div>
    </main>
  );
}
