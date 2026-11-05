"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Building2,
  ChevronLeft,
  ChevronRight,
  Heart,
  LoaderCircle,
  MapPin,
  Search,
  SearchX,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { DataType } from "@/itemType";
import { apiUrl } from "@/lib/utils";
import { StudioGridSkeleton } from "@/components/shared/BrandedLoading";
import { notifyError } from "@/lib/notifications";
import { EmptyState } from "@/components/shared/EmptyState";

export type StudioListing = DataType & {
  rating?: number;
  reviewsCount?: number;
  reviewCount?: number;
  isSuperhost?: boolean;
  isFeatured?: boolean;
};

const CATEGORY_FILTERS = [
  { label: "All Studios", value: "" },
  { label: "Photography", value: "Photo Studio" },
  { label: "Music", value: "Music Suite" },
  { label: "Art", value: "Workshop" },
  { label: "Dance", value: "Dance Studio" },
  { label: "Podcast", value: "Podcast Lounge" },
  { label: "Film", value: "Film Stage" },
];

export default function ExploreStudiosClient({
  studios,
}: {
  studios: StudioListing[];
}) {
  const [shownStudios, setShownStudios] = useState(studios);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredStudios = shownStudios.filter((studio) => {
    const searchableText = [
      studio.title,
      studio.location,
      studio.category,
      studio.description ?? "",
      ...(studio.amenities ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return searchableText.includes(normalizedSearch);
  });
  const pageSize = 9;
  const visibleStudios = filteredStudios.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  async function selectCategory(category: string) {
    setCurrentPage(1);

    if (!category) {
      setShownStudios(studios);
      setSelectedCategory("");
      return;
    }

    setLoadingCategory(category);
    try {
      const response = await fetch(
        apiUrl(`/category/${encodeURIComponent(category)}`),
      );

      if (!response.ok) {
        throw new Error(`The category API returned ${response.status}.`);
      }

      const categoryStudios: StudioListing[] = await response.json();
      setShownStudios(categoryStudios);
      setSelectedCategory(category);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load this category.";
      notifyError("Could not load studios.", message);
    } finally {
      setLoadingCategory(null);
    }
  }

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    );
  }

  function clearSearchFilters() {
    setSearchQuery("");
    setShownStudios(studios);
    setSelectedCategory("");
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Explore creative studios
          </h1>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm md:flex-row"
          >
            <div className="relative w-full flex-1">
              <Search
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                aria-label="Search studios"
                placeholder="Search by location, studio name, or feature..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 border-0 bg-transparent pl-10 text-sm focus-visible:ring-0"
              />
            </div>
            <div className="grid w-full grid-cols-3 gap-2 md:w-auto md:flex">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-gray-200 px-3 text-xs sm:px-4 sm:text-sm"
              >
                <CalendarDays className="mr-1.5 h-4 w-4" />
                Any date
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-gray-200 px-3 text-xs sm:px-4 sm:text-sm"
              >
                Price range
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-gray-200 px-3 text-xs sm:px-4 sm:text-sm"
              >
                <SlidersHorizontal className="mr-1.5 h-4 w-4" />
                More filters
              </Button>
            </div>
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-[#E8612C] px-6 font-semibold text-white hover:bg-[#d5521f] md:w-auto"
            >
              Search
            </Button>
          </form>

          <nav
            aria-label="Filter studios by category"
            className="flex items-center gap-2 overflow-x-auto pb-2"
          >
            {CATEGORY_FILTERS.map(({ label, value }) => (
              <button
                type="button"
                key={label}
                disabled={loadingCategory !== null}
                onClick={() => void selectCategory(value)}
                aria-pressed={selectedCategory === value}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                  selectedCategory === value
                    ? "border-foreground bg-foreground text-background shadow-sm"
                    : "border-gray-200 bg-white text-muted-foreground hover:bg-gray-50"
                }`}
              >
                {label}
                {loadingCategory === value && (
                  <LoaderCircle
                    aria-hidden="true"
                    className="h-3.5 w-3.5 animate-spin text-primary"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredStudios.length}
            </span>{" "}
            studios available
          </p>
        </div>

        {loadingCategory !== null ? (
          <div className="space-y-4">
            <p role="status" className="sr-only">
              Loading studios in the selected category...
            </p>
            <StudioGridSkeleton />
          </div>
        ) : filteredStudios.length === 0 ? (
          <EmptyState
            icon={studios.length === 0 ? Building2 : SearchX}
            title={
              studios.length === 0
                ? "No studios available yet"
                : shownStudios.length === 0
                ? "No studios available in this category"
                : "No matching studios"
            }
            description={
              studios.length === 0
                ? "Be the first to share a creative space with the StudioSpace community."
                : shownStudios.length === 0
                ? "Try browsing all studios to find a creative space for your project."
                : "Try another search or clear your filters to see more studios."
            }
            actionLabel={
              studios.length === 0
                ? "List your studio"
                : shownStudios.length === 0
                  ? "Browse all studios"
                  : "Clear filters"
            }
            actionHref={studios.length === 0 ? "/add-studio" : undefined}
            onAction={clearSearchFilters}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleStudios.map((studio) => {
              const category = studio.category;
              const hourlyRate = studio.hourlyRate;
              const isFavorite = favorites.includes(studio._id);
              const isSuperhost = studio.isSuperhost || studio.isFeatured;
              const reviewCount = studio.reviewsCount ?? studio.reviewCount ?? 0;

              return (
                <Card
                  key={studio._id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    {studio.imageUrl ? (
                      <Image
                        src={studio.imageUrl}
                        alt={studio.title}
                        fill
                        unoptimized
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        role="img"
                        aria-label={`${studio.title} image unavailable`}
                        className="h-full w-full bg-gradient-to-br from-orange-100 to-stone-200"
                      />
                    )}

                    {isSuperhost && (
                      <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-foreground shadow-sm backdrop-blur-md">
                        <span aria-hidden="true">⚡</span> Superhost
                      </span>
                    )}

                    <button
                      type="button"
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Save to favorites"
                      }
                      aria-pressed={isFavorite}
                      onClick={() => toggleFavorite(studio._id)}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-foreground shadow-sm transition-all hover:bg-white"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFavorite ? "fill-[#E8612C] text-[#E8612C]" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <CardContent className="flex flex-1 flex-col justify-between space-y-4 p-5">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="line-clamp-1 text-base font-bold text-foreground">
                          {studio.title}
                        </h2>
                        <div
                          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-foreground"
                          aria-label={
                            studio.rating === undefined
                              ? "No rating yet"
                              : `${studio.rating} out of 5 stars, ${reviewCount} reviews`
                          }
                        >
                          <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                          <span>{studio.rating ?? "New"}</span>
                          {reviewCount > 0 && (
                            <span className="font-normal text-muted-foreground">
                              ({reviewCount})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#E8612C]" />
                        <span className="truncate">{studio.location}</span>
                      </div>

                      {category && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <Badge
                            variant="secondary"
                            className="rounded-lg border border-gray-100 bg-[#FAF8F5] text-[11px] font-medium text-muted-foreground"
                          >
                            {category}
                          </Badge>
                          {(studio.amenities ?? []).slice(0, 2).map(amenity => (
                            <Badge
                              key={amenity}
                              variant="secondary"
                              className="rounded-lg border border-gray-100 bg-[#FAF8F5] text-[11px] font-medium text-muted-foreground"
                            >
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <div>
                        <span className="text-lg font-extrabold text-foreground">
                          ${hourlyRate}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {" "}
                          / hr
                        </span>
                        {(studio.reviewsCount ?? studio.reviewCount ?? 0) >
                          0 && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {studio.reviewsCount ?? studio.reviewCount} reviews
                          </p>
                        )}
                      </div>
                      <Link href={`studios/${studio._id}`}>
                        <Button
                          type="button"
                          size="sm"
                          className="h-9 rounded-full bg-[#E8612C] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#d5521f]"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        {filteredStudios.length > 0 && (
          <nav
            aria-label="Studios pages"
            className="flex items-center justify-center gap-1 pb-4"
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="h-9 w-9 rounded-lg border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[1, 2, 3].map((page) => (
              <Button
                key={page}
                type="button"
                variant={page === currentPage ? "default" : "outline"}
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 rounded-lg ${
                  page === currentPage
                    ? "bg-[#E8612C] text-white hover:bg-[#d5521f]"
                    : "border-gray-200"
                }`}
              >
                {page}
              </Button>
            ))}
            <span className="px-2 text-sm text-muted-foreground" aria-hidden="true">
              ...
            </span>
            <Button
              type="button"
              variant={currentPage === 12 ? "default" : "outline"}
              aria-current={currentPage === 12 ? "page" : undefined}
              onClick={() => setCurrentPage(12)}
              className={`h-9 w-9 rounded-lg ${
                currentPage === 12
                  ? "bg-[#E8612C] text-white hover:bg-[#d5521f]"
                  : "border-gray-200"
              }`}
            >
              12
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next page"
              disabled={currentPage === 12}
              onClick={() => setCurrentPage((page) => Math.min(12, page + 1))}
              className="h-9 w-9 rounded-lg border-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        )}
      </div>
    </main>
  );
}
