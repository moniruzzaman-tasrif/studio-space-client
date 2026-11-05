import { Suspense } from "react";

import ExploreStudiosClient, {
  type StudioListing,
} from "@/components/explore/ExploreStudiosClient";
import { apiUrl } from "@/lib/utils";
import { CATEGORY_FILTERS } from "@/Data";
import { BrandedSpinner, StudioGridSkeleton } from "@/components/shared/BrandedLoading";

const KNOWN_CATEGORIES = CATEGORY_FILTERS.map(({ value }) => value).filter(
  (value) => value !== "",
);

async function ExploreStudios({ category }: { category: string }) {
  let studios: StudioListing[] = [];
  let categoryStudiosList: StudioListing[] | null = null;

  try {
    const res = await fetch(apiUrl("/studios"), { cache: "no-store" });
    if (res.ok) {
      studios = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch all studios:", err);
  }

  if (category) {
    try {
      const catRes = await fetch(apiUrl(`/category/${encodeURIComponent(category)}`), {
        cache: "no-store",
      });
      if (catRes.ok) {
        categoryStudiosList = await catRes.json();
      }
    } catch (err) {
      console.error("Failed to fetch category studios:", err);
    }
  }

  return (
    <ExploreStudiosClient
      studios={studios}
      initialCategory={category}
      initialStudios={categoryStudiosList ?? studios}
    />
  );
}

export default async function ExploreStudiosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const requestedCategory =
    typeof category === "string" && KNOWN_CATEGORIES.includes(category.trim())
      ? category.trim()
      : "";

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
      <ExploreStudios category={requestedCategory} />
    </Suspense>
  );
}
