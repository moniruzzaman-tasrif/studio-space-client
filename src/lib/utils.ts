export { cn } from "cn";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function apiUrl(path: string) {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return new URL(path, `${API_BASE_URL}/`).toString();
}
