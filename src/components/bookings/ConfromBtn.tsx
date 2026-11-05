"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from '../ui/button';
import { apiUrl } from "@/lib/utils";


const ConfrimBtn =  ({ statusData }: { statusData:string}) => {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);


  const handelComfirm = async () => {
    setIsConfirming(true);
    try {
      const res = await fetch(apiUrl(`/bookings/${encodeURIComponent(statusData)}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Confirmed",
        }),
      });
      const resData = await res.json();

      if (!res.ok || resData.success === false) {
        toast.error(resData.message || "Could not confirm this booking.");
        return;
      }


      toast.success(resData.message || "Booking confirmed");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not confirm this booking.",
      );
    } finally {
      setIsConfirming(false);
    }
  };



  return (
    <div>
      <Button
        onClick={handelComfirm}
        variant="outline"
        className="h-9 px-4 rounded-xl text-xs font-semibold text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
      >
        {isConfirming ? "Confirming...":"Confirm"}
      </Button>
    </div>
  );
};

export default ConfrimBtn;
