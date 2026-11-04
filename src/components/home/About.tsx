import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2, Heart, ShieldCheck } from "lucide-react";

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

const stats = [
  { value: "2,500+", label: "Verified Studios" },
  { value: "12k+", label: "Active Creators" },
  { value: "50+", label: "Cities Worldwide" },
  { value: "98%", label: "Satisfaction Rate" },
];

const team = [
  { initials: "AR", name: "Alex Rivera", role: "Co-Founder & CEO", color: "bg-[#E8612C]" },
  { initials: "SK", name: "Sam Kim", role: "Co-Founder & COO", color: "bg-[#25221F]" },
  { initials: "MP", name: "Maya Patel", role: "Head of Design", color: "bg-[#8A7865]" },
  { initials: "JC", name: "Jordan Chen", role: "Head of Community", color: "bg-[#E88A63]" },
];

const AboutPageHome = () => {
  return (
    <div>
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
                  right place to create should be as inspiring as the work
                  itself. We started with a handful of independent studios in
                  New York and a community of creators ready to make something
                  extraordinary.
                </p>
                <p>
                  Today, we connect makers with more than 2,500 verified studios
                  across 50+ cities. From the first spark of an idea to the
                  final take, we make it easier for every creator to find a
                  space that feels like theirs.
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
              To democratize access to creative spaces and empower every maker
              to do their best work.
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
                    <Icon
                      aria-hidden="true"
                      className="h-6 w-6"
                      strokeWidth={1.8}
                    />
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

      <section
        aria-label="StudioSpace by the numbers"
        className="bg-[#242424] px-5 py-8 sm:px-8"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-extrabold text-[#E8612C] sm:text-3xl">
                {value}
              </p>
              <p className="mt-1 text-[10px] font-medium text-gray-300 sm:text-xs">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#FAF8F5] px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-3xl font-bold text-[#25221F]">
              Meet the team
            </h2>
            <p className="mt-2 text-sm text-[#6D6862]">
              The people behind StudioSpace
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {team.map(({ initials, name, role, color }) => (
              <article key={name} className="text-center">
                <div
                  aria-hidden="true"
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-sm font-bold text-white ${color}`}
                >
                  {initials}
                </div>
                <h3 className="mt-3 text-sm font-bold text-[#25221F]">{name}</h3>
                <p className="mt-1 text-xs text-[#E8612C]">{role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-4 mb-8 rounded-2xl bg-[#E8612C] px-6 py-10 text-center text-white sm:mx-8 sm:py-12">
        <h2 className="font-heading text-2xl font-bold">
          Join our creative community
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/90">
          Whether you’re looking for a space or sharing one, we’d love to hear
          from you.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-[#E8612C] transition-colors hover:bg-orange-50"
          >
            Find a Studio <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/add-studio"
            className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/30"
          >
            List Your Space <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPageHome;
