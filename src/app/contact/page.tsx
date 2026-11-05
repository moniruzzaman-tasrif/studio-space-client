import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with the StudioSpace team.",
};

const contactChannels = [
  {
    icon: Mail,
    label: "Email",
    value: "support@studiospace.com",
    href: "mailto:support@studiospace.com",
    detail: "We usually reply within one business day.",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 014-2200",
    href: "tel:+15550142200",
    detail: "Monday to Friday, 9:00 AM – 6:00 PM (ET).",
  },
  {
    icon: MessageSquare,
    label: "Live chat",
    value: "Open the chat bubble",
    href: "#chat",
    detail: "Fastest for booking and account questions.",
  },
];

const offices = [
  {
    city: "New York",
    address: "42 Mercer Street, SoHo, New York, NY",
  },
  {
    city: "Support desk",
    address: "Available worldwide, remote first",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to home
          </Link>
          <span className="block text-xs font-bold uppercase tracking-wider text-primary">
            We&apos;d love to hear from you
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Contact StudioSpace
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Questions about a booking, a listing, or your account? Reach out
            through any of the channels below and our team will get back to you.
          </p>
        </div>

        <section
          aria-label="Contact channels"
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {contactChannels.map(({ icon: Icon, label, value, href, detail }) => (
            <a
              key={label}
              href={href}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {value}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {detail}
              </span>
            </a>
          ))}
        </section>

        <section
          aria-label="Office locations"
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-foreground">Where to find us</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {offices.map(({ city, address }) => (
              <div key={city} className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{city}</p>
                  <p className="text-xs text-muted-foreground">{address}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-3 border-t border-border pt-5">
            <Clock
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Support hours
              </p>
              <p className="text-xs text-muted-foreground">
                Monday – Friday, 9:00 AM – 6:00 PM (ET). Booking requests are
                reviewed outside these hours as well.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-primary/25 bg-primary/5 p-6">
          <h2 className="text-lg font-bold text-foreground">
            Looking for something else?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Most answers live in our studio listings and booking pages.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/studios"
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse studios
            </Link>
            <Link
              href="/How-It-Works"
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              How it works
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
