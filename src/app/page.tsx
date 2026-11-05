import { Suspense } from "react";

import StudioCategories from "@/components/home/Categories";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import HeroSlider from "@/components/home/Hero";
import AboutPageHome from "@/components/home/About";
import { BrandedSpinner, StudioGridSkeleton } from "@/components/shared/BrandedLoading";

export default function Home() {
  return (
    <div>
      <HeroSlider></HeroSlider>
      <StudioCategories></StudioCategories>
      <Suspense
        fallback={
          <section className="mx-auto max-w-7xl space-y-6 px-6 py-12">
            <BrandedSpinner label="Loading featured studios..." />
            <StudioGridSkeleton />
          </section>
        }
      >
        <FeaturedStudios />
      </Suspense>
      <AboutPageHome></AboutPageHome>
   
    </div>
  );
}
