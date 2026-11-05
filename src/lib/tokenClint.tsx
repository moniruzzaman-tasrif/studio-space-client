"use client";

import { authClient } from "./auth-client";

export async function getClientToken() {
  const { data, error } = await authClient.token();

  if (error) {
    throw new Error(error.message || "Unable to retrieve your authentication token.");
  }

  const token = data?.token;
  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  return token;
}
