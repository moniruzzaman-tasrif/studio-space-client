"use client";

import { useState, type FormEvent } from "react";
import {
  Building2,
  DollarSign,
  ImagePlus,
  LoaderCircle,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { apiUrl } from "@/lib/utils";
import { getClientToken } from "@/lib/tokenClint";
import { EDIT_STUDIO_AMENITIES, STUDIO_CATEGORIES } from "@/Data";

export interface EditableStudio {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  imageUrl: string;
  hourlyRate: number | null;
  securityDeposit: number | null;
  maxCapacity: number | null;
  amenities: string[];
}

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

async function getApiError(response: Response): Promise<string | undefined> {
  try {
    const payload: unknown = await response.json();
    if (
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
    ) {
      return payload.error;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export function EditStudioDialog({
  studio,
  onOpenChange,
  onSaved,
}: {
  studio: EditableStudio | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (studio: EditableStudio) => void;
}) {
  const [category, setCategory] = useState(studio?.category ?? "");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    studio?.amenities ?? [],
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!studio || isSaving) return;

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    const hourlyRate = Number(formData.get("hourlyRate"));
    const securityDeposit = Number(formData.get("securityDeposit") || 0);
    const maxCapacity = Number(formData.get("maxCapacity"));
    const nextErrors: FieldErrors = {};

    if (title.length < 3 || title.length > 100) {
      nextErrors.title = "Enter a studio name between 3 and 100 characters.";
    }
    if (!STUDIO_CATEGORIES.some((item) => item.name === category)) {
      nextErrors.category = "Choose a studio category.";
    }
    if (description.length < 20 || description.length > 5000) {
      nextErrors.description = "Enter an overview between 20 and 5,000 characters.";
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

    setIsSaving(true);
    try {
      const token = await getClientToken();
      const response = await fetch(
        apiUrl(`/studios/${encodeURIComponent(studio.id)}`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            category,
            description,
            hourlyRate,
            securityDeposit,
            maxCapacity,
            location,
            imageUrl,
            amenities: selectedAmenities,
          }),
        },
      );

      if (!response.ok) {
        const message = await getApiError(response);
        throw new Error(message ?? `Update failed (${response.status}).`);
      }

      onSaved({
        ...studio,
        title,
        category,
        description,
        hourlyRate,
        securityDeposit,
        maxCapacity,
        location,
        imageUrl,
        amenities: selectedAmenities,
      });
      onOpenChange(false);
      notifySuccess("Studio updated successfully.");
    } catch (error) {
      notifyError(
        "Unable to update studio.",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const inputClassName =
    "h-10 rounded-xl border-gray-200 bg-[#FAF8F5] px-3 text-sm focus-visible:bg-white";

  return (
    <Dialog
      open={Boolean(studio)}
      onOpenChange={(open) => {
        if (!isSaving) onOpenChange(open);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit studio listing</DialogTitle>
          <DialogDescription>
            Update the details for {studio?.title ?? "your studio"}.
          </DialogDescription>
        </DialogHeader>

        {studio && (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Card className="rounded-2xl border-gray-200">
              <CardHeader className="flex grid-cols-none flex-row items-center gap-2 pb-0">
                <Building2 className="h-4 w-4 text-[#E8612C]" />
                <h3 className="text-sm font-bold uppercase">Basic information</h3>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-title">Studio name</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={studio.title}
                    maxLength={100}
                    required
                    className={inputClassName}
                  />
                  {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
                </div>
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium">Category</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {STUDIO_CATEGORIES.map(({ name, icon: Icon }) => (
                      <button
                        key={name}
                        type="button"
                        aria-pressed={category === name}
                        onClick={() => setCategory(name)}
                        className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-center text-xs ${
                          category === name
                            ? "border-[#E8612C] bg-orange-50 text-[#E8612C]"
                            : "border-gray-200 bg-white text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {name}
                      </button>
                    ))}
                  </div>
                  {errors.category && <p className="text-xs text-red-600">{errors.category}</p>}
                </fieldset>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={studio.description}
                    minLength={20}
                    maxLength={5000}
                    rows={4}
                    required
                    className="rounded-xl border-gray-200 bg-[#FAF8F5] focus-visible:bg-white"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-600">{errors.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-200">
              <CardHeader className="flex grid-cols-none flex-row items-center gap-2 pb-0">
                <DollarSign className="h-4 w-4 text-[#E8612C]" />
                <h3 className="text-sm font-bold uppercase">Pricing & capacity</h3>
              </CardHeader>
              <CardContent className="grid gap-3 pt-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-hourly-rate">Hourly rate</Label>
                  <Input
                    id="edit-hourly-rate"
                    name="hourlyRate"
                    type="number"
                    min="0.01"
                    max="100000"
                    step="0.01"
                    defaultValue={studio.hourlyRate ?? ""}
                    required
                    className={inputClassName}
                  />
                  {errors.hourlyRate && <p className="text-xs text-red-600">{errors.hourlyRate}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-deposit">Deposit</Label>
                  <Input
                    id="edit-deposit"
                    name="securityDeposit"
                    type="number"
                    min="0"
                    max="1000000"
                    step="0.01"
                    defaultValue={studio.securityDeposit ?? 0}
                    className={inputClassName}
                  />
                  {errors.securityDeposit && (
                    <p className="text-xs text-red-600">{errors.securityDeposit}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-capacity">Max capacity</Label>
                  <Input
                    id="edit-capacity"
                    name="maxCapacity"
                    type="number"
                    min="1"
                    max="1000"
                    step="1"
                    defaultValue={studio.maxCapacity ?? ""}
                    required
                    className={inputClassName}
                  />
                  {errors.maxCapacity && <p className="text-xs text-red-600">{errors.maxCapacity}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-200">
              <CardHeader className="flex grid-cols-none flex-row items-center gap-2 pb-0">
                <MapPin className="h-4 w-4 text-[#E8612C]" />
                <h3 className="text-sm font-bold uppercase">Location & photos</h3>
              </CardHeader>
              <CardContent className="grid gap-3 pt-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    name="location"
                    defaultValue={studio.location}
                    maxLength={300}
                    required
                    className={inputClassName}
                  />
                  {errors.location && <p className="text-xs text-red-600">{errors.location}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-image-url">Cover image URL</Label>
                  <Input
                    id="edit-image-url"
                    name="imageUrl"
                    type="url"
                    defaultValue={studio.imageUrl}
                    required
                    className={inputClassName}
                  />
                  {errors.imageUrl && <p className="text-xs text-red-600">{errors.imageUrl}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-200">
              <CardHeader className="flex grid-cols-none flex-row items-center gap-2 pb-0">
                <ImagePlus className="h-4 w-4 text-[#E8612C]" />
                <h3 className="text-sm font-bold uppercase">Amenities</h3>
              </CardHeader>
              <CardContent className="grid gap-2 pt-4 sm:grid-cols-2">
                {EDIT_STUDIO_AMENITIES.map(({ name, icon: Icon }) => (
                  <label
                    key={name}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-sm"
                  >
                    <Checkbox
                      checked={selectedAmenities.includes(name)}
                      onCheckedChange={(checked) =>
                        setSelectedAmenities((current) =>
                          checked
                            ? [...current, name]
                            : current.filter((item) => item !== name),
                        )
                      }
                    />
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {name}
                  </label>
                ))}
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#E8612C] text-white hover:bg-[#d5521f]"
              >
                {isSaving && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
