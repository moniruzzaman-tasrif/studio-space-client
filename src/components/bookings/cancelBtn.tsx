"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

const CancelBtn = ({ statusData }: { statusData: string }) => {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      const res = await fetch(`http://localhost:5000/bookings/${statusData}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Cancelled",
        }),
      });
      const resData = await res.json();

      if (!res.ok || resData.success === false) {
        toast.error(resData.message || "Could not cancel this booking.");
        return;
      }

      toast.success(resData.message || "Booking cancelled");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not cancel this booking.",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleCancelBooking}
        disabled={isCancelling}
        variant="outline"
        className="h-9 px-4 rounded-xl text-xs font-semibold text-rose-500 border-rose-100 hover:bg-rose-50 hover:text-rose-600"
      >
        {isCancelling ? "Cancelling..." : "Cancel Booking"}
      </Button>
    </div>
  );
};

export default CancelBtn;
