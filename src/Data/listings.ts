export type ListingStatus = "active" | "draft" | "paused";

export const LISTING_STATUS_META: Record<
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

export const LISTING_FILTERS = ["All", "Active", "Draft", "Paused"] as const;
export type ListingFilter = (typeof LISTING_FILTERS)[number];

