import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, DollarSign } from "lucide-react";

import ConfrimBtn from "@/components/bookings/ConfromBtn";
import CancelBtn from "@/components/bookings/cancelBtn";

// Interface matching your exact API response item
interface BookingItem {
  _id: string;
  userName: string;
  userEmail: string;
  bookingData: {
    bookingDate: string;
    duration: string;
    startTime: string;
    endTime: string;
    hourlyRate: string;
    serviceFee: string;
    securityDeposit: string;
  };
  DataTime: {
    date: string;
    time: string;
  };
  title: string;
  category: string;
  location: string;
  imageUrl: string;
  hourlyRate: number;
  status?: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  refunded?: boolean;
}

const MyBookingPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  console.log(id);

  const res = await fetch(`http://localhost:5000/bookings/${id}`, {
    cache: "no-store",
  });
  const data: BookingItem[] = await res.json();
  console.log(data);

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            My Bookings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage all your studio reservations
          </p>
        </div>

        {/* Filter Tabs Header Bar */}
        <div className="flex items-center gap-2 border-b border-gray-200/60 pb-4">
          <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white shadow-sm">
            All ({data.length})
          </button>
          <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50">
            Upcoming (
            {
              data.filter(
                b =>
                  (b.status || "Pending") === "Confirmed" ||
                  (b.status || "Pending") === "Pending",
              ).length
            }
            )
          </button>
          <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50">
            Confirmed ({data.filter(b => b.status === "Confirmed").length})
          </button>
          <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50">
            Cancelled ({data.filter(b => b.status === "Cancelled").length})
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {!data || data.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No bookings found.
            </div>
          ) : (
            data.map(item => {
              // Default reservation status to "Pending" as per requirement
              const status = item.status || "Pending";

              // Calculate total price breakdown
              const rate = Number(
                item.bookingData?.hourlyRate || item.hourlyRate || 0,
              );
              const duration = Number(item.bookingData?.duration || 1);
              const serviceFee = Number(item.bookingData?.serviceFee || 0);
              const deposit = Number(item.bookingData?.securityDeposit || 0);
              const totalPrice = rate * duration + serviceFee + deposit;

              // Format date and time display strings
              const bookingDateStr =
                item.bookingData?.bookingDate || item.DataTime?.date || "N/A";
              const timeRangeStr =
                item.bookingData?.startTime && item.bookingData?.endTime
                  ? `${item.bookingData.startTime} - ${item.bookingData.endTime}`
                  : "Time specified upon booking";

              return (
                <Card
                  key={item._id}
                  className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 md:h-24 md:w-36">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 144px"
                          className="object-cover"
                        />
                      ) : (
                        <div
                          role="img"
                          aria-label={`No image available for ${item.title}`}
                          className="h-full w-full bg-gradient-to-br from-orange-50 to-stone-200"
                        />
                      )}
                    </div>

                    {/* Left Side: Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-gray-900">
                          {item.title}
                        </h3>

                        {/* Status Badges */}
                        {status === "Pending" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>{" "}
                            Pending
                          </span>
                        )}
                        {status === "Confirmed" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                            Confirmed
                          </span>
                        )}
                        {status === "Completed" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{" "}
                            Confirmed
                          </span>
                        )}
                        {status === "Cancelled" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-500 border border-rose-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>{" "}
                            Cancelled
                          </span>
                        )}
                      </div>

                      {/* Metadata Chips */}
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{item.location}</span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-[#FFF8F3] px-3 py-1 rounded-full text-[#E8612C]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{bookingDateStr}</span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-[#FFF8F3] px-3 py-1 rounded-full text-[#E8612C]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{timeRangeStr}</span>
                        </div>

                        <div className="flex items-center gap-1 bg-[#FFF8F3] px-3 py-1 rounded-full text-[#E8612C] font-semibold">
                          <DollarSign className="w-3 h-3 -mr-0.5" />
                          <span>{totalPrice}</span>
                          {item.refunded && (
                            <span className="text-emerald-600 text-[11px] font-medium ml-1">
                              Refunded
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Action Buttons */}
                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch md:items-end gap-2 shrink-0">
                      <Button
                        variant="outline"
                        className="h-9 px-4 rounded-xl text-xs font-semibold text-gray-700 border-gray-200 hover:bg-gray-50"
                      >
                        View Studio
                      </Button>

                      {/* Confirm Button added for Pending status */}
                      {status === "Pending" && (
                        <ConfrimBtn statusData={item._id}></ConfrimBtn>
                      )}

                      {status === "Pending" && (
                        <CancelBtn statusData={item._id}></CancelBtn>
                      )}

                      {(status === "Confirmed" || status === "Cancelled") && (
                        <Button
                          variant="outline"
                          className="h-9 px-4 rounded-xl text-xs font-semibold text-[#E8612C] border-[#E8612C]/20 hover:bg-[#E8612C]/5"
                        >
                          Book Again
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
export default MyBookingPage;
