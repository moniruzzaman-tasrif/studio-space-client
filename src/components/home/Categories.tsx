
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Camera, Film, Mic, Music, Palette, PersonStanding } from "lucide-react";

// Define your categories matching your requirements
const categories = [
  {
    name: "Photo Studios",
    catItem: "Photo Studio",
    icon: Camera,
    count: "420 studios",
  },
  {
    name: "Sound Stages",
    catItem: "Film Stage",
    icon: Film,
    count: "156 studios",
  },
  {
    name: "Podcast Rooms",
    catItem: "Podcast Lounge",
    icon: Mic,
    count: "178 studios",
  },
  {
    name: "Music Suites",
    catItem: "Music Suite",
    icon: Music,
    count: "385 studios",
  },
  {
    name: "Art Workshops",
    catItem: "Art Space",
    icon: Palette,
    count: "290 studios",
  },
  {
    name: "Dance",
    catItem: "Dance Studio",
    icon: PersonStanding,
    count: "290 studios",
  },
];

export default function StudioCategories() {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto font-sans">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            Browse by category
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Find the perfect space for your creative vision
          </p>
        </div>
        <Link
          href="/studios"
          className="text-sm font-semibold text-[#E8612C] hover:underline"
        >
          View all &rarr;
        </Link>
      </div>

      {/* Interactive Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map(cat => {
          const IconComponent = cat.icon;
          return (
            <Link
              key={cat.name}
              href={`/catagoris/${encodeURIComponent(cat.catItem)}`}
              className="group"
            >
              <Card className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-[#E8612C]/30 transition-all p-5 flex flex-col items-center text-center cursor-pointer">
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8F3] text-[#E8612C] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Category Name */}
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {cat.name}
                </h3>

                {/* Studio Count */}
                <span className="text-xs text-gray-400 font-medium">
                  {cat.count}
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
