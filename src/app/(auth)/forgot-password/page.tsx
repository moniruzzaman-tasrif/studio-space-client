import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, Mail, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#FAF8F5] p-4 md:p-8">
      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <section className="px-4 py-6 sm:px-8 lg:col-span-6">
          <Link
            href="/sign-in"
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to login
          </Link>

          <div className="mb-6 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E8612C]">
              Account assistance
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#E8612C]">
              <LockKeyhole className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Forgot your password?
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Enter the email address associated with your account to get
              instructions for resetting your password.
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email address
              </Label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@studio.com"
                  autoComplete="email"
                  className="h-10 rounded-lg border-gray-200 bg-white pl-9 text-sm"
                />
              </div>
            </div>

            <p className="rounded-xl border border-border bg-card px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              Password reset email delivery is not configured yet. This form is
              for display only; contact support if you need help accessing your
              account.
            </p>

            <Button
              type="button"
              disabled
              className="h-11 w-full rounded-full bg-[#E8612C] font-semibold text-white shadow-sm"
            >
              Send reset instructions
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#E8612C] hover:underline"
            >
              Return to login
            </Link>
          </p>
        </section>

        <div className="hidden lg:col-span-6 lg:block">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-gray-100 bg-gray-900 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
              alt="A welcoming creative studio workspace"
              fill
              priority
              className="object-cover opacity-85"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 flex flex-col justify-end space-y-3 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 text-white">
              <Quote className="h-8 w-8 text-[#E8612C]" aria-hidden="true" />
              <h2 className="text-2xl font-bold leading-snug tracking-tight">
                The right space changes what your team believes is possible.
              </h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                StudioSpace — Book. Create. Repeat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
