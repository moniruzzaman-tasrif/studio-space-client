"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAF8F5] px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-[#E8612C]">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-600">
        We encountered an unexpected error while loading this page. Please try refreshing or return to the home page.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={() => reset()}
          className="gap-2 rounded-full bg-[#E8612C] px-5 font-semibold text-white hover:bg-[#d5521f]"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          variant="outline"
          className="gap-2 rounded-full border-gray-200 bg-white px-5 font-semibold hover:bg-gray-50"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </main>
  );
}
