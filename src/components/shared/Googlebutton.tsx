"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient, signIn, useSession } from "@/lib/auth-client";

const GoogleButton = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { data: session, isPending: isSessionPending } = useSession();

  async function handleGoogleSignUp() {
    if (isGoogleLoading || isSessionPending) return;
    setIsGoogleLoading(true);

    try {
      const { error } = session
        ? await authClient.linkSocial({
            provider: "google",
            callbackURL: "/",
          })
        : await signIn.social({
            provider: "google",
            callbackURL: "/",
          });

      if (error) {
        toast.error("Google sign-in failed", {
          description: error.message || "Please try again.",
        });
      }
    } catch (error) {
      toast.error("Google sign-in failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      type="button"
      onClick={handleGoogleSignUp}
      disabled={isGoogleLoading || isSessionPending}
      className="mb-6 h-10 w-full gap-2 rounded-full border-gray-200 bg-white font-medium text-foreground shadow-sm hover:bg-gray-50"
    >
      {isGoogleLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <FcGoogle className="h-5 w-5" />
      )}
      {isGoogleLoading
        ? "Connecting..."
        : session
          ? "Link Google account"
          : "Continue with Google"}
    </Button>
  );
};

export default GoogleButton;
