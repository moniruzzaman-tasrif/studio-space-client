import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function getServerToken() {
  const tokenData = await auth.api.getToken({
    headers: await headers(),
  });
  const token = tokenData?.token;

  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  return token;
}
