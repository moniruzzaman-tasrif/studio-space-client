"use client";

import {
  Building2,
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  PlusCircle,
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
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
  { label: "Dashboard", href: "/dashboard" },
];

function getShortName(name?: string | null) {
  const parts = name?.trim().split(/\s+/).filter(Boolean);
  if (!parts?.length) return "US";
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isPending } = useSession();
  const user = data?.user;

  async function handleLogout() {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8612C] text-primary-foreground shadow-sm">
            <LuBox className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            StudioSpace
          </span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="gap-1">
            {navItems.map((item) => {
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
                        ? "text-[#E8612C] hover:text-[#E8612C]"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#E8612C]" />
                    )}
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          {isPending ? (
            <div
              aria-hidden="true"
              className="h-10 w-36 animate-pulse rounded-full bg-muted"
            />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex max-w-[190px] items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8612C]">
                <Avatar className="h-8 w-8 shrink-0 border border-gray-200">
                  <AvatarImage
                    src={user.image || ""}
                    alt={user.name || "User avatar"}
                  />
                  <AvatarFallback className="bg-[#E8612C] text-xs font-bold tracking-wider text-white">
                    {getShortName(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[130px] truncate text-sm font-semibold text-foreground">
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
                    <PlusCircle className="mr-2 h-4 w-4 text-[#E8612C]" />
                    <span className="font-medium text-[#E8612C]">
                      Add New Studio
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/my-listings")}
                    className="cursor-pointer"
                  >
                    <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>My Studio Listings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/my-bookings")}
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
                className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100 hover:text-accent-foreground"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-9 items-center justify-center rounded-full bg-[#E8612C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#d5521f]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
