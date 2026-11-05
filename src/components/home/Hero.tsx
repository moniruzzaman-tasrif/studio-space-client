"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { HERO_CONTENT, HERO_SLIDES } from "@/Data";

export default function HeroSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="relative w-full bg-[#FAF8F5] overflow-hidden py-12 md:py-20">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] border border-orange-200/40 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] border border-orange-200/20 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Static Left Text Section */}
          <div className="lg:col-span-6 space-y-6">
            {/* shadcn Badge */}
            <Badge
              variant="outline"
              className="rounded-full bg-orange-100/60 border-orange-200 text-[#E8612C] text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-[#E8612C]" />
              {HERO_CONTENT.badge}
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              {HERO_CONTENT.titlePrefix}{" "}
              <span className="text-[#E8612C] block sm:inline">
                {HERO_CONTENT.titleHighlight}
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              {HERO_CONTENT.subtext}
            </p>

            {/* shadcn Button CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/studios"
                className="flex items-center gap-2 rounded-full bg-[#E8612C] px-7 py-6 text-sm font-semibold text-white shadow-md hover:bg-[#d5521f]"
              >
                Explore Studios
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/studios"
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-6 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                Host Your Space
                <ArrowUpRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>

            {/* Footer Text */}
            <p className="text-xs text-muted-foreground pt-2">
              {HERO_CONTENT.footerText}
            </p>
          </div>

          {/* Right Pure Image Carousel (shadcn/ui Carousel) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <Carousel
              setApi={setApi}
              className="w-full max-w-[540px]"
            >
              <CarouselContent>
                {HERO_SLIDES.map(img => (
                  <CarouselItem key={img.id}>
                    <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-2xl border bg-muted">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        priority={img.id === 1}
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Bottom Controls Bar */}
              <div className="flex items-center justify-between pt-4 px-2">
                {/* Dots indicator */}
                <div className="flex items-center gap-2">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => api?.scrollTo(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        current === idx
                          ? "w-8 bg-[#E8612C]"
                          : "w-2.5 bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* shadcn Navigation Buttons */}
                <div className="relative flex items-center gap-2">
                  <CarouselPrevious className="static translate-y-0 h-9 w-9 bg-white border-gray-200" />
                  <CarouselNext className="static translate-y-0 h-9 w-9 bg-white border-gray-200" />
                </div>
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
