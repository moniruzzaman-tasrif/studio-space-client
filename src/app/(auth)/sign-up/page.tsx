"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Link as LinkIcon,
  Lock,
  Eye,
  EyeOff,
  Quote,
  Loader2,
} from "lucide-react";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { signUp } from "@/lib/auth-client";
import GoogleButton from "@/components/shared/Googlebutton";
import { notifyError, notifySuccess } from "@/lib/notifications";

/* ---------------------------------- Types --------------------------------- */

type FieldErrors = {
  name?: string ;
  email?: string ;
  photoUrl?: string ;
  password?: string ;
};

type FormValues = {
  name: string;
  email: string;
  photoUrl: string;
  password: string;
};

/* -------------------------------- Validation ------------------------------ */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  // Full name
  const name = values.name.trim();
  if (!name) {
    errors.name = "Please enter your full name.";
  } else if (name.length < 2) {
    errors.name = "Full name must be at least 2 characters.";
  }

  // Email
  const email = values.email.trim();
  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  // Photo URL (optional — only validated when provided)
  const photoUrl = values.photoUrl.trim();
  if (photoUrl) {
    try {
      const parsed = new URL(photoUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        errors.photoUrl = "Please enter a valid image URL.";
      }
    } catch {
      errors.photoUrl = "Please enter a valid image URL.";
    }
  }

  // Password: min 6 chars, at least one uppercase & one lowercase letter
  const password = values.password;
  if (!password) {
    errors.password = "Please create a password.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
  } else if (!/[A-Z]/.test(password)) {
    errors.password = "Password must include at least one uppercase letter.";
  } else if (!/[a-z]/.test(password)) {
    errors.password = "Password must include at least one lowercase letter.";
  }

  return errors;
}

/* --------------------------------- Page ----------------------------------- */

export default function RegisterPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const inputClassName = cn(
    "bg-white border-gray-200 rounded-lg text-sm h-10",
  );

  const  handleSubmit = async (event: React.FormEvent<HTMLFormElement>)=> {
    event.preventDefault();
    if (isLoading) return;

    // Native FormData extraction
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as FormValues;
    const validationErrors = validate(data);
    setErrors(validationErrors);

    const firstError = Object.values(validationErrors)[0];
    if (firstError) {
      if (validationErrors.password) {
        notifyError("Invalid password.", validationErrors.password);
      } else {
        notifyError("Please fix the highlighted fields.", firstError);
      }
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp.email({
        name: data.name,
        email: data.email,
        image: data.photoUrl,
        password: data.password,
        callbackURL: "/",
      });

      if (error) {
        notifyError(
          "Registration failed.",
          error.message ?? "Something went wrong. Please try again.",
        );
        return;
      }

      notifySuccess(
        "Account created successfully!",
        "Your account is ready. Redirecting to home...",
      );

      router.push("/");
    } catch (error) {
      notifyError(
        "Registration failed.",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* ---------------------------- Left: Form --------------------------- */}
        <div className="lg:col-span-6 px-4 sm:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
          <div className="space-y-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E8612C]">
              Welcome to StudioSpace
            </span>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Create your account.
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Join a community of photographers, filmmakers, podcasters,
              musicians, and hosts sharing remarkable spaces.
            </p>
          </div>
          {/* Google social sign-up (simulated) */}
          <GoogleButton></GoogleButton>

          <div className="relative flex items-center justify-center mb-6">
            <Separator className="w-full" />
            <span className="absolute bg-[#FAF8F5] px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Or continue with email
            </span>
          </div>
          {/* Native form — no react-hook-form, no zod */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold">
                Full name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  className={cn(inputClassName, "pl-9")}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@studio.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  className={cn(inputClassName, "pl-9")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Photo URL (optional) */}
            <div className="space-y-1.5">
              <Label htmlFor="photoUrl" className="text-xs font-semibold">
                Profile image URL{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="photoUrl"
                  name="photoUrl"
                  type="url"
                  placeholder="https://example.com/your-photo.jpg"
                  aria-invalid={!!errors.photoUrl}
                  className={cn(inputClassName, "pl-9")}
                />
              </div>
              {errors.photoUrl && (
                <p className="text-xs text-destructive">{errors.photoUrl}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  className={cn(inputClassName, "pl-9 pr-9")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E8612C] hover:bg-[#d5521f] text-white font-semibold rounded-full h-11 shadow-sm mt-2 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-[#E8612C] font-semibold hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* --------------------- Right: Image quote card --------------------- */}
        <div className="lg:col-span-6 hidden lg:block">
          <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl bg-gray-900 border border-gray-100">
            <Image
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
              alt="Photographer working in a StudioSpace studio"
              fill
              priority
              className="object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white space-y-3">
              <Quote className="w-8 h-8 text-[#E8612C]" />
              <h3 className="text-2xl font-bold leading-snug tracking-tight">
                The right space changes what your team believes is possible.
              </h3>
              <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">
                StudioSpace — Book. Create. Repeat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
