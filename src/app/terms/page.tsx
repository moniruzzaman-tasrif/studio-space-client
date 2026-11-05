import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The rules that govern using StudioSpace as a guest or host.",
};

const sections = [
  {
    title: "Accepting these terms",
    body: [
      "These terms apply when you browse StudioSpace, create an account, publish a listing, or request a booking.",
      "You must be at least 18 years old and able to enter into a binding agreement to use the marketplace.",
      "If you use StudioSpace on behalf of an organisation, you confirm that you have authority to bind that organisation.",
    ],
  },
  {
    title: "Your account",
    body: [
      "You are responsible for keeping your sign-in credentials confidential and for all activity under your account.",
      "Provide accurate information when you register, and keep your contact details current so hosts and guests can reach you.",
      "Tell us promptly if you believe your account has been accessed without your permission.",
    ],
  },
  {
    title: "Host obligations",
    body: [
      "Listings must be accurate, describe a real bookable space, and reflect the amenities, pricing, and capacity of the studio.",
      "Keep your availability current and respond to booking requests in a timely manner.",
      "Comply with local laws, permits, insurance, and safety requirements for the space you list.",
      "Provide the space as described, or contact the guest promptly if something has changed.",
    ],
  },
  {
    title: "Guest obligations",
    body: [
      "Treat the studio with care and use it only for the purpose described in the listing.",
      "Respect the agreed booking window, including setup and cleanup time.",
      "Do not sublet, resell, or exceed the listed capacity without the host's permission.",
      "Report any damage or issue to the host as soon as it happens.",
    ],
  },
  {
    title: "Bookings, rates, and cancellations",
    body: [
      "A booking request is only confirmed once the host accepts it; pending requests do not guarantee the space.",
      "Hourly rates, security deposits, and any applicable fees are shown before you submit a request.",
      "Cancellation and refund terms depend on the host's policy and the timing of your cancellation.",
      "Studiospace may review or cancel bookings that appear fraudulent or that violate these terms.",
    ],
  },
  {
    title: "Content and listings",
    body: [
      "You keep ownership of the images and descriptions you upload, and you grant StudioSpace a licence to display them on the platform.",
      "Only upload content you have the right to use, and avoid material that infringes the rights of others.",
      "We may remove or edit listings that are misleading, unsafe, or out of date.",
    ],
  },
  {
    title: "Prohibited conduct",
    body: [
      "Do not attempt to bypass the platform, harass other members, or post fraudulent reviews.",
      "Do not interfere with the service, scrape the site, or attempt unauthorised access to other accounts.",
      "Do not use StudioSpace for any unlawful, dangerous, or commercial purpose outside the listing description.",
    ],
  },
  {
    title: "Liability and termination",
    body: [
      "StudioSpace is a marketplace connecting guests and hosts; agreements for a specific space are between those members.",
      "To the extent permitted by law, we are not liable for indirect or consequential losses arising from use of the platform.",
      "We may suspend or terminate accounts that violate these terms or create risk for other members.",
      "We may update these terms, and will post the revised date on this page when we do.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to home
          </Link>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Scale className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Terms of service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated November 2026
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            These terms govern your use of StudioSpace, whether you are booking
            a studio as a guest or publishing one as a host. Please read them
            carefully — they describe your rights and responsibilities, and how
            bookings between members work.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map(({ title, body }, index) => (
            <section
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-foreground">
                <span className="mr-2 text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {title}
              </h2>
              <ul className="mt-3 space-y-2">
                {body.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="rounded-2xl border border-primary/25 bg-primary/5 p-6">
          <h2 className="text-lg font-bold text-foreground">
            Need clarification?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            If any part of these terms is unclear, reach out before you book or
            publish a listing.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="mailto:support@studiospace.com"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              support@studiospace.com
            </a>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Contact us
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
