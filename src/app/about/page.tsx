import Image from "next/image";
import { Globe2, Heart, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    title: "Community First",
    description:
      "We build for creators. Every feature starts with what's best for our community.",
    icon: Heart,
  },
  {
    title: "Trust & Safety",
    description:
      "Every studio is verified in person. Every booking is protected. Every review is authentic.",
    icon: ShieldCheck,
  },
  {
    title: "Global Access",
    description:
      "We're expanding to every city so an inspiring studio is always within reach.",
    icon: Globe2,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <section
          aria-labelledby="story-heading"
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#E8612C]">
              Our Story
            </p>
            <h1
              id="story-heading"
              className="font-heading text-4xl font-bold leading-[1.12] tracking-tight text-[#25221F] sm:text-5xl lg:text-[3.5rem]"
            >
              We believe every creator deserves an inspiring space
            </h1>
            <div className="mt-7 space-y-4 text-base leading-7 text-[#6D6862] sm:text-lg sm:leading-8">
              <p>
                StudioSpace was born in 2023 with a simple idea: finding the
                right place to create should be as inspiring as the work itself.
                We started with a handful of independent studios in New York
                and a community of creators ready to make something
                extraordinary.
              </p>
              <p>
                Today, we connect makers with more than 2,500 verified studios
                across 50+ cities. From the first spark of an idea to the final
                take, we make it easier for every creator to find a space that
                feels like theirs.
              </p>
            </div>
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-3xl shadow-[0_24px_70px_-32px_rgba(74,49,32,0.4)] sm:min-h-[440px] lg:min-h-[520px]">
            <Image
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=85&w=1600&auto=format&fit=crop"
              alt="Warm, light-filled creative studio loft with an inviting workspace"
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#211a14]/25 via-transparent to-transparent"
            />
          </div>
        </section>

        <section
          aria-labelledby="mission-heading"
          className="mx-auto mt-24 max-w-3xl text-center sm:mt-32"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#E8612C]">
            What guides us
          </p>
          <h2
            id="mission-heading"
            className="font-heading text-3xl font-bold tracking-tight text-[#25221F] sm:text-4xl"
          >
            Our mission
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#6D6862] sm:text-xl">
            To democratize access to creative spaces and empower every maker to
            do their best work.
          </p>
        </section>

        <section
          aria-label="Our core values"
          className="mt-12 grid gap-5 sm:mt-16 md:grid-cols-3 md:gap-6"
        >
          {values.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              className="rounded-3xl border border-[#EEE8E1] bg-white py-0 shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <CardContent className="p-7 sm:p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0E8] text-[#E8612C]">
                  <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#25221F]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#6D6862] sm:text-base sm:leading-7">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}