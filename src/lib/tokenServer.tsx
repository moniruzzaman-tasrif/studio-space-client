import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function getServerToken(): Promise<string | null> {
  try {
    const tokenData = await auth.api.getToken({
      headers: await headers(),
    });
    return tokenData?.token ?? null;
  } catch {
    return null;
  }
}
