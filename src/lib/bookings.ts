export type BookingRecord = Record<string, unknown>;

function isRecord(value: unknown): value is BookingRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function loadBookingsForEmail(
  email: string,
): Promise<{ bookings: BookingRecord[]; error: string }> {
  try {
    const response = await fetch(
      `http://localhost:5000/bookings/${encodeURIComponent(email)}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error(`The bookings service returned ${response.status}.`);
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error("The bookings service returned an unexpected response.");
    }

    return {
      bookings: payload.filter(isRecord),
      error: "",
    };
  } catch (error) {
    return {
      bookings: [],
      error:
        error instanceof Error ? error.message : "Unable to load your bookings.",
    };
  }
}
