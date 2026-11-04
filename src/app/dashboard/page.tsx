"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CircleDollarSign,
  Compass,
  LoaderCircle,
  MapPin,
  Plus,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/lib/auth-client";

const STUDIOS_API = "http://localhost:5000/studios";

type Studio = {
  id: string;
  title: string;
  location: string;
  rating: number | null;
  status: string;
  userId: string;
  userEmail: string;
  ownerEmail: string;
  bookings: Booking[];
};

type Booking = {
  id: string;
  studioTitle: string;
  location: string;
  date: string;
  duration: string;
  price: number | null;
  status: string;
};

type Metric = {
  label: string;
  value: string;
  detail: string;
  icon: typeof Building2;
  iconClass: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(...values: unknown[]): string {
  return (
    values.find(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    )?.trim() ?? ""
  );
}

function getNumber(...values: unknown[]): number | null {
  for (const value of values) {
    const number =
      typeof value === "number"
        ? value
        : typeof value === "string" && value.trim()
          ? Number(value)
          : NaN;
    if (Number.isFinite(number)) return number;
  }
  return null;
}

function toBooking(value: unknown, studio: Record<string, unknown>): Booking | null {
  if (!isRecord(value)) return null;

  const date = getString(value.date, value.bookingDate, value.startDate);
  if (!date) return null;

  const duration = getNumber(value.durationHours, value.duration);
  const price = getNumber(value.totalPrice, value.amount, value.price);

  return {
    id: getString(value._id, value.id) || `${studio._id}-${date}`,
    studioTitle: getString(value.studioTitle, value.title, studio.title, studio.name) || "Studio",
    location: getString(value.location, studio.location, studio.address),
    date,
    duration: duration === null ? "—" : `${duration} ${duration === 1 ? "hour" : "hours"}`,
    price,
    status: getString(value.status) || "Pending",
  };
}

function toStudio(value: unknown): Studio | null {
  if (!isRecord(value)) return null;

  const id = getString(value._id, value.id);
  const title = getString(value.title, value.name);
  if (!id || !title) return null;

  const embeddedBookings = Array.isArray(value.bookings)
    ? value.bookings
        .map((booking) => toBooking(booking, value))
        .filter((booking): booking is Booking => booking !== null)
    : [];

  return {
    id,
    title,
    location: getString(value.location, value.address),
    rating: getNumber(value.rating),
    status: getString(value.status).toLowerCase(),
    userId: getString(value.userId, isRecord(value.host) ? value.host.id : ""),
    userEmail: getString(value.userEmail, isRecord(value.host) ? value.host.email : ""),
    ownerEmail: getString(value.ownerEmail),
    bookings: embeddedBookings,
  };
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function statusClass(status: string): string {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    case "completed":
      return "border-blue-100 bg-blue-50 text-blue-700";
    case "canceled":
    case "cancelled":
      return "border-red-100 bg-red-50 text-red-700";
    default:
      return "border-amber-100 bg-amber-50 text-amber-700";
  }
}

export default function DashboardPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const user = session?.user;
  const userId = user?.id;
  const userEmail = user?.email;
  const isSignedIn = Boolean(user);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryIndex, setRetryIndex] = useState(0);

  useEffect(() => {
    if (isSessionPending) return;
    if (!isSignedIn) {
      return;
    }

    const controller = new AbortController();
    async function loadStudios() {
      setIsLoading(true);
      setLoadError("");
      try {
        const response = await fetch(STUDIOS_API, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`The studios server returned ${response.status}.`);
        }
        const payload: unknown = await response.json();
        if (!Array.isArray(payload)) {
          throw new Error("The studios server returned an unexpected response.");
        }

        const email = userEmail?.toLowerCase();
        const ownedStudios = payload
          .map(toStudio)
          .filter((studio): studio is Studio => studio !== null)
          .filter(
            (studio) =>
              (email &&
                [studio.userEmail, studio.ownerEmail]
                  .some((value) => value.toLowerCase() === email)) ||
              (userId && studio.userId === userId),
          );
        setStudios(ownedStudios);
      } catch (error) {
        if (controller.signal.aborted) return;
        const message =
          error instanceof Error ? error.message : "Unable to load your studios.";
        setLoadError(message);
        toast.error("Unable to load dashboard data", { description: message });
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadStudios();
    return () => controller.abort();
  }, [isSessionPending, isSignedIn, userEmail, userId, retryIndex]);

  const userStudios = useMemo(() => (isSignedIn ? studios : []), [isSignedIn, studios]);
  const dashboardLoading = isSessionPending || (isSignedIn && isLoading);
  const bookings = useMemo(
    () => userStudios.flatMap((studio) => studio.bookings),
    [userStudios],
  );
  const activeListings = userStudios.filter(
    (studio) =>
      studio.status !== "draft" &&
      studio.status !== "paused" &&
      studio.status !== "unpublished",
  ).length;
  const ratings = userStudios
    .map((studio) => studio.rating)
    .filter((rating): rating is number => rating !== null && rating > 0);
  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
      : null;
  const totalRevenue = bookings.reduce(
    (total, booking) => total + (booking.price ?? 0),
    0,
  );
  const hasRevenueData = bookings.some((booking) => booking.price !== null);

  const metrics: Metric[] = [
    {
      label: "Total Bookings",
      value: bookings.length ? String(bookings.length) : "—",
      detail: bookings.length ? "Across your studios" : "No booking data yet",
      icon: CalendarDays,
      iconClass: "bg-orange-50 text-[#E8612C]",
    },
    {
      label: "Active Listings",
      value: String(activeListings),
      detail: `Of ${userStudios.length} ${userStudios.length === 1 ? "studio" : "studios"}`,
      icon: Building2,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Total Revenue",
      value: hasRevenueData
        ? `$${totalRevenue.toLocaleString("en-US")}`
        : "—",
      detail: hasRevenueData ? "From available bookings" : "No revenue data yet",
      icon: CircleDollarSign,
      iconClass: "bg-blue-50 text-blue-700",
    },
    {
      label: "Average Rating",
      value: averageRating ?? "—",
      detail: ratings.length
        ? `From ${ratings.length} rated ${ratings.length === 1 ? "studio" : "studios"}`
        : "No ratings yet",
      icon: Star,
      iconClass: "bg-amber-50 text-amber-600",
    },
  ];

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E8612C]">
              Your creative space
            </p>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#25221F] sm:text-4xl">
              Welcome back, {user?.name?.trim().split(/\s+/)[0] || "Creator"}
            </h1>
            <p className="mt-2 text-sm text-[#6D6862] sm:text-base">
              Here&apos;s what&apos;s happening with your studios and bookings.
            </p>
          </div>
          <Button
            render={<Link href="/add-studio" />}
            className="h-11 gap-2 rounded-full bg-[#E8612C] px-5 font-semibold text-white shadow-sm hover:bg-[#d5521f]"
          >
            <Plus className="h-4 w-4" />
            Add New Studio
          </Button>
        </section>

        {!user && !isSessionPending && (
          <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">
            Sign in to see your studio dashboard and listing metrics.
          </div>
        )}

        <section
          aria-label="Studio metrics"
          className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card
                key={metric.label}
                className="rounded-3xl border border-gray-200 bg-white py-0 shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-[#6D6862]">
                        {metric.label}
                      </p>
                      <p className="mt-3 text-3xl font-bold tracking-tight text-[#25221F]">
                        {dashboardLoading ? (
                          <span className="inline-block h-9 w-16 animate-pulse rounded bg-gray-100" />
                        ) : (
                          metric.value
                        )}
                      </p>
                    </div>
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${metric.iconClass}`}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-[#8A837C]">{metric.detail}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-[#25221F]">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm text-[#6D6862]">
                Keep your creative business moving.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Add New Studio",
                description: "Share a creative space",
                href: "/add-studio",
                icon: Plus,
              },
              {
                label: "View Bookings",
                description: "See recent reservations",
                href: "#recent-bookings",
                icon: CalendarDays,
              },
              {
                label: "Manage Listings",
                description: "Update your studios",
                href: "/my-listings",
                icon: Building2,
              },
              {
                label: "Explore Studios",
                description: "Find your next space",
                href: "/explore",
                icon: Compass,
              },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  render={<Link href={action.href} />}
                  variant="outline"
                  className="h-auto justify-start gap-3 rounded-2xl border-gray-200 bg-white px-4 py-4 text-left shadow-sm hover:border-orange-200 hover:bg-orange-50/40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E8] text-[#E8612C]">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-[#25221F]">
                      {action.label}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-normal text-[#8A837C]">
                      {action.description}
                    </span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#9A9189]" />
                </Button>
              );
            })}
          </div>
        </section>

        <section id="recent-bookings" className="mt-10 scroll-mt-24">
          <Card className="rounded-3xl border border-gray-200 bg-white py-0 shadow-sm">
            <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="font-heading text-xl font-bold text-[#25221F]">
                  Recent Bookings
                </h2>
                <p className="mt-1 text-sm text-[#6D6862]">
                  Keep track of reservations for your studios.
                </p>
              </div>
              <Link
                href="#recent-bookings"
                className="inline-flex items-center gap-1 self-start text-sm font-semibold text-[#E8612C] hover:text-[#d5521f] sm:self-auto"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {loadError ? (
              <div role="alert" className="px-6 py-10 text-center">
                <p className="font-semibold text-[#25221F]">
                  Dashboard data could not be loaded
                </p>
                <p className="mt-1 text-sm text-[#6D6862]">{loadError}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRetryIndex((index) => index + 1)}
                  className="mt-4 rounded-full"
                >
                  Try again
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5 sm:pl-6">Studio</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="pr-5 sm:pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-28 text-center text-[#8A837C]">
                        <LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" />
                        Loading your dashboard…
                      </TableCell>
                    </TableRow>
                  ) : recentBookings.length ? (
                    recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="max-w-64 pl-5 sm:pl-6">
                          <p className="truncate font-semibold text-[#25221F]">
                            {booking.studioTitle}
                          </p>
                          <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#8A837C]">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {booking.location || "Location not provided"}
                          </p>
                        </TableCell>
                        <TableCell>{formatDate(booking.date)}</TableCell>
                        <TableCell>{booking.duration}</TableCell>
                        <TableCell>
                          {booking.price === null
                            ? "—"
                            : `$${booking.price.toLocaleString("en-US")}`}
                        </TableCell>
                        <TableCell className="pr-5 sm:pr-6">
                          <Badge
                            variant="outline"
                            className={`rounded-full font-medium ${statusClass(booking.status)}`}
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-36 px-5 text-center sm:px-6">
                        <CalendarDays className="mx-auto mb-2 h-6 w-6 text-[#C7BEB5]" />
                        <p className="font-medium text-[#25221F]">
                          No booking data available yet
                        </p>
                        <p className="mt-1 text-xs text-[#8A837C]">
                          Your studios endpoint doesn&apos;t include booking records.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </Card>
        </section>
      </main>

  
    </div>
  );
}
