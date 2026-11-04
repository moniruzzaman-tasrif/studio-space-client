import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#101C18] text-[#F4F1E8] font-sans pt-16 pb-8 border-t border-[#1D3028]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1D3028]">
        {/* 1. Brand & Mission Statement (Span 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-4">
          <Link
            href="/"
            className="inline-block text-2xl font-serif font-bold tracking-tight text-white"
          >
            Studio<span className="text-[#C47B55]">Space</span>
          </Link>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Empowering creators, photographers, podcasters, and artists with
            seamless access to professional-grade creative spaces worldwide.
            Book your vision to life.
          </p>

          {/* Contact snippets */}
          <div className="space-y-2 pt-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C47B55]" />
              <span>57 Grand Street, Brooklyn, NY</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C47B55]" />
              <span>support@studiospace.com</span>
            </div>
          </div>
        </div>

        {/* 2. Quick Navigation Links */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-[#C47B55] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/studios"
                className="hover:text-[#C47B55] transition-colors"
              >
                Explore Studios
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-[#C47B55] transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-[#C47B55] transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* 3. Popular Studio Categories */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            Categories
          </h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li>
              <Link
                href="/studios?category=Photo+Studios"
                className="hover:text-[#C47B55] transition-colors"
              >
                Photo Studios
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Sound+Stages"
                className="hover:text-[#C47B55] transition-colors"
              >
                Sound Stages
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Podcast+Rooms"
                className="hover:text-[#C47B55] transition-colors"
              >
                Podcast Rooms
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Music+Suites"
                className="hover:text-[#C47B55] transition-colors"
              >
                Music Suites
              </Link>
            </li>
            <li>
              <Link
                href="/studios?category=Art+Workshops"
                className="hover:text-[#C47B55] transition-colors"
              >
                Art Workshops
              </Link>
            </li>
          </ul>
        </div>

        {/* 4. Newsletter Signup */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
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
                className="bg-[#1D3028] border-none text-white placeholder:text-gray-500 text-xs h-10 rounded-xl pr-10 focus-visible:ring-1 focus-visible:ring-[#C47B55]"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 bg-[#C47B55] hover:bg-[#b06c4b] text-white rounded-lg"
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
            &copy; {new Date().getFullYear()} StudioSpace Inc. All rights
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
            className="hover:text-white transition-colors"
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
            className="hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </Link>

          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </Link>

          <Link
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="YouTube"
          >
            <Youtube className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
