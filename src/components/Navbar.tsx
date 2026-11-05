"use client";

import { Suspense, useState } from "react";
import {
  Building2,
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LuBox } from "react-icons/lu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { notifyError, notifySuccess } from "@/lib/notifications";
import { NAV_ITEMS } from "@/Data";

function getShortName(name?: string | null) {
  const parts = name?.trim().split(/\s+/).filter(Boolean);
  if (!parts?.length) return "US";
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

function NavigationLinks({ pathname }: { pathname: string | null }) {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <NavigationMenuItem key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "relative bg-transparent text-sm font-medium transition-colors hover:bg-transparent",
                  isActive
                    ? "text-[#F97316] hover:text-[#F97316]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#F97316]" />
                )}
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ActiveNavigationLinks() {
  const pathname = usePathname();
  return <NavigationLinks pathname={pathname} />;
}

export default function Navbar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { data, isPending } = useSession();
  const user = data?.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      const { error } = await signOut();
      if (error) {
        notifyError("Sign out failed.", error.message ?? "Please try again.");
        return;
      }

      notifySuccess("Signed out successfully.");
      router.push("/sign-in");
    } catch (error) {
      notifyError(
        "Sign out failed.",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between gap-2 px-3 sm:h-16 sm:px-6">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <LuBox className="h-5 w-5" />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            StudioSpace
          </span>
        </Link>

        <div className="hidden xl:block">
          <Suspense fallback={<NavigationLinks pathname={null} />}>
            <ActiveNavigationLinks />
          </Suspense>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={theme === "dark"}
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            aria-label={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {theme === "light" ? (
              <Sun aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Moon aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
          {isPending ? (
            <div
              aria-hidden="true"
              className="h-10 w-9 animate-pulse rounded-full bg-muted sm:w-36"
            />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex max-w-[190px] items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Avatar className="h-8 w-8 shrink-0 border border-border">
                  {user.image ? (
                    <AvatarImage
                      src={user.image}
                      alt={user.name || "User avatar"}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary text-xs font-bold tracking-wider text-primary-foreground">
                    {getShortName(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[130px] truncate text-sm font-semibold text-foreground sm:inline">
                  {user.name || "User"}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-60" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <span className="flex flex-col gap-1">
                      <span className="text-sm font-bold leading-none text-foreground">
                        {user.name || "User Account"}
                      </span>
                      <span className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </span>
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/add-studio")}
                    className="cursor-pointer"
                  >
                    <PlusCircle className="mr-2 h-4 w-4 text-primary" />
                    <span className="font-medium text-primary">
                      Add New Studio
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(`/my-listings`)}
                    className="cursor-pointer"
                  >
                    <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>My Studio Listings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(`/my-bookings/${user?.email}`)}
                    className="cursor-pointer"
                  >
                    <CalendarCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>My Bookings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-accent-foreground xl:inline-flex"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="hidden h-9 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 xl:inline-flex"
              >
                Sign up
              </Link>
            </>
          )}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary xl:hidden"
            >
              <Menu aria-hidden="true" className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,85vw)]">
              <SheetHeader>
                <SheetTitle>StudioSpace</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile navigation" className="flex flex-col gap-1 px-4">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <div className="my-2 border-t border-border" />
                    {[
                      ["Dashboard", "/dashboard"],
                      ["Add New Studio", "/add-studio"],
                      ["My Studio Listings", "/my-listings"],
                      ["My Bookings", `/my-bookings/${encodeURIComponent(user.email)}`],
                    ].map(([label, href]) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        {label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        void handleLogout();
                      }}
                      className="rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="my-2 border-t border-border" />
                    <Link
                      href="/sign-in"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
