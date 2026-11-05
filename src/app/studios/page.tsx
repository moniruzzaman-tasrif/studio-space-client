import { Suspense } from "react";

import ExploreStudiosClient, {
  type StudioListing,
} from "@/components/explore/ExploreStudiosClient";
import { apiUrl } from "@/lib/utils";
import { BrandedSpinner, StudioGridSkeleton } from "@/components/shared/BrandedLoading";

async function ExploreStudios() {
  const response = await fetch(apiUrl("/studios"), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`The studios API returned ${response.status}.`);
  }

  const studios: StudioListing[] = await response.json();

  return <ExploreStudiosClient studios={studios} />;
}

export default function ExploreStudiosPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-7xl space-y-6">
            <BrandedSpinner label="Loading workspaces from server..." />
            <StudioGridSkeleton />
          </div>
        </main>
      }
    >
      <ExploreStudios />
    </Suspense>
  );
}
