"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Quote,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signIn } from "@/lib/auth-client";
import GoogleButton from "@/components/shared/Googlebutton";

type FieldErrors = {
  email?: string;
  password?: string;
};
type typeValue = {
  email: string;
  password: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;




export default function SignInPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    const formData = new FormData(event.currentTarget);

    const data = Object.fromEntries(formData.entries()) as typeValue;

    const fieldErrors: FieldErrors = {};

    if (!data.email) {
      fieldErrors.email = "Please enter your email address.";
    } else if (!EMAIL_REGEX.test(data.email)) {
      fieldErrors.email = "Please enter a valid email address.";
    }

    if (!data.password) {
      fieldErrors.password = "Please enter your password.";
    }

    setErrors(fieldErrors);
    const firstError = Object.values(fieldErrors)[0];
    if (firstError) {
      toast.error("Validation Error", { description: firstError });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/",
      });

      if (error) {
        toast.error("Login Failed", {
          description:
            error.message ?? "Invalid email or password. Please try again.",
        });
        return;
      }

      toast.success("Login successful!", { description: "Welcome back!" });
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Login Failed", {
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }


  const inputClassName =
    "h-10 rounded-lg border-gray-200 bg-white text-sm";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF8F5] p-4 md:p-8">
      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div className="px-4 py-6 sm:px-8 lg:col-span-6">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          <div className="mb-6 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E8612C]">
              Welcome to StudioSpace
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back.
            </h1>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Log in to manage your bookings, review requests, and keep your
              studio listings up to date.
            </p>
          </div>

          <GoogleButton />

          <div className="relative mb-6 flex items-center justify-center">
            <Separator className="w-full" />
            <span className="absolute bg-[#FAF8F5] px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email address
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@studio.com"
                  autoComplete="email"
                  required
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`${inputClassName} pl-9`}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-xs text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className={`${inputClassName} pl-9 pr-10`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <Label
                htmlFor="rememberMe"
                className="cursor-pointer gap-2 text-xs font-normal text-muted-foreground"
              >
                <Input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 min-w-4 cursor-pointer rounded border-gray-300 p-0 accent-[#E8612C]"
                />
                Remember me
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#E8612C] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-11 w-full rounded-full bg-[#E8612C] font-semibold text-white shadow-sm transition-all hover:bg-[#d5521f]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in →"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              New to StudioSpace?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-[#E8612C] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:col-span-6 lg:block">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-gray-100 bg-gray-900 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
              alt="Photographer working in a StudioSpace studio"
              fill
              priority
              className="object-cover opacity-85"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 flex flex-col justify-end space-y-3 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 text-white">
              <Quote className="h-8 w-8 text-[#E8612C]" />
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
    </div>
  );
}
