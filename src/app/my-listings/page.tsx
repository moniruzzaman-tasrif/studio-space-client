"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  LoaderCircle,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { getClientToken } from "@/lib/tokenClint";
import {
  EditStudioDialog,
  type EditableStudio,
} from "@/components/studios/EditStudioDialog";
import { apiUrl } from "@/lib/utils";

const STUDIOS_API = apiUrl("/studios");

type ListingStatus = "active" | "draft" | "paused";

type StudioListing = EditableStudio & {
  rating: number;
  reviewCount: number;
  bookings: number;
  status: ListingStatus;
};

const STATUS_META: Record<
  ListingStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
  draft: {
    label: "Draft",
    className: "border-amber-100 bg-amber-50 text-amber-700",
  },
  paused: {
    label: "Paused",
    className: "border-gray-200 bg-gray-100 text-gray-600",
  },
};

const FILTERS = ["All", "Active", "Draft", "Paused"] as const;
type Filter = (typeof FILTERS)[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function asStatus(value: unknown): ListingStatus {
  const status = asString(value).toLowerCase();
  return status === "draft" || status === "paused" ? status : "active";
}

function normalizeCategory(value: unknown): string {
  const category = asString(value);
  const normalized = category.toLowerCase().replace(/[-_]/g, " ");
  if (normalized.includes("photo")) return "Photo Studio";
  if (normalized.includes("music")) return "Music Suite";
  if (normalized.includes("art")) return "Art Space";
  if (normalized.includes("dance")) return "Dance Studio";
  if (normalized.includes("podcast")) return "Podcast Lounge";
  if (normalized.includes("film") || normalized.includes("sound stage")) {
    return "Film Stage";
  }
  return category;
}

function toListing(value: unknown): StudioListing | null {
  if (!isRecord(value)) return null;

  const id = asString(value._id) || asString(value.id);
  const title = asString(value.title) || asString(value.name);
  if (!id || !title) return null;

  const gallery = Array.isArray(value.gallery) ? value.gallery : [];
  const imageUrl =
    asString(value.imageUrl) ||
    asString(value.image) ||
    asString(gallery[0]);

  return {
    id,
    title,
    category: normalizeCategory(
      asString(value.category) || asString(value.selectedCategory),
    ),
    location: asString(value.location) || asString(value.address),
    imageUrl,
    hourlyRate:
      asNumber(value.hourlyRate) ?? asNumber(value.pricePerHour),
    securityDeposit:
      asNumber(value.securityDepositValue) ??
      asNumber(value.securityDeposit),
    maxCapacity:
      asNumber(value.maxCapacityValue) ?? asNumber(value.maxCapacity),
    description: asString(value.description),
    amenities: Array.isArray(value.amenities)
      ? value.amenities.filter(
          (amenity): amenity is string => typeof amenity === "string",
        )
      : [],
    rating: asNumber(value.rating) ?? 0,
    reviewCount:
      asNumber(value.reviewCount) ?? asNumber(value.reviewsCount) ?? 0,
    bookings:
      asNumber(value.bookings) ?? asNumber(value.totalBookings) ?? 0,
    status: asStatus(value.status),
  };
}

function getListings(payload: unknown): StudioListing[] {
  const records = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.data)
      ? payload.data
      : isRecord(payload) && Array.isArray(payload.studios)
        ? payload.studios
        : null;

  if (!records) {
    throw new Error("The studios server returned an unexpected response.");
  }

  return records
    .map(toListing)
    .filter((listing): listing is StudioListing => listing !== null);
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<StudioListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [listingToEdit, setListingToEdit] =
    useState<StudioListing | null>(null);
  const [listingToDelete, setListingToDelete] =
    useState<StudioListing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchListings = useCallback(async (signal?: AbortSignal) => {
    try {
      const token = await getClientToken();
      const response = await fetch(STUDIOS_API, {
        signal,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`The studios API returned ${response.status}.`);
      }

      const payload: unknown = await response.json();
      setListings(getListings(payload));
    } catch (error) {
      if (signal?.aborted) return;

      const message =
        error instanceof Error
          ? error.message
          : "Unable to load your studios right now.";
      setLoadError(message);
      notifyError("Could not load listings.", message);
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      void fetchListings(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [fetchListings]);

  function handleRetry() {
    setIsLoading(true);
    setLoadError(null);
    void fetchListings();
  }

  const counts = useMemo(
    () => ({
      All: listings.length,
      Active: listings.filter((listing) => listing.status === "active").length,
      Draft: listings.filter((listing) => listing.status === "draft").length,
      Paused: listings.filter((listing) => listing.status === "paused").length,
    }),
    [listings],
  );

  const visibleListings = useMemo(
    () =>
      filter === "All"
        ? listings
        : listings.filter(
            (listing) => listing.status === filter.toLowerCase(),
          ),
    [filter, listings],
  );

  function handleEdit(listing: StudioListing) {
    setListingToEdit(listing);
  }

  function handleListingSaved(updatedListing: EditableStudio) {
    setListings((current) =>
      current.map((item) =>
        item.id === updatedListing.id
          ? { ...item, ...updatedListing }
          : item,
      ),
    );
    setListingToEdit(null);
  }

  function handleStatusChange(listing: StudioListing) {
    setListings((current) =>
      current.map((item) =>
        item.id === listing.id ? { ...item, status: "active" } : item,
      ),
    );

    notifySuccess(
      listing.status === "draft" ? "Studio published successfully" : "Studio reactivated",
      `"${listing.title}" is now active.`,
    );
  }

  async function handleConfirmDelete() {
    if (!listingToDelete || isDeleting) return;

    const listing = listingToDelete;
    setIsDeleting(true);

    try {
      const token = await getClientToken();
      const response = await fetch(`${STUDIOS_API}/${listing.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`The studios API returned ${response.status}.`);
      }

      setListings((current) =>
        current.filter((item) => item.id !== listing.id),
      );
      setListingToDelete(null);
      notifySuccess(
        "Studio deleted successfully.",
        `"${listing.title}" was removed from your listings.`,
      );
    } catch (error) {
      notifyError(
        "Could not delete studio.",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E8612C]">
              Your creative spaces
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              My Listings
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your studio spaces
            </p>
          </div>

          <Button
            render={<Link href="/add-studio" />}
            className="h-11 w-full gap-2 rounded-full bg-[#E8612C] px-5 font-semibold text-white shadow-sm hover:bg-[#d5521f] sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add New Studio
          </Button>
        </div>

        {/* Status filter tabs */}
        <div
          role="tablist"
          aria-label="Filter listings by status"
          className="flex flex-wrap items-center gap-2"
        >
          {FILTERS.map((item) => {
            const isActive = filter === item;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(item)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8612C] focus-visible:ring-offset-2",
                  isActive
                    ? "border-[#E8612C] bg-[#E8612C] text-white shadow-sm"
                    : "border-gray-200 bg-white text-muted-foreground hover:bg-gray-50 hover:text-foreground",
                )}
              >
                {item}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600",
                  )}
                >
                  {counts[item]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4" aria-label="Loading listings">
            {[0, 1, 2].map((key) => (
              <div
                key={key}
                className="flex flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center"
              >
                <div className="h-44 w-full animate-pulse rounded-2xl bg-gray-100 sm:h-32 sm:w-48" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-56 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div
            role="alert"
            className="flex flex-col items-center rounded-3xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm"
          >
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertCircle className="h-6 w-6" />
            </span>
            <h2 className="text-lg font-bold text-foreground">
              We couldn&apos;t load your listings
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {loadError}
            </p>
            <Button
              type="button"
              onClick={handleRetry}
              className="mt-5 h-10 rounded-full bg-[#E8612C] px-5 font-semibold text-white hover:bg-[#d5521f]"
            >
              Try again
            </Button>
          </div>
        ) : visibleListings.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#E8612C]">
              <Building2 className="h-7 w-7" />
            </span>
            <h2 className="text-lg font-bold text-foreground">
              {listings.length === 0
                ? "No listings yet"
                : `No ${filter.toLowerCase()} listings`}
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {listings.length === 0
                ? "Publish your first studio listing to start welcoming creative teams."
                : "Try a different status filter to see your studios."}
            </p>
            {listings.length === 0 && (
              <Button
                render={<Link href="/add-studio" />}
                className="mt-5 h-10 gap-2 rounded-full bg-[#E8612C] px-5 font-semibold text-white hover:bg-[#d5521f]"
              >
                <Plus className="h-4 w-4" />
                Add New Studio
              </Button>
            )}
            {listings.length > 0 && (
              <Button
                type="button"
                onClick={() => setFilter("All")}
                variant="outline"
                className="mt-5 h-10 rounded-full border-border px-5 font-semibold"
              >
                Show all listings
              </Button>
            )}
          </div>
        ) : (
          <ul className="space-y-4">
            {visibleListings.map((listing, index) => {
              const statusMeta = STATUS_META[listing.status];
              return (
                <li key={listing.id}>
                  <Card className="rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
                    <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                      {/* Thumbnail */}
                      <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-32 sm:w-48">
                        {listing.imageUrl ? (
                          <Image
                            src={listing.imageUrl}
                            alt={listing.title}
                            fill
                            unoptimized
                            loading={index === 0 ? "eager" : "lazy"}
                            sizes="(max-width: 640px) 100vw, 192px"
                            className="object-cover"
                          />
                        ) : (
                          <div
                            role="img"
                            aria-label={`${listing.title} has no photo`}
                            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 to-stone-200 text-[#E8612C]"
                          >
                            <Building2 className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-lg font-bold text-foreground">
                            {listing.title}
                          </h2>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                              statusMeta.className,
                            )}
                          >
                            {statusMeta.label}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#E8612C]" />
                            <span className="truncate">
                              {listing.location || "Location not provided"}
                            </span>
                          </span>
                          <span className="text-muted-foreground/60">•</span>
                          <span>{listing.category}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                          <span className="text-base font-extrabold text-foreground">
                            {listing.hourlyRate === null
                              ? "Price not set"
                              : `$${listing.hourlyRate}/hr`}
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                            <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                            {listing.rating > 0 ? listing.rating : "New"}
                            <span className="font-normal text-muted-foreground">
                              ({listing.reviewCount}{" "}
                              {listing.reviewCount === 1 ? "review" : "reviews"})
                            </span>
                          </span>
                          {listing.status === "active" && (
                            <span className="text-muted-foreground">
                              {listing.bookings}{" "}
                              {listing.bookings === 1 ? "booking" : "bookings"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 sm:w-auto sm:flex-col sm:items-stretch">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleEdit(listing)}
                          className="h-9 gap-1.5 rounded-full border-gray-200 bg-white px-4 text-xs font-semibold hover:bg-gray-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>

                        {listing.status !== "active" && (
                          <Button
                            type="button"
                            onClick={() => handleStatusChange(listing)}
                            className="h-9 gap-1.5 rounded-full bg-[#E8612C] px-4 text-xs font-semibold text-white hover:bg-[#d5521f]"
                          >
                            {listing.status === "draft" ? "Publish" : "Reactivate"}
                          </Button>
                        )}

                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => setListingToDelete(listing)}
                          className="h-9 gap-1.5 rounded-full bg-red-50 px-4 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <EditStudioDialog
        key={listingToEdit?.id ?? "closed"}
        studio={listingToEdit}
        onOpenChange={(open) => {
          if (!open) setListingToEdit(null);
        }}
        onSaved={handleListingSaved}
      />

      {/* Delete confirmation modal */}
      <Dialog
        open={Boolean(listingToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setListingToDelete(null);
        }}
      >
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <span className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </span>
            <DialogTitle className="text-lg font-bold">
              Delete studio listing?
            </DialogTitle>
            <DialogDescription className="leading-relaxed">
              {listingToDelete
                ? `Are you sure you want to delete "${listingToDelete.title}"? This action will permanently remove the document from MongoDB and cannot be undone.`
                : "This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-1">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setListingToDelete(null)}
              className="h-10 rounded-full border-gray-200 px-5"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void handleConfirmDelete()}
              className="h-10 gap-2 rounded-full bg-red-600 px-5 font-semibold text-white hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Confirm Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
