import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How StudioSpace collects, uses, and protects your information.",
};

const sections = [
  {
    title: "Information we collect",
    body: [
      "Account details you provide when you register, such as your name, email address, and authentication information.",
      "Studio listings you publish as a host, including titles, descriptions, pricing, amenities, locations, and images.",
      "Booking details you submit as a guest, such as requested dates, party size, and messages exchanged with a host.",
      "Technical information collected automatically, such as device type, browser, pages visited, and approximate region.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "To create and secure your account, and to verify your identity when you sign in.",
      "To display listings, match guests with studios, and process booking requests between guests and hosts.",
      "To send transactional messages about bookings, including confirmations, updates, and cancellations.",
      "To improve search, filtering, and the overall reliability of the StudioSpace marketplace.",
    ],
  },
  {
    title: "Sharing and disclosure",
    body: [
      "Booking details are shared with the host of the studio you request, and your host's listing details are shared with you.",
      "We do not sell your personal information to third parties.",
      "We disclose information when required by law, or when necessary to protect the safety and rights of our community.",
    ],
  },
  {
    title: "Data retention and security",
    body: [
      "We keep account information for as long as your account is active, and for a limited period afterwards to meet legal obligations.",
      "Passwords are never stored in plain text; authentication is handled by a dedicated identity provider.",
      "Transmission between your browser and StudioSpace is encrypted, though no method of storage is perfectly secure.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You may update your profile details or delete your account at any time from your dashboard.",
      "You can opt out of non-essential communications while still receiving booking-related notices.",
      "You may request a copy of the personal data we hold about you by contacting us.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "We use strictly necessary cookies to keep you signed in and to remember your light or dark theme preference.",
      "Analytics cookies help us understand which pages are useful so we can improve the product.",
    ],
  },
];

export default function PrivacyPage() {
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
            <LockKeyhole className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Privacy policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated November 2026
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            StudioSpace is a peer-to-peer marketplace for discovering and
            booking creative workspaces. This policy explains what we collect,
            why we collect it, and the choices you have. By creating an account
            or using the platform, you agree to the practices described here.
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
            Questions about your data?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact our support team and we will respond within one business
            day.
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
