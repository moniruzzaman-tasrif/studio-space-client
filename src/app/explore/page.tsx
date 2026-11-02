"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart,
  LoaderCircle,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { StudioType } from "@/itemType";
import Link from "next/link";

export interface StudioListing extends StudioType {
  _id: string;
  category?: string;
  hourlyRate?: number;
  rating?: number;
  reviewsCount?: number;
  reviewCount?: number;
  isSuperhost?: boolean;
  isFeatured?: boolean;
  amenities?: string[];
}

const CATEGORY_FILTERS = [
  "All Studios",
  "Photography",
  "Music",
  "Art",
  "Dance",
  "Podcast",
  "Film",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStudioListing(value: unknown): StudioListing | null {
  if (!isRecord(value)) {
    return null;
  }

  const id =
    typeof value._id === "string"
      ? value._id
      : typeof value.id === "string"
        ? value.id
        : "";
  const title =
    typeof value.title === "string"
      ? value.title
      : typeof value.name === "string"
        ? value.name
        : "";
  const location =
    typeof value.location === "string"
      ? value.location
      : typeof value.address === "string"
        ? value.address
        : "";

  if (!id || !title || !location) return null;

  const category =
    typeof value.selectedCategory === "string"
      ? value.selectedCategory
      : typeof value.category === "string"
        ? value.category
        : "";
  const hourlyRate =
    typeof value.hourlyRate === "number"
      ? value.hourlyRate
      : typeof value.pricePerHour === "number"
        ? value.pricePerHour
      : typeof value.hourlyRateValue === "string"
        ? Number(value.hourlyRateValue)
        : undefined;
  const imageUrl =
    typeof value.imageUrl === "string"
      ? value.imageUrl
      : typeof value.image === "string"
        ? value.image
        : "";

  return {
    _id: id,
    title,
    selectedCategory: category,
    description: typeof value.description === "string" ? value.description : "",
    hourlyRateValue:
      typeof value.hourlyRateValue === "string"
        ? value.hourlyRateValue
        : hourlyRate === undefined
          ? ""
          : String(hourlyRate),
    securityDepositValue:
      typeof value.securityDepositValue === "string"
        ? value.securityDepositValue
        : typeof value.securityDeposit === "number"
          ? String(value.securityDeposit)
          : "",
    maxCapacityValue:
      typeof value.maxCapacityValue === "string"
        ? value.maxCapacityValue
        : typeof value.maxCapacity === "number"
          ? String(value.maxCapacity)
          : "",
    location,
    imageUrl,
    category,
    hourlyRate,
    rating: typeof value.rating === "number" ? value.rating : undefined,
    reviewsCount:
      typeof value.reviewsCount === "number"
        ? value.reviewsCount
        : typeof value.reviewCount === "number"
          ? value.reviewCount
          : undefined,
    reviewCount:
      typeof value.reviewCount === "number" ? value.reviewCount : undefined,
    isSuperhost:
      typeof value.isSuperhost === "boolean" ? value.isSuperhost : undefined,
    isFeatured:
      typeof value.isFeatured === "boolean"
        ? value.isFeatured
        : typeof value.featured === "boolean"
          ? value.featured
          : undefined,
    amenities: Array.isArray(value.amenities)
      ? value.amenities.filter(
          (amenity): amenity is string => typeof amenity === "string",
        )
      : undefined,
  };
}

function getListings(payload: unknown): StudioListing[] {
  const listings = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.data)
      ? payload.data
      : isRecord(payload) && Array.isArray(payload.studios)
        ? payload.studios
        : null;

  if (!listings) {
    throw new Error("The studios server returned an invalid response.");
  }

  const normalizedListings = listings.map(toStudioListing);
  const validListings = normalizedListings.filter(
    (studio): studio is StudioListing => studio !== null,
  );
  const invalidCount = normalizedListings.length - validListings.length;
  if (invalidCount > 0) {
    console.warn(`Ignored ${invalidCount} invalid studio record(s) from the API.`);
  }
  return validListings;
}

