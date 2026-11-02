import { headers } from "next/headers";
import { ObjectId, type Filter } from "mongodb";

import { auth, db } from "@/lib/auth";

const categories = [
  "Photo Studio",
  "Music Suite",
  "Art Space",
  "Dance Studio",
  "Podcast Lounge",
  "Film Stage",
] as const;

type StudioDocument = {
  _id: ObjectId | string;
  title: string;
  category: string;
  description: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  host?: { id?: string; email?: string };
  userId?: string;
  userEmail?: string;
  ownerEmail?: string;
  updatedAt?: Date;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

type ParsedUpdate =
  | { success: true; value: Omit<StudioDocument, "_id"> }
  | { success: false; error: string };

function parseUpdate(value: unknown): ParsedUpdate {
  if (!isRecord(value)) {
    return { success: false, error: "The request body must be an object." };
  }

  const {
    title,
    category,
    description,
    hourlyRate,
    securityDeposit,
    maxCapacity,
    location,
    imageUrl,
    amenities,
  } = value;

  if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 100) {
    return { success: false, error: "Enter a studio name between 3 and 100 characters." };
  }
  if (typeof category !== "string" || !categories.includes(category as (typeof categories)[number])) {
    return { success: false, error: "Choose a valid studio category." };
  }
  if (
    typeof description !== "string" ||
    description.trim().length < 20 ||
    description.trim().length > 5000
  ) {
    return { success: false, error: "Enter a description between 20 and 5,000 characters." };
  }
  if (
    typeof hourlyRate !== "number" ||
    !Number.isFinite(hourlyRate) ||
    hourlyRate <= 0 ||
    hourlyRate > 100_000
  ) {
    return { success: false, error: "Enter a valid hourly rate." };
  }
  if (
    typeof securityDeposit !== "number" ||
    !Number.isFinite(securityDeposit) ||
    securityDeposit < 0 ||
    securityDeposit > 1_000_000
  ) {
    return { success: false, error: "Enter a valid security deposit." };
  }
  if (
    typeof maxCapacity !== "number" ||
    !Number.isInteger(maxCapacity) ||
    maxCapacity < 1 ||
    maxCapacity > 1000
  ) {
    return { success: false, error: "Enter a capacity from 1 to 1,000." };
  }
  if (
    typeof location !== "string" ||
    location.trim().length < 3 ||
    location.trim().length > 300
  ) {
    return { success: false, error: "Enter a location between 3 and 300 characters." };
  }
  if (typeof imageUrl !== "string") {
    return { success: false, error: "Enter a valid HTTPS image URL." };
  }
  if (
    !Array.isArray(amenities) ||
    amenities.length > 30 ||
    amenities.some(
      (amenity) =>
        typeof amenity !== "string" ||
        amenity.trim().length === 0 ||
        amenity.trim().length > 80,
    )
  ) {
    return { success: false, error: "Check the selected amenities and try again." };
  }

  let parsedImageUrl: URL;
  try {
    parsedImageUrl = new URL(imageUrl);
  } catch {
    return { success: false, error: "Enter a valid HTTPS image URL." };
  }
  if (parsedImageUrl.protocol !== "https:") {
    return { success: false, error: "The cover image URL must use HTTPS." };
  }

  return {
    success: true,
    value: {
      title: title.trim(),
      category,
      description: description.trim(),
      hourlyRate,
      securityDeposit,
      maxCapacity,
      location: location.trim(),
      imageUrl: parsedImageUrl.href,
      amenities: [...new Set(amenities)] as string[],
    },
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });
  if (!session) {
    return Response.json({ error: "Please sign in to edit this studio." }, { status: 401 });
  }

  const { id } = await params;
  if (!id || id.length > 64) {
    return Response.json({ error: "Invalid studio ID." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsedUpdate = parseUpdate(body);
  if (!parsedUpdate.success) {
    return Response.json(
      { error: parsedUpdate.error },
      { status: 400 },
    );
  }

  const ids: (string | ObjectId)[] = [id];
  if (ObjectId.isValid(id)) ids.push(new ObjectId(id));

  const ownerFilter = {
    $or: [
      { "host.id": session.user.id },
      { userId: session.user.id },
      { "host.email": session.user.email },
      { userEmail: session.user.email },
      { ownerEmail: session.user.email },
    ],
  };
  const filter: Filter<StudioDocument> = {
    $and: [{ _id: { $in: ids } }, ownerFilter],
  };

  try {
    const result = await db
      .collection<StudioDocument>("studios")
      .updateOne(filter, {
        $set: { ...parsedUpdate.value, updatedAt: new Date() },
      });

    if (result.matchedCount === 0) {
      return Response.json(
        { error: "Studio not found or you do not have permission to edit it." },
        { status: 404 },
      );
    }

    return Response.json({ success: true, message: "Studio updated successfully." });
  } catch (error) {
    console.error("Unable to update studio:", error);
    return Response.json(
      { error: "Unable to update the studio right now. Please try again." },
      { status: 500 },
    );
  }
}
