export function getSafeCallbackURL(candidate: string | null): string {
  if (!candidate) return "/";

  try {
    const destination = new URL(candidate, window.location.origin);
    if (destination.origin !== window.location.origin) return "/";

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/";
  }
}
