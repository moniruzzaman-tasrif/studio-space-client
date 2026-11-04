
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DataType } from "@/itemType";

async function CategoryStudios({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = decodeURIComponent(id);
  const response = await fetch(`http://localhost:5000/category/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load studios (${response.status}).`);
  }

  const studios: DataType[] = await response.json();


  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          {category}
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map(studio => (
            <Link key={studio._id} href={`/explore/${studio._id}`}>
              <Card className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-[16/10] bg-gray-100">
                  {studio.imageUrl && (
                    <Image
                      src={studio.imageUrl}
                      alt={studio.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <CardContent className="space-y-2 p-4">
                  <h2 className="font-bold text-gray-900">{studio.title}</h2>
                  <p className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {studio.location}
                  </p>
                  <p className="text-sm font-semibold text-[#E8612C]">
                    ${studio.hourlyRate} / hour
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function CadagoriDynamic({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FAF8F5] px-6 py-10">
          <div className="mx-auto max-w-7xl text-sm text-gray-500">
            Loading studios...
          </div>
        </main>
      }
    >
      <CategoryStudios params={params} />
    </Suspense>
  );
}
