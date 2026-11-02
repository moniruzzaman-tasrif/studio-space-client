import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AirVent,
  ArrowLeft,
  Bath,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Coffee,
  Heart,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  Music2,
  ParkingCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wifi,
} from "lucide-react";

// path to your Better Auth server instance
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const instant = false;

type StudioReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function getCategory(value: unknown): string {
  const category = asString(value);
  const normalized = category.toLowerCase().replace(/[-_]/g, " ");
  if (normalized.includes("photo")) return "Photography";
  if (normalized.includes("music")) return "Music";
  if (normalized.includes("art")) return "Art";
  if (normalized.includes("dance")) return "Dance";
  if (normalized.includes("podcast")) return "Podcast";
  if (normalized.includes("film") || normalized.includes("sound stage")) return "Film";
  return category || "Creative studio";
}

function getAmenityIcon(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("wifi") || normalized.includes("wi-fi") || normalized.includes("internet")) return Wifi;
  if (normalized.includes("parking")) return ParkingCircle;
  if (normalized.includes("light") || normalized.includes("window") || normalized.includes("natural")) return Sparkles;
  if (normalized.includes("coffee")) return Coffee;
  if (normalized.includes("bath") || normalized.includes("restroom") || normalized.includes("toilet")) return Bath;
  if (normalized.includes("air conditioning") || normalized.includes("vent")) return AirVent;
  if (normalized.includes("sound") || normalized.includes("music") || normalized.includes("microphone")) return Music2;
  return Check;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "H";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function getReviews(value: unknown): StudioReview[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((review, index) => {
    if (!isRecord(review)) return [];
    const comment = asString(review.comment) || asString(review.text);
    const rating = asNumber(review.rating) ?? asNumber(review.stars);
    if (!comment || rating === null) return [];
    return [{
      id: asString(review._id) || asString(review.id) || `review-${index}`,
      name: asString(review.userName) || asString(review.name) || "Studio guest",
      rating: Math.min(5, Math.max(0, rating)),
      comment,
      date: asString(review.createdAt) || asString(review.date),
    }];
  });
}

const DetelsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const res = await fetch(`http://localhost:5000/studios/${slug}`);
  const data: unknown = await res.json();
  console.log(data);

  if (res.status === 404) notFound();
  if (!res.ok) {
    throw new Error(`Unable to load studio details (${res.status}).`);
  }
  if (!isRecord(data)) notFound();

  const title = asString(data.title) || asString(data.name) || "Creative studio";
  const category = getCategory(data.category ?? data.selectedCategory);
  const location = asString(data.location);
  const address = asString(data.address);
  const hourlyRate =
    asNumber(data.hourlyRate) ??
    asNumber(data.pricePerHour) ??
    asNumber(data.hourlyRateValue);
  const securityDeposit = asNumber(data.securityDeposit);
  const capacity =
    asNumber(data.maxCapacity) ??
    asNumber(data.capacity) ??
    asNumber(data.maxCapacityValue);
  const ratingValue = asNumber(data.rating);
  const rating = ratingValue !== null && ratingValue > 0 ? ratingValue : null;
  const reviews = getReviews(data.reviews);
  const reviewCount =
    asNumber(data.reviewCount) ??
    asNumber(data.reviewsCount) ??
    reviews.length;
  const imageUrls = [
    data.image,
    data.imageUrl,
    ...(Array.isArray(data.gallery) ? data.gallery : []),
  ]
    .map(asString)
    .filter((url, index, urls) => {
      if (!url || !/^https?:\/\//i.test(url)) return false;
      return urls.indexOf(url) === index;
    });
  const imageAlt = asString(data.imageAlt) || `${title} creative studio`;
  const amenities = Array.isArray(data.amenities)
    ? [...new Set(data.amenities.map(asString).filter(Boolean))]
    : [];
  const description = asString(data.description);
  const ownerName =
    asString(data.ownerName) ||
    asString(data.userName) ||
    (isRecord(data.host) ? asString(data.host.name) : "");
  const isSuperhost = data.isSuperhost === true;
  const isVerified = data.isVerified === true;
  const serviceFee = asNumber(data.serviceFee);
  const cleaningFee = asNumber(data.cleaningFee);
  const estimatedHours = 4;
  const subtotal = hourlyRate === null ? null : hourlyRate * estimatedHours;
  const estimatedTotal =
    subtotal === null ? null : subtotal + (serviceFee ?? 0) + (cleaningFee ?? 0);
  const uniqueAddress = [location, address]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-7 sm:px-8 sm:pt-9 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#6D6862] transition-colors hover:text-[#E8612C]">
            Home
          </Link>
          <ChevronRight aria-hidden="true" className="h-4 w-4 text-[#B9B0A8]" />
          <Link href="/explore" className="text-[#6D6862] transition-colors hover:text-[#E8612C]">
            Studios
          </Link>
          <ChevronRight aria-hidden="true" className="h-4 w-4 text-[#B9B0A8]" />
          <span className="max-w-[45vw] truncate font-medium text-[#25221F]" aria-current="page">
            {title}
          </span>
        </nav>

        <section
          aria-label="Studio photo gallery"
          className="relative grid grid-cols-2 gap-2 overflow-hidden rounded-3xl sm:gap-3 md:grid-cols-4 md:grid-rows-2"
        >
          <div className="relative col-span-2 row-span-2 min-h-[260px] overflow-hidden bg-[#E9E1D8] md:min-h-[440px]">
            {imageUrls[0] ? (
              <Image
                src={imageUrls[0]}
                alt={imageAlt}
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[260px] items-center justify-center text-[#9A8B7B]">
                <ImageIcon aria-hidden="true" className="h-10 w-10" />
              </div>
            )}
          </div>
          {[1, 2, 3, 4].map((imageIndex) => {
            const imageUrl = imageUrls[imageIndex];
            return (
              <div
                key={imageUrl ?? `photo-${imageIndex}`}
                className="relative hidden min-h-[140px] overflow-hidden bg-[#E9E1D8] md:block"
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`${title} studio photo ${imageIndex + 1}`}
                    fill
                    unoptimized
                    sizes="25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[140px] items-center justify-center text-[#AD9F91]">
                    <ImageIcon aria-hidden="true" className="h-6 w-6" />
                  </div>
                )}
              </div>
            );
          })}
          {imageUrls.length > 1 && (
            <details className="absolute bottom-4 right-4 z-10">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#25221F] shadow-sm hover:bg-white [&::-webkit-details-marker]:hidden">
                <ImageIcon className="h-4 w-4" />
                Show all {imageUrls.length} photos
              </summary>
              <div className="absolute bottom-14 right-0 z-20 grid max-h-[70vh] w-[min(90vw,720px)] grid-cols-1 gap-3 overflow-y-auto rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl sm:grid-cols-2">
                {imageUrls.map((imageUrl, index) => (
                  <div key={imageUrl} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#E9E1D8]">
                    <Image
                      src={imageUrl}
                      alt={index === 0 ? imageAlt : `${title} studio photo ${index + 1}`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 90vw, 360px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </details>
          )}
        </section>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div className="min-w-0">
            <section className="border-b border-[#E8E1DA] pb-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-[#C94D20] hover:bg-orange-50">
                  {category}
                </Badge>
                {isSuperhost && (
                  <Badge className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-[#4E4944] hover:bg-white">
                    Superhost
                  </Badge>
                )}
                {isVerified && (
                  <Badge className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h1 className="font-heading text-3xl font-bold tracking-tight text-[#25221F] sm:text-4xl">
                    {title}
                  </h1>
                  {uniqueAddress && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-[#6D6862]">
                      <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-[#E8612C]" />
                      {uniqueAddress}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <Star aria-hidden="true" className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-[#25221F]">{rating?.toFixed(1) ?? "New"}</span>
                    <span className="text-[#8A837C]">
                      {reviewCount > 0
                        ? `· ${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`
                        : "· No reviews yet"}
                    </span>
                    {capacity !== null && (
                      <>
                        <span className="text-[#C7BEB5]">·</span>
                        <span className="inline-flex items-center gap-1 text-[#6D6862]">
                          <Users aria-hidden="true" className="h-4 w-4" />
                          Up to {capacity} guests
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-gray-200 bg-white"
                    aria-label="Share this studio"
                  >
                    <Share2 className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-gray-200 bg-white"
                    aria-label="Save this studio"
                  >
                    <Heart className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                </div>
              </div>
            </section>

            <section className="border-b border-[#E8E1DA] py-8">
              <h2 className="font-heading text-xl font-bold text-[#25221F]">
                About this studio
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6D6862] sm:text-base">
                {description || "The host hasn’t added a studio description yet."}
              </p>
            </section>

            <section className="border-b border-[#E8E1DA] py-8">
              <h2 className="font-heading text-xl font-bold text-[#25221F]">Amenities</h2>
              {amenities.length > 0 ? (
                <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {amenities.map((amenity) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <li key={amenity} className="flex items-center gap-3 text-sm text-[#4E4944]">
                        <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#E8612C]" />
                        {amenity}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-[#8A837C]">Amenities haven&apos;t been listed yet.</p>
              )}
            </section>

            <section className="border-b border-[#E8E1DA] py-8">
              <h2 className="font-heading text-xl font-bold text-[#25221F]">Meet your host</h2>
              <Card className="mt-5 rounded-3xl border border-gray-200 bg-white py-0 shadow-sm">
                <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FFF0E8] text-lg font-bold text-[#E8612C]">
                      {getInitials(ownerName)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#25221F]">{ownerName || "StudioSpace host"}</p>
                      <p className="mt-1 text-sm text-[#8A837C]">
                        {isSuperhost ? "Superhost" : "Host on StudioSpace"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-[#6D6862] sm:gap-6">
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-[#E8612C]" />
                      {session?.user ? "Contact your host through StudioSpace" : "Sign in to contact your host"}
                    </span>
                    {isVerified && (
                      <span className="inline-flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Identity verified
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="py-8">
              <h2 className="font-heading text-xl font-bold text-[#25221F]">Reviews</h2>
              {rating !== null && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                  <div>
                    <p className="font-bold text-[#25221F]">{rating.toFixed(1)} out of 5</p>
                    <p className="text-xs text-[#6D6862]">
                      Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>
              )}
              {reviews.length ? (
                <div className="mt-5 grid gap-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="rounded-2xl border-gray-200 bg-white py-0 shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-[#25221F]">{review.name}</p>
                            {review.date && (
                              <p className="mt-1 text-xs text-[#8A837C]">{formatDate(review.date)}</p>
                            )}
                          </div>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#25221F]">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-[#6D6862]">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-[#8A837C]">
                  {reviewCount > 0
                    ? `${reviewCount} reviews are available, but individual review details were not returned by the studio service.`
                    : "This studio hasn’t received a review yet."}
                </p>
              )}
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <Card className="rounded-3xl border border-gray-200 bg-white py-0 shadow-[0_16px_50px_-24px_rgba(54,39,28,0.28)]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-2xl font-bold tracking-tight text-[#25221F]">
                    {hourlyRate === null ? "Price unavailable" : formatCurrency(hourlyRate)}
                    {hourlyRate !== null && (
                      <span className="ml-1 text-sm font-normal text-[#6D6862]">/ hour</span>
                    )}
                  </p>
                  {rating !== null && (
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-[#25221F]">{rating.toFixed(1)}</span>
                    </span>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <label className="rounded-2xl border border-gray-200 p-3">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#8A837C]">Date</span>
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 shrink-0 text-[#E8612C]" />
                      <input
                        type="date"
                        aria-label="Booking date"
                        className="min-w-0 w-full bg-transparent text-xs font-medium text-[#25221F] outline-none"
                      />
                    </span>
                  </label>
                  <label className="rounded-2xl border border-gray-200 p-3">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#8A837C]">Duration</span>
                    <span className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 shrink-0 text-[#E8612C]" />
                      <select
                        defaultValue={estimatedHours}
                        aria-label="Booking duration"
                        className="min-w-0 w-full bg-transparent text-xs font-medium text-[#25221F] outline-none"
                      >
                        {Array.from({ length: 12 }, (_, index) => index + 1).map((hours) => (
                          <option key={hours} value={hours}>
                            {hours} {hours === 1 ? "hour" : "hours"}
                          </option>
                        ))}
                      </select>
                    </span>
                  </label>
                  <label className="rounded-2xl border border-gray-200 p-3">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#8A837C]">Start time</span>
                    <select
                      defaultValue="10:00"
                      aria-label="Booking start time"
                      className="w-full bg-transparent text-xs font-medium text-[#25221F] outline-none"
                    >
                      {Array.from({ length: 24 }, (_, index) => {
                        const hour = Math.floor(index / 2) + 7;
                        const minute = index % 2 ? "30" : "00";
                        const value = `${String(hour).padStart(2, "0")}:${minute}`;
                        return (
                          <option key={value} value={value}>
                            {new Intl.DateTimeFormat("en", {
                              hour: "numeric",
                              minute: "2-digit",
                            }).format(new Date(2000, 0, 1, hour, Number(minute)))}
                          </option>
                        );
                      })}
                    </select>
                  </label>
                  <div className="rounded-2xl border border-gray-200 p-3">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#8A837C]">Capacity</span>
                    <span className="flex items-center gap-2 text-xs font-medium text-[#25221F]">
                      <Users className="h-4 w-4 shrink-0 text-[#E8612C]" />
                      {capacity === null ? "Not specified" : `${capacity} guests max`}
                    </span>
                  </div>
                </div>

                <details className="group mt-5">
                  <summary className="flex h-12 cursor-pointer list-none items-center justify-center rounded-full bg-[#E8612C] px-4 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#d5521f] [&::-webkit-details-marker]:hidden">
                    Book Workspace Now
                  </summary>
                  <div className="mt-3 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm">
                    <p className="font-semibold text-[#25221F]">Booking preview</p>
                    <p className="mt-1 leading-6 text-[#6D6862]">
                      Select a date and duration above. Booking requests and payments are not enabled for this listing yet.
                    </p>
                    {!session?.user && (
                      <Link href="/sign-in" className="mt-3 inline-flex font-semibold text-[#E8612C] hover:text-[#d5521f]">
                        Sign in to continue
                      </Link>
                    )}
                  </div>
                </details>
                <p className="mt-2 text-center text-xs text-[#8A837C]">No payment is taken at this step.</p>

                <div className="my-5 border-t border-dashed border-gray-200" />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3 text-[#6D6862]">
                    <span>{hourlyRate === null ? "Studio subtotal" : `${formatCurrency(hourlyRate)} × ${estimatedHours} hours`}</span>
                    <span>{subtotal === null ? "—" : formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-[#6D6862]">
                    <span>Service fee</span>
                    <span>{serviceFee === null ? "Calculated at checkout" : formatCurrency(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-[#6D6862]">
                    <span>Cleaning fee</span>
                    <span>{cleaningFee === null ? "Not provided" : formatCurrency(cleaningFee)}</span>
                  </div>
                  {securityDeposit !== null && securityDeposit > 0 && (
                    <div className="flex justify-between gap-3 text-[#6D6862]">
                      <span>Security deposit</span>
                      <span>{formatCurrency(securityDeposit)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-100 pt-3 font-bold text-[#25221F]">
                    <span>Estimated total</span>
                    <span>{estimatedTotal === null ? "—" : formatCurrency(estimatedTotal)}</span>
                  </div>
                </div>
                <p className="mt-4 flex items-start gap-2 rounded-2xl bg-[#FAF8F5] p-3 text-xs leading-5 text-[#6D6862]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#E8612C]" />
                  {securityDeposit
                    ? "The security deposit is listed separately and may be refundable."
                    : "Free cancellation up to 24 hours before your booking."}
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>

        <div className="mt-8">
          <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-semibold text-[#E8612C] hover:text-[#d5521f]">
            <ArrowLeft className="h-4 w-4" />
            Back to studios
          </Link>
        </div>
      </div>
    </main>
  );
};

export default DetelsPage;
