import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  MapPin,
  Star,
  Share2,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BookingButton from "@/components/shared/BookingButton";
import { apiUrl } from "@/lib/utils";
import { StudioDetailSkeleton } from "@/components/shared/BrandedLoading";

const StudioDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const res = await fetch(apiUrl(`/studios/${encodeURIComponent(id)}`), {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  // Fallbacks mapped directly from your API data structure
  const title = data.title || data.name || "Studio Workspace";
  const category = data.category || data.selectedCategory || "Music Suite";
  const location = data.location || "Location unavailable";
  const address = data.address || location;
  const mainImage = typeof data.imageUrl === "string" ? data.imageUrl : "";
  const gallery: string[] = Array.isArray(data.gallery)
    ? data.gallery.filter(
        (img: unknown): img is string => typeof img === "string" && img !== "",
      )
    : [];
  const imageGallery =
    gallery.length > 0
      ? gallery
      : mainImage
      ? [mainImage, mainImage, mainImage, mainImage]
      : [];
  const description =
    data.description ||
    "A gorgeous creative studio space equipped with state-of-the-art facilities.";
  const amenities = data.amenities || [];
  const ownerName = data.ownerName || "Moniruzzaman Tasrif";
  const ownerEmail = data.ownerEmail || "";
  const rating = data.rating || 4.9;
  const reviewCount = data.reviewCount || 128;

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-foreground pb-20">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-12 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link href="/studios" className="hover:underline">
            Studios
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground truncate">
            {title}
          </span>
        </div>

        {/* Gallery Grid Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden">
          {/* Main Cover Image */}
          <div
            className={`relative aspect-[16/10] md:aspect-auto md:h-[420px] bg-gray-200 ${
              imageGallery.length > 0 ? "md:col-span-2" : "md:col-span-3"
            }`}
          >
            {mainImage ? (
              <Image
                src={mainImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover"
                priority
              />
            ) : (
              <div
                role="img"
                aria-label={`${title} image unavailable`}
                className="h-full w-full bg-gradient-to-br from-orange-100 to-stone-200"
              />
            )}
          </div>

          {/* Secondary Gallery Grid */}
          {imageGallery.length > 0 && (
            <div className="grid grid-cols-2 gap-4 h-[420px] hidden md:grid">
              {imageGallery.slice(0, 4).map((imgUrl: string, idx: number) => (
                <div
                  key={idx}
                  className="relative bg-gray-200 rounded-2xl overflow-hidden"
                >
                  <Image
                    src={imgUrl}
                    alt={`${title} gallery photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 25vw, 17vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {idx === 3 && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-white text-xs font-bold gap-1">
                      <Sparkles className="w-4 h-4" />
                      <span>+12 photos</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Details & Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start pt-2">
          {/* Left Column: Details, Amenities, Host & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header info */}
            <div className="border-b border-gray-200 pb-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className="bg-[#FAF8F5] border border-gray-200 text-xs font-semibold text-muted-foreground px-3 py-1 rounded-full"
                    >
                      {category}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    {title}
                  </h1>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 border-gray-200 bg-white shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 border-gray-200 bg-white shadow-sm"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1 text-foreground">
                  <MapPin className="w-4 h-4 text-[#E8612C]" />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-1 text-foreground">
                  <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                  <span className="font-bold">{rating}</span>
                  <span>({reviewCount} reviews)</span>
                </div>
                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                  ⚡ Superhost
                </span>
              </div>
            </div>

            {/* About this studio */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">
                About this studio
              </h2>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                {description}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                {amenities.map((amenity: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-sm font-medium text-foreground py-2"
                  >
                    <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center text-[#E8612C]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meet your host */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">
                Meet your host
              </h2>
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-[#E8612C] text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0">
                  {ownerName.slice(0, 2).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground">
                    {ownerName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Superhost since 2022 • Verified Host
                  </p>
                  {ownerEmail && (
                    <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 pt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> {ownerEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                  <span>
                    {rating} • {reviewCount} reviews
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Marcus Kim</span>
                    <span className="text-xs text-muted-foreground">
                      October 2026
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 text-orange-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-orange-500" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Incredible acoustics and professional equipment. The host
                    was super responsive and helpful throughout our session.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Sarah Lee</span>
                    <span className="text-xs text-muted-foreground">
                      September 2026
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 text-orange-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-orange-500" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Best music studio space I&apos;ve used. The mixing console
                    and mics are top-notch and the space is clean.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column: Sticky Booking Widget */}
          <BookingButton data={data}></BookingButton>
        </div>
      </div>
    </main>
  );
};

export default function DetelsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={<StudioDetailSkeleton />}
    >
      <StudioDetails params={params} />
    </Suspense>
  );
}
