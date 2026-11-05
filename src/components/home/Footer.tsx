"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MapPin,
  Mail,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

const getCurrentYear = () => String(new Date().getFullYear());
const getServerYear = () => "2026";

export default function Footer() {
  const currentYear = useSyncExternalStore(
    () => () => {},
    getCurrentYear,
    getServerYear,
  );

  return (
    <footer className="border-t border-border bg-background pt-16 pb-8 font-sans text-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 border-b border-border px-6 pb-12 md:grid-cols-2 lg:grid-cols-5">
        {/* 1. Brand & Mission Statement (Span 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-4">
          <Link
            href="/"
            className="inline-block text-2xl font-serif font-bold tracking-tight text-foreground"
          >
            Studio            <span className="text-primary">Space</span>
          </Link>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Empowering creators, photographers, podcasters, and artists with
            seamless access to professional-grade creative spaces worldwide.
            Book your vision to life.
          </p>

          {/* Contact snippets */}
          <div className="space-y-2 pt-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>57 Grand Street, Brooklyn, NY</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>support@studiospace.com</span>
            </div>
          </div>
        </div>

        {/* 2. Quick Navigation Links */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li>
              <Link href="/" className="transition-colors hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/explore"
                className="transition-colors hover:text-primary"
              >
                Explore Studios
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="transition-colors hover:text-primary"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* 3. Popular Studio Categories */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Categories
          </h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li>
              <Link
                href="/studios?category=Photo+Studios"
                className="transition-colors hover:text-primary"
              >
                Photo Studios
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Sound+Stages"
                className="transition-colors hover:text-primary"
              >
                Sound Stages
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Podcast+Rooms"
                className="transition-colors hover:text-primary"
              >
                Podcast Rooms
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Music+Suites"
                className="transition-colors hover:text-primary"
              >
                Music Suites
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Art+Workshops"
                className="transition-colors hover:text-primary"
              >
                Art Workshops
              </Link>
            </li>
          </ul>
        </div>

        {/* 4. Newsletter Signup */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Stay Inspired
          </h4>
          <p className="text-xs text-gray-400">
            Subscribe to get exclusive studio drops and creative tips.
          </p>
          <form onSubmit={e => e.preventDefault()} className="space-y-2">
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-10 rounded-xl border border-border bg-card pr-10 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Bar: Copyright, Terms & Social Links (including X logo) */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        {/* Copyright & Legal */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
          <p>
            &copy; {currentYear} StudioSpace Inc. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Social Media Links with Modern X Logo */}
        <div className="flex items-center gap-4 text-gray-400">
          {/* X (formerly Twitter) Logo */}
          <Link
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="X"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </Link>

          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="Instagram"
          >
            <FaInstagram className="w-4 h-4" />
          </Link>

          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-4 h-4" />
          </Link>

          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="Facebook"
          >
            <FaFacebook className="w-4 h-4" />
          </Link>

          <Link
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="YouTube"
          >
            <FaYoutube className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
