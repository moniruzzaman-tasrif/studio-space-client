"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  DollarSign,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import { apiUrl } from "@/lib/utils";
import { BrandedSpinner } from "@/components/shared/BrandedLoading";
import { notifyError, notifyInfo, notifySuccess } from "@/lib/notifications";
import { getClientToken } from "@/lib/tokenClient";
import { STUDIO_AMENITIES, STUDIO_CATEGORIES } from "@/Data";

type FieldErrors = Partial<
  Record<
    | "title"
    | "category"
    | "description"
    | "hourlyRate"
    | "securityDeposit"
    | "maxCapacity"
    | "location"
    | "imageUrl",
    string
  >
>;

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <CardHeader className="flex grid-cols-none flex-row items-center gap-3 px-5 pb-0 pt-5 sm:px-7 sm:pt-7">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-[#E8612C]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
        {title}
      </h2>
    </CardHeader>
  );
}

function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="text-xs text-destructive">{children}</p>;
}

export default function AddStudioPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in?callbackURL=/add-studio");
    }
  }, [isPending, router, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    if (!user) {
      notifyInfo("Sign in to publish a studio listing.");
      router.replace("/sign-in?callbackURL=/add-studio");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const title = String(formData.get("title") ?? "").trim();
    const selectedCategory = String(formData.get("category") ?? "");
    const description = String(formData.get("description") ?? "").trim();
    const hourlyRate = Number(formData.get("hourlyRate"));
    const securityDeposit = Number(formData.get("securityDeposit") || 0);
    const maxCapacity = Number(formData.get("maxCapacity"));
    const location = String(formData.get("location") ?? "").trim();
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    const selectedAmenities = formData
      .getAll("amenities")
      .filter((value): value is string => typeof value === "string");

    const nextErrors: FieldErrors = {};
    if (title.length < 3 || title.length > 100) {
      nextErrors.title = "Enter a studio name between 3 and 100 characters.";
    }
    if (!STUDIO_CATEGORIES.some((item) => item.name === selectedCategory)) {
      nextErrors.category = "Choose a studio category.";
    }
    if (description.length < 20 || description.length > 5000) {
      nextErrors.description =
        "Enter an overview between 20 and 5,000 characters.";
    }
    if (!Number.isFinite(hourlyRate) || hourlyRate <= 0 || hourlyRate > 100_000) {
      nextErrors.hourlyRate = "Enter a valid hourly rate.";
    }
    if (
      !Number.isFinite(securityDeposit) ||
      securityDeposit < 0 ||
      securityDeposit > 1_000_000
    ) {
      nextErrors.securityDeposit = "Enter a valid non-negative deposit.";
    }
    if (!Number.isInteger(maxCapacity) || maxCapacity < 1 || maxCapacity > 1000) {
      nextErrors.maxCapacity = "Enter a capacity from 1 to 1,000.";
    }
    if (location.length < 3 || location.length > 300) {
      nextErrors.location = "Enter a location between 3 and 300 characters.";
    }

    try {
      if (new URL(imageUrl).protocol !== "https:") {
        nextErrors.imageUrl = "The cover image URL must use HTTPS.";
      }
    } catch {
      nextErrors.imageUrl = "Enter a valid HTTPS image URL.";
    }

    setErrors(nextErrors);
    const firstError = Object.values(nextErrors)[0];
    if (firstError) {
      notifyError("Please check the studio details.", firstError);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getClientToken();
      const response = await fetch(apiUrl("/studios"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category: selectedCategory,
          description,
          hourlyRate,
          securityDeposit,
          maxCapacity,
          location,
          imageUrl,
          amenities: selectedAmenities,
          ownerName: user.name,
          ownerEmail: user.email,
        }),
      });

      const result: { error?: string } = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/sign-in?callbackURL=/add-studio");
          return;
        }
        notifyError(
          "Unable to publish studio.",
          result.error || "Please check your details and try again.",
        );
        return;
      }

      notifySuccess("Studio published successfully!");
      router.push("/my-listings");
    } catch (error) {
      notifyError(
        "Unable to publish studio.",
        error instanceof Error
          ? error.message
          : "A network error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPending || !user) {
    return (
      <main className="min-h-[70vh] bg-background">
        <BrandedSpinner
          label={
            isPending ? "Loading your account..." : "Redirecting to sign in..."
          }
        />
      </main>
    );
  }

  const inputClassName =
    "h-11 rounded-xl border-gray-200 bg-[#FAF8F5] px-3 text-sm focus-visible:bg-white";

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="mb-5 gap-2 px-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E8612C]">
            Share your creative space
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Add a new studio
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Tell creators what makes your space special. Add the details below
            to publish your listing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Card className="rounded-3xl border border-gray-200 bg-white shadow-sm">
            <SectionHeading icon={Building2} title="Basic Information" />
            <CardContent className="space-y-5 px-5 pb-6 pt-5 sm:px-7 sm:pb-7">
              <div className="space-y-2">
                <Label htmlFor="title">Studio name *</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  maxLength={100}
                  placeholder="e.g. Sunlit Creative Loft"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.title)}
                />
                <FieldError>{errors.title}</FieldError>
              </div>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">
                  Choose a category *
                </legend>
                <input type="hidden" name="category" value={category} />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {STUDIO_CATEGORIES.map(({ name, icon: Icon }) => {
                    const isSelected = category === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => {
                          setCategory(name);
                          setErrors((previous) => ({
                            ...previous,
                            category: undefined,
                          }));
                        }}
                        className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border px-3 py-3 text-center text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8612C] ${
                          isSelected
                            ? "border-[#E8612C] bg-orange-50 text-[#E8612C]"
                            : "border-gray-200 bg-white text-muted-foreground hover:border-orange-200 hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        {name}
                      </button>
                    );
                  })}
                </div>
                <FieldError>{errors.category}</FieldError>
              </fieldset>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed overview *</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  minLength={20}
                  maxLength={5000}
                  rows={5}
                  placeholder="Describe the space, its atmosphere, and what creators can make there..."
                  className="min-h-32 rounded-xl border-gray-200 bg-[#FAF8F5] px-3 py-3 text-sm focus-visible:bg-white"
                  aria-invalid={Boolean(errors.description)}
                />
                <FieldError>{errors.description}</FieldError>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-gray-200 bg-white shadow-sm">
            <SectionHeading icon={DollarSign} title="Pricing & Capacity" />
            <CardContent className="grid gap-5 px-5 pb-6 pt-5 sm:grid-cols-3 sm:px-7 sm:pb-7">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly rate ($) *</Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  min="0.01"
                  max="100000"
                  step="0.01"
                  required
                  placeholder="75"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.hourlyRate)}
                />
                <FieldError>{errors.hourlyRate}</FieldError>
              </div>
              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security deposit ($)</Label>
                <Input
                  id="securityDeposit"
                  name="securityDeposit"
                  type="number"
                  min="0"
                  max="1000000"
                  step="0.01"
                  placeholder="0"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.securityDeposit)}
                />
                <FieldError>{errors.securityDeposit}</FieldError>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Maximum capacity *</Label>
                <Input
                  id="maxCapacity"
                  name="maxCapacity"
                  type="number"
                  min="1"
                  max="1000"
                  step="1"
                  required
                  placeholder="12"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.maxCapacity)}
                />
                <FieldError>{errors.maxCapacity}</FieldError>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-gray-200 bg-white shadow-sm">
            <SectionHeading icon={MapPin} title="Location" />
            <CardContent className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7">
              <div className="space-y-2">
                <Label htmlFor="location">Location / street address *</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  maxLength={300}
                  autoComplete="street-address"
                  placeholder="Street address, city, and region"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.location)}
                />
                <FieldError>{errors.location}</FieldError>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-gray-200 bg-white shadow-sm">
            <SectionHeading icon={ImagePlus} title="Photos" />
            <CardContent className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Cover image URL *</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  required
                  placeholder="https://example.com/studio-photo.jpg"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.imageUrl)}
                />
                <p className="text-xs text-muted-foreground">
                  Use a direct HTTPS link to an image of your studio.
                </p>
                <FieldError>{errors.imageUrl}</FieldError>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-gray-200 bg-white shadow-sm">
            <SectionHeading icon={Sparkles} title="Amenities" />
            <CardContent className="grid grid-cols-1 gap-3 px-5 pb-6 pt-5 sm:grid-cols-2 sm:px-7 sm:pb-7">
              {STUDIO_AMENITIES.map(({ name, icon: Icon }) => (
                <label
                  key={name}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-[#FAF8F5] px-4 py-3 text-sm transition-colors hover:border-orange-200"
                >
                  <Checkbox name="amenities" value={name} />
                  <Icon
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>{name}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-gray-200 bg-white shadow-sm">
            <SectionHeading icon={UserRound} title="Host Details" />
            <CardContent className="grid gap-5 px-5 pb-6 pt-5 sm:grid-cols-2 sm:px-7 sm:pb-7">
              <div className="space-y-2">
                <Label htmlFor="hostName">Host name</Label>
                <Input
                  id="hostName"
                  value={user.name}
                  readOnly
                  className="h-11 rounded-xl border-gray-200 bg-gray-100 px-3 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hostEmail">Host email</Label>
                <Input
                  id="hostEmail"
                  type="email"
                  value={user.email}
                  readOnly
                  className="h-11 rounded-xl border-gray-200 bg-gray-100 px-3 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col-reverse gap-3 pb-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="h-11 rounded-xl border-gray-200 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 gap-2 rounded-xl bg-[#E8612C] px-7 font-semibold text-white hover:bg-[#d5521f]"
            >
              {isSubmitting && (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Publishing..." : "Publish Studio"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
