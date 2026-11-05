import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CircleHelp,
  CreditCard,
  Search,
  Sparkles,
} from "lucide-react";
import {
  CREATOR_ASSURANCES,
  GUEST_STEPS,
  HOST_STEPS,
  HOW_IT_WORKS_QUESTIONS,
} from "@/Data";

export default function HowItWorksPage() {
  return (
    <main className="bg-[#FAF8F5] text-gray-900">
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-[#E8612C]">
            <Sparkles className="h-3.5 w-3.5" />
            Simple. Inspiring. Yours.
          </span>
          <h1 className="mt-5 text-4xl font-serif font-bold tracking-tight sm:text-5xl">
            How StudioSpace works
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Whether you’re booking a space or listing your own, we make it
            effortless.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8612C]">
            <span className="h-px w-8 bg-[#E8612C]/40" />
            For our guests
            <span className="h-px w-8 bg-[#E8612C]/40" />
          </div>
          <h2 className="mt-3 text-2xl font-serif font-bold">
            Book your perfect studio
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUEST_STEPS.map(({ number, title, description, icon: Icon, points }) => (
            <article
              key={number}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8612C] text-white shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-3 flex h-6 w-6 items-center justify-center rounded-full border border-orange-200 text-[10px] font-bold text-[#E8612C]">
                  {number}
                </span>
                <h3 className="mt-3 text-base font-bold">{title}</h3>
                <p className="mt-2 min-h-10 max-w-xs text-xs leading-5 text-gray-500">
                  {description}
                </p>
              </div>
              <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-600">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#E8612C]" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="text-3xl font-serif font-bold">
              Host Guarantee & Creator Support
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Support and safeguards to help creators book and work with
              confidence.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CREATOR_ASSURANCES.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-gray-100 bg-[#FAF8F5] p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-[#E8612C]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-bold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#242424] px-6 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-9 max-w-xl text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8612C]">
              For studio owners
            </span>
            <h2 className="mt-3 text-3xl font-serif font-bold">
              List your space and earn
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Turn your creative space into a source of income. It takes less
              than 10 minutes to get started.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOST_STEPS.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/5 bg-[#303030] p-5 text-center"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8612C]/15 text-[#E8612C]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-bold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-gray-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 rounded-full bg-[#E8612C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d5521f]"
            >
              List your studio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <div className="mb-7 text-center">
          <CircleHelp className="mx-auto h-6 w-6 text-[#E8612C]" />
          <h2 className="mt-3 text-2xl font-serif font-bold">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-xs text-gray-500">
            Everything you need to know about StudioSpace
          </p>
        </div>
        <div className="space-y-2">
          {HOW_IT_WORKS_QUESTIONS.map(({ question, answer }, index) => (
            <details
              key={question}
              open={index === 0}
              className="group rounded-xl border border-gray-200 bg-white px-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold marker:content-none">
                {question}
                <ArrowDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-4 pr-8 text-xs leading-5 text-gray-500">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-4 mb-8 rounded-2xl bg-[#E8612C] px-6 py-10 text-center text-white sm:mx-6 sm:py-12">
        <h2 className="text-2xl font-serif font-bold">Ready to get started?</h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/85">
          Join our community of creatives and studio owners today.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-bold text-[#E8612C] hover:bg-orange-50"
          >
            Find a Studio <Search className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/my-listings"
            className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-xs font-bold text-white hover:bg-white/30"
          >
            List Your Space <CreditCard className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
