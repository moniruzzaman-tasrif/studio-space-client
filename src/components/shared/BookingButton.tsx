"use client"
 import React from "react";
import { Card, CardContent } from "../ui/card";
import { Star } from "lucide-react";
import { Button } from "@base-ui/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataType } from "@/itemType";
import { useSession } from "@/lib/auth-client";


const BookingButton = ({ data }: { data: DataType }) => {

 const {data:session,error}= useSession();
const user = session?.user;
const userData={

}

const { title, category, location, imageUrl,hourlyRate } = data;



  const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bookingData = Object.fromEntries(formData.entries()) ;

const date= new Date()
const DataTime={
  date: date.toDateString(),
  time:date.toTimeString().split(' ')[0]
}
console.log(DataTime);


    const res = await fetch("http://localhost:5000/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName:user?.name,
  userEmail:user?.email,
        bookingData,
        DataTime,
        title,
        category,
        location,
        imageUrl,
        hourlyRate,
      }),
    });
    const resData= await res.json();


console.log(resData);
    // console.log("Form Data Object:", bookingData, data);

  };
console.log(user);
  const hourlyRates = data.hourlyRate || 0;
  const securityDeposit = data.securityDeposit || 70;
  const serviceFee = 34;
  const duration = 4;
  const subtotal = hourlyRate * duration;
  const total = subtotal + serviceFee + securityDeposit;

  return (
    <div>
      <div className="lg:col-span-1 sticky top-6">
        <Card className="rounded-3xl border border-gray-200 bg-white shadow-md overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header Info */}
              <div className="flex items-baseline justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-2xl font-extrabold text-foreground">
                    ${hourlyRates}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {" "}
                    / hour
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                  <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  <span>4.5</span>
                </div>
              </div>

              {/* Date & Time Selectors */}
              <div className="grid grid-cols-2 gap-2 border border-gray-200 rounded-2xl p-3 text-xs bg-[#FAF8F5]">
                <div className="space-y-1 p-2 bg-white rounded-xl border border-gray-200">
                  <Label
                    htmlFor="bookingDate"
                    className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block"
                  >
                    Date
                  </Label>
                  <Input
                    id="bookingDate"
                    name="bookingDate"
                    type="date"
                    defaultValue="2026-11-15"
                    className="h-7 text-xs p-1 font-semibold border-none shadow-none focus-visible:ring-0"
                  />
                </div>

                <div className="space-y-1 p-2 bg-white rounded-xl border border-gray-200">
                  <Label
                    htmlFor="duration"
                    className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block"
                  >
                    Duration (hrs)
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    defaultValue={duration}
                    className="h-7 text-xs p-1 font-semibold border-none shadow-none focus-visible:ring-0"
                  />
                </div>

                <div className="space-y-1 p-2 bg-white rounded-xl border border-gray-200">
                  <Label
                    htmlFor="startTime"
                    className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block"
                  >
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    defaultValue="10:00"
                    className="h-7 text-xs p-1 font-semibold border-none shadow-none focus-visible:ring-0"
                  />
                </div>

                <div className="space-y-1 p-2 bg-white rounded-xl border border-gray-200">
                  <Label
                    htmlFor="endTime"
                    className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block"
                  >
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    defaultValue="14:00"
                    className="h-7 text-xs p-1 font-semibold border-none shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>

              {/* Pricing Details Fields */}
              <div className="space-y-2 border-t border-gray-100 pt-4 text-xs">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                  Pricing Details
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label
                      htmlFor="hourlyRate"
                      className="text-[10px] text-muted-foreground"
                    >
                      Rate ($)
                    </Label>
                    <Input
                      id="hourlyRate"
                      name="hourlyRate"
                      type="number"
                      defaultValue={hourlyRates}
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="serviceFee"
                      className="text-[10px] text-muted-foreground"
                    >
                      Service Fee ($)
                    </Label>
                    <Input
                      id="serviceFee"
                      name="serviceFee"
                      type="number"
                      defaultValue={serviceFee}
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="securityDeposit"
                      className="text-[10px] text-muted-foreground"
                    >
                      Deposit ($)
                    </Label>
                    <Input
                      id="securityDeposit"
                      name="securityDeposit"
                      type="number"
                      defaultValue={securityDeposit}
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Book Now Action Button */}
              <Button
                type="submit"
                className="w-full bg-[#E8612C] hover:bg-[#d5521f] text-white font-bold rounded-2xl h-12 shadow-sm text-base"
              >
                Book Now
              </Button>

              {/* Price Calculation Breakdown */}
              <div className="space-y-3 pt-2 text-xs text-muted-foreground border-t border-gray-100">
                <div className="flex justify-between">
                  <span>
                    ${hourlyRates} x {duration} hours
                  </span>
                  <span className="font-semibold text-foreground">
                    ${subtotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span className="font-semibold text-foreground">
                    ${serviceFee}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Security deposit</span>
                  <span className="font-semibold text-foreground">
                    ${securityDeposit}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 text-sm font-extrabold text-foreground">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              <p className="text-[11px] text-center text-muted-foreground pt-1">
                Free cancellation up to 24 hours before your booking.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingButton;
