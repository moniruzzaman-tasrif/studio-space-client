"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from '../ui/button';
import { apiUrl } from "@/lib/utils";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { getClientToken } from "@/lib/tokenClient";


const ConfrimBtn =  ({ statusData }: { statusData:string}) => {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);


  const handelComfirm = async () => {
    setIsConfirming(true);
    try {
      const token = await getClientToken();
      const res = await fetch(apiUrl(`/bookings/${encodeURIComponent(statusData)}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "Confirmed",
        }),
      });
      const resData = await res.json();

      if (!res.ok || resData.success === false) {
        notifyError(resData.message || "Could not confirm this booking.");
        return;
      }


      notifySuccess(resData.message || "Booking confirmed.");
      router.refresh();
    } catch (error) {
      notifyError(
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
        disabled={isConfirming}
        variant="outline"
        className="h-9 px-4 rounded-xl text-xs font-semibold text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
      >
        {isConfirming ? (
          <>
            <LoaderCircle aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
            Confirming...
          </>
        ) : (
          "Confirm"
        )}
      </Button>
    </div>
  );
};

export default ConfrimBtn;
