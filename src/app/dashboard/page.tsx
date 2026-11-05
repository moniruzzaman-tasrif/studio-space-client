import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  MapPin,
  Plus,
  Star,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { auth } from "@/lib/auth";
import { apiUrl } from "@/lib/utils";
import { getServerToken } from "@/lib/tokenServer";
import { EmptyState } from "@/components/shared/EmptyState";

// Route segment config: allow this segment to block during navigation
// (dashboard needs session + API data; see Next.js `instant` docs).
export const instant = false;

type Studio = {
  _id?: string;
  id?: string;
  title?: string;
  ownerEmail?: string;
  rating?: number;
  status?: string;
};

type Booking = {
  _id?: string;
  id?: string;
  title?: string;
  location?: string;
  status?: string;
  hourlyRate?: string | number;
  bookingData?: {
    bookingDate?: string;
    duration?: string | number;
    hourlyRate?: string | number;
  };
  DataTime?: {
    date?: string;
  };
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?callbackURL=/dashboard");

  const email = session.user.email;
  const token = await getServerToken();
  const [studiosResponse, bookingsResponse] = await Promise.all([
    fetch(apiUrl("/studios"), {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(apiUrl(`/bookings/${encodeURIComponent(email)}`), {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  if (!studiosResponse.ok) {
    throw new Error(`The studios API returned ${studiosResponse.status}.`);
  }
  if (!bookingsResponse.ok) {
    throw new Error(`The bookings API returned ${bookingsResponse.status}.`);
  }

  const allStudios: Studio[] = await studiosResponse.json();
  const bookings: Booking[] = await bookingsResponse.json();
  const studios = allStudios.filter(
    (studio) => studio.ownerEmail?.toLowerCase() === email.toLowerCase(),
  );
  const activeStudios = studios.filter(
    (studio) => !["draft", "paused", "unpublished"].includes(studio.status?.toLowerCase() ?? ""),
  );
  const ratedStudios = studios.filter((studio) => (studio.rating ?? 0) > 0);
  const averageRating = ratedStudios.length
    ? (
        ratedStudios.reduce((sum, studio) => sum + (studio.rating ?? 0), 0) /
        ratedStudios.length
      ).toFixed(1)
    : "—";
  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.bookingData?.bookingDate ?? b.DataTime?.date ?? 0).getTime() -
        new Date(a.bookingData?.bookingDate ?? a.DataTime?.date ?? 0).getTime(),
    )
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <div className="mx-auto max-w-7xl space-y-9 px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border border-gray-200">
              <AvatarImage
                src={session.user.image ?? undefined}
                alt={session.user.name}
              />
              <AvatarFallback className="bg-[#E8612C] font-bold text-white">
                {session.user.name.trim().charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E8612C]">
                Your creative space
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-[#25221F] sm:text-4xl">
                Welcome back, {session.user.name.split(/\s+/)[0]}
              </h1>
              <p className="mt-2 text-sm text-[#6D6862] sm:text-base">
                Here&apos;s what&apos;s happening with your studios and bookings.
              </p>
            </div>
          </div>
          <Button
            render={<Link href="/add-studio" />}
            nativeButton={false}
            className="h-11 gap-2 rounded-full bg-[#E8612C] px-5 font-semibold text-white shadow-sm hover:bg-[#d5521f]"
          >
            <Plus className="h-4 w-4" />
            Add New Studio
          </Button>
        </section>

        <section
          aria-label="Studio metrics"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <Card className="rounded-3xl border-gray-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-[#6D6862]">My Bookings</p>
                <p className="mt-2 text-3xl font-bold text-[#25221F]">
                  {bookings.length}
                </p>
              </div>
              <CalendarDays className="h-6 w-6 text-[#E8612C]" />
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-gray-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-[#6D6862]">Active Listings</p>
                <p className="mt-2 text-3xl font-bold text-[#25221F]">
                  {activeStudios.length}
                </p>
              </div>
              <Building2 className="h-6 w-6 text-emerald-700" />
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-gray-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-[#6D6862]">Average Rating</p>
                <p className="mt-2 text-3xl font-bold text-[#25221F]">
                  {averageRating}
                </p>
              </div>
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#25221F]">Quick Actions</h2>
              <p className="mt-1 text-sm text-[#6D6862]">
                Manage your studios and bookings.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Button
              render={<Link href="/add-studio" />}
              nativeButton={false}
              variant="outline"
              className="h-12 justify-start gap-3 rounded-xl border-gray-200 bg-white"
            >
              <Plus className="h-4 w-4 text-[#E8612C]" />
              Add New Studio
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
            <Button
              render={<Link href="/my-listings" />}
              nativeButton={false}
              variant="outline"
              className="h-12 justify-start gap-3 rounded-xl border-gray-200 bg-white"
            >
              <Building2 className="h-4 w-4 text-[#E8612C]" />
              My Studio Listings
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
            <Button
              render={<Link href={`/my-bookings/${encodeURIComponent(email)}`} />}
              nativeButton={false}
              variant="outline"
              className="h-12 justify-start gap-3 rounded-xl border-gray-200 bg-white"
            >
              <CalendarDays className="h-4 w-4 text-[#E8612C]" />
              My Bookings
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
          </div>
        </section>

        <section>
          <Card className="rounded-3xl border-gray-200 bg-white py-0 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-xl font-bold text-[#25221F]">
                  Recent Bookings
                </h2>
                <p className="mt-1 text-sm text-[#6D6862]">
                  Your latest reservations.
                </p>
              </div>
              <Link
                href={`/my-bookings/${encodeURIComponent(email)}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#E8612C] hover:text-[#d5521f]"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {recentBookings.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  icon={CalendarDays}
                  title="No bookings yet"
                  description="Explore available studios to find a space for your next creative project."
                  actionLabel="Explore studios"
                  actionHref="/studios"
                />
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Studio</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                    <TableRow key={booking._id ?? booking.id ?? booking.title}>
                      <TableCell>
                        <p className="font-semibold text-[#25221F]">
                          {booking.title ?? "Studio"}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-[#8A837C]">
                          <MapPin className="h-3 w-3" />
                          {booking.location ?? "Location not provided"}
                        </p>
                      </TableCell>
                      <TableCell>
                        {formatDate(
                          booking.bookingData?.bookingDate ??
                            booking.DataTime?.date ??
                            "Date unavailable",
                        )}
                      </TableCell>
                      <TableCell>
                        {booking.bookingData?.hourlyRate ??
                          booking.hourlyRate ??
                          "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {booking.status ?? "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}
