import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, MapPin, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DataType } from "@/itemType";
import { apiUrl } from "@/lib/utils";

const FeaturedStudios = async () => {
  let studios: DataType[] = [];
  try {
    const response = await fetch(apiUrl("/featured"), {
      cache: "no-store",
    });
    if (response.ok) {
      studios = await response.json();
    }
  } catch (err) {
    console.error("Failed to load featured studios:", err);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 font-sans">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            Featured studios
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Hand-picked spaces loved by our community
          </p>
        </div>
        <Link
          href="/studios"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#E8612C] hover:underline"
        >
          See all studios <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <Card
            key={studio._id}
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-[#FAF8F5] py-0 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
              {studio.imageUrl && (
                <Image
                  src={studio.imageUrl}
                  alt={studio.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <span
                aria-hidden="true"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm"
              >
                <Heart className="h-4 w-4" />
              </span>
            </div>

            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-1 text-sm font-bold text-gray-900">
                  {studio.title}
                </h3>
                <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-gray-700">
                  <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                  New
                </span>
              </div>

              <p className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{studio.location}</span>
              </p>

              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-gray-500">
                  {studio.category}
                </span>
                {studio.amenities.slice(0, 1).map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-white px-2.5 py-1 text-[11px] text-gray-500"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-200/70 pt-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    ${studio.hourlyRate}
                    <span className="font-normal text-gray-500"> /hour</span>
                  </p>
                  <span className="text-[11px] text-gray-500">
                    Up to {studio.maxCapacity} guests
                  </span>
                </div>
                <Link
                  href={`/studios/${studio._id}`}
                  className="inline-flex items-center gap-1 rounded-full bg-[#E8612C] px-4 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#d5521f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8612C]"
                >
                  View Details <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedStudios;
