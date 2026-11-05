import { BrandedSpinner } from "@/components/shared/BrandedLoading";

export default function Loading() {
  return (
    <main className="min-h-[60vh] bg-background px-6">
      <BrandedSpinner label="Loading your next creative space..." />
    </main>
  );
}
