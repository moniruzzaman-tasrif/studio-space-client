import { Suspense } from "react";

import ExploreStudiosClient, {
  type StudioListing,
} from "@/components/explore/ExploreStudiosClient";

async function ExploreStudios() {
  const response = await fetch("http://localhost:5000/studios", {
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
        <main className="min-h-screen bg-[#FAF8F5] px-4 py-8 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-7xl text-sm text-muted-foreground">
            Loading workspaces from server...
          </div>
        </main>
      }
    >
      <ExploreStudios />
    </Suspense>
  );
}
