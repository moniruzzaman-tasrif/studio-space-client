import { Suspense } from "react";

import StudioCategories from "@/components/home/Categories";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import HeroSlider from "@/components/home/Hero";
import AboutPageHome from "@/components/home/About";

export default function Home() {
  return (
    <div>
      <HeroSlider></HeroSlider>
      <StudioCategories></StudioCategories>

      <Suspense
        fallback={
          <section className="mx-auto max-w-7xl px-6 py-12">
            <p className="text-sm text-gray-500">Loading featured studios...</p>
          </section>
        }
      >
        <FeaturedStudios />
      </Suspense>
      <AboutPageHome></AboutPageHome>
    </div>
  );
}
