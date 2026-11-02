"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

const GoogleButton = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);

    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: "/sign-in",
      });

      if (result.error) {
        toast.error("Google sign-in failed", {
          description:
            result.error.message ?? "Please try again in a moment.",
        });
        setIsGoogleLoading(false);
      }
    } catch (error) {
      toast.error("Google sign-in failed", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
      setIsGoogleLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isGoogleLoading}
      className="mb-6 h-10 w-full gap-2 rounded-full border-gray-200 bg-white font-medium text-foreground shadow-sm hover:bg-gray-50"
    >
      {isGoogleLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <FcGoogle className="h-5 w-5" />
      )}
      {isGoogleLoading ? "Connecting..." : "Continue with Google"}
    </Button>
  );
};

export default GoogleButton;
