import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAF8F5] px-4 text-center">
      <p className="text-sm font-semibold text-[#E8612C]">404</p>
      <h1 className="mt-2 text-3xl font-serif font-bold text-gray-900">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-[#E8612C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d65320]"
      >
        Back to home
      </Link>
    </main>
  );
}
