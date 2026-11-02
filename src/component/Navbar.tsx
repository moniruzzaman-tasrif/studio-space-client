"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuBox } from "react-icons/lu";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Explore", href: "/explore" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About", href: "/about" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8612C] text-primary-foreground shadow-sm">
            <LuBox className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            StudioSpace
          </span>
        </Link>

        {/* Pure shadcn/ui Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="gap-1">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
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
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8612C] rounded-full" />
                      )}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Pure shadcn/ui Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200
text-black
            hover:text-accent-foreground"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center rounded-full bg-[#E8612C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#d5521f]"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
