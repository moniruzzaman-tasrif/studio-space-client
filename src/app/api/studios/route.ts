import { headers } from "next/headers";

import { auth, db } from "@/lib/auth";

const categories = [
  "Photo Studio",
  "Music Suite",
  "Art Space",
  "Dance Studio",
  "Podcast Lounge",
  "Film Stage",
] as const;

const availableAmenities = [
  "Wi-Fi",
  "Parking",
  "Air Conditioning",
  "Natural Light",
  "Kitchen",
  "Restroom",
  "Soundproof",
  "Lighting Equipment",
] as const;

type StudioInput = {
  title: string;
  category: (typeof categories)[number];
  description: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  amenities: (typeof availableAmenities)[number][];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseStudioInput(value: unknown): StudioInput | null {
  if (!isRecord(value)) return null;

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

  if (
    typeof title !== "string" ||
    title.trim().length < 3 ||
    title.trim().length > 100 ||
    typeof category !== "string" ||
    !categories.includes(category as (typeof categories)[number]) ||
    typeof description !== "string" ||
    description.trim().length < 20 ||
    description.trim().length > 5000 ||
    typeof location !== "string" ||
    location.trim().length < 3 ||
    location.trim().length > 300 ||
    typeof imageUrl !== "string" ||
    typeof hourlyRate !== "number" ||
    !Number.isFinite(hourlyRate) ||
    hourlyRate <= 0 ||
    typeof securityDeposit !== "number" ||
    !Number.isFinite(securityDeposit) ||
    securityDeposit < 0 ||
    typeof maxCapacity !== "number" ||
    !Number.isInteger(maxCapacity) ||
    maxCapacity < 1 ||
    maxCapacity > 1000 ||
    !Array.isArray(amenities) ||
    amenities.some(
      (amenity) =>
        typeof amenity !== "string" ||
        !availableAmenities.includes(
          amenity as (typeof availableAmenities)[number],
        ),
    )
  ) {
    return null;
  }

  let parsedImageUrl: URL;
  try {
    parsedImageUrl = new URL(imageUrl);
  } catch {
    return null;
  }

  if (parsedImageUrl.protocol !== "https:") return null;

  return {
    title: title.trim(),
    category: category as StudioInput["category"],
    description: description.trim(),
    hourlyRate,
    securityDeposit,
    maxCapacity,
    location: location.trim(),
    imageUrl: parsedImageUrl.href,
    amenities: [...new Set(amenities)] as StudioInput["amenities"],
  };
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });

  if (!session) {
    return Response.json({ error: "Please sign in to publish a studio." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const studio = parseStudioInput(body);
  if (!studio) {
    return Response.json(
      { error: "Please check the studio details and try again." },
      { status: 400 },
    );
  }

  try {
    const result = await db.collection("studios").insertOne({
      ...studio,
      host: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return Response.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("Unable to save studio listing:", error);
    return Response.json(
      { error: "Unable to publish the studio right now. Please try again." },
      { status: 500 },
    );
  }
}