function getStudioCategory(studio: StudioListing): string {
  const category = studio.category ?? studio.selectedCategory ?? "";
  const normalized = category.toLowerCase().replace(/[-_]/g, " ");
  if (normalized.includes("photo")) return "Photography";
  if (normalized.includes("music")) return "Music";
  if (normalized.includes("art")) return "Art";
  if (normalized.includes("dance")) return "Dance";
  if (normalized.includes("podcast")) return "Podcast";
  if (normalized.includes("film") || normalized.includes("sound stage")) {
    return "Film";
  }
  return category;
}

function getHourlyRate(studio: StudioListing): number | null {
  const rate = studio.hourlyRate ?? Number(studio.hourlyRateValue);
  return Number.isFinite(rate) ? rate : null;
}

export default function ExploreStudiosPage() {
  const [studios, setStudios] = useState<StudioListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All Studios");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchStudios() {
      try {
        setLoadError(null);
        const searchParams = new URLSearchParams({ limit: "50" });
        const search = searchQuery.trim();
        if (search) searchParams.set("search", search);
        if (selectedCategory !== "All Studios") {
          searchParams.set("category", selectedCategory);
        }

        const response = await fetch(
          `http://localhost:5000/studios?${searchParams.toString()}`,
          {
          signal: controller.signal,
          },
        );
        if (!response.ok) {
          throw new Error(`The studios API returned ${response.status}.`);
        }

        const payload: unknown = await response.json();
        setStudios(getListings(payload));
      } catch (error) {
        if (controller.signal.aborted) return;

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load studios from the server.";
        console.error("Error fetching studios:", error);
        setLoadError(message);
        toast.error("Could not load studios", {
          description: "Please try again in a moment.",
        });
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    const timeout = window.setTimeout(() => {
      setIsLoading(true);
      void fetchStudios();
    }, searchQuery || selectedCategory !== "All Studios" ? 250 : 0);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery, selectedCategory]);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredStudios = studios.filter((studio) => {
    const category = getStudioCategory(studio).toLowerCase();
    const categorySearchTerm =
      selectedCategory === "Photography" ? "photo" : selectedCategory.toLowerCase();
    const matchesCategory =
      selectedCategory === "All Studios" ||
      category.includes(categorySearchTerm);
    const searchableText = [
      studio.title,
      studio.location,
      getStudioCategory(studio),
      studio.description ?? "",
      ...(studio.amenities ?? []),
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch =
      normalizedSearch === "" || searchableText.includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
  const pageSize = 9;
  const visibleStudios = filteredStudios.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Explore creative studios
          </h1>

          <form
            onSubmit={handleSearch}
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
            {CATEGORY_FILTERS.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "border-foreground bg-foreground text-background shadow-sm"
                      : "border-gray-200 bg-white text-muted-foreground hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing{" "}
            <span className="font-semibold text-foreground">
              {isLoading ? "…" : filteredStudios.length}
            </span>{" "}
            studios available
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <LoaderCircle className="h-6 w-6 animate-spin text-[#E8612C]" />
              Loading workspaces from server...
            </div>
          </div>
        ) : loadError ? (
          <div
            role="alert"
            className="rounded-3xl border border-gray-200 bg-white px-6 py-14 text-center"
          >
            <p className="text-lg font-semibold text-foreground">
              Studios are unavailable right now
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
          </div>
        ) : filteredStudios.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white py-20 text-center">
            <p className="text-lg font-semibold text-foreground">
              No studios found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleStudios.map((studio) => {
              const category = getStudioCategory(studio);
              const hourlyRate = getHourlyRate(studio);
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
                          {hourlyRate === null
                            ? "Price unavailable"
                            : `$${hourlyRate}`}
                        </span>
                        {hourlyRate !== null && (
                          <span className="text-xs font-medium text-muted-foreground">
                            {" "}
                            / hr
                          </span>
                        )}
                        {(studio.reviewsCount ?? studio.reviewCount ?? 0) >
                          0 && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {studio.reviewsCount ?? studio.reviewCount} reviews
                          </p>
                        )}
                      </div>
                      <Link href={`explore/${studio._id}`}>
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
        {!isLoading && !loadError && filteredStudios.length > 0 && (
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
