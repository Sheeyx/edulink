"use client";

import { useState } from "react";
import { FiMenu, FiX, FiShoppingCart, FiGlobe } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import UserInfo from "../User/UserInfo";
import { useAuth } from "@/providers/auth-context";
import { useCart } from "@/providers/cart-context";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, ready } = useAuth();
  const { count: cartCount } = useCart();

  return (
    <nav className="w-full fixed top-0 bg-white shadow z-50">
      <div className="relative max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo/logo.jpeg"
            alt="Hubee"
            width={36}
            height={36}
            className="rounded-lg"
            priority
          />
          <span className="text-2xl font-bold text-brand-primary">Hubee</span>
        </Link>

        {/* Desktop Links — absolutely centered so it never shifts with the
            logo/right-side widths (e.g. skeleton vs. real content swap) */}
        {!ready ? (
          <div
            className="hidden md:flex items-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-14 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        ) : (
          <div className="hidden md:flex gap-6 text-gray-700 font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="hover:text-brand-primary">Home</Link>
            <Link href="/courses" className="hover:text-brand-primary">Courses</Link>
            <Link href="/blog" className="hover:text-brand-primary">Blog</Link>
            <Link href="/about" className="hover:text-brand-primary">About</Link>
            <Link href="/contact" className="hover:text-brand-primary">Contact</Link>
          </div>
        )}

        {/* Right-side */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            href="/cart"
            title="Cart"
            aria-label={`Cart${cartCount > 0 ? `, ${cartCount} item${cartCount === 1 ? "" : "s"}` : ""}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-brand-primary/10 hover:text-brand-primary"
          >
            <FiShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-selected px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {!ready ? (
            <div className="flex items-center gap-3" aria-hidden="true">
              <div className="h-9 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-9 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          ) : user ? (
            <UserInfo />
          ) : (
            <>
              <Link href="/auth/login" className="px-4 py-2 border border-brand-primary text-brand-primary font-semibold rounded hover:bg-brand-primary/10">Log in</Link>
              <Link href="/auth/register" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded hover:bg-brand-selected">Sign up</Link>
            </>
          )}

          <button
            type="button"
            title="Language"
            aria-label="Language"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-primary text-brand-primary transition hover:bg-brand-primary/10"
          >
            <FiGlobe className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-2xl text-brand-primary" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 py-4 space-y-4 bg-white shadow-lg">
          {!ready ? (
            <div className="space-y-3" aria-hidden="true">
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-14 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          ) : (
            <>
              <Link href="/" className="block text-gray-700 hover:text-brand-primary">Home</Link>
              <Link href="/courses" className="block text-gray-700 hover:text-brand-primary">Courses</Link>
              <Link href="/blog" className="block text-gray-700 hover:text-brand-primary">Blog</Link>
              <Link href="/about" className="block text-gray-700 hover:text-brand-primary">About</Link>
              <Link href="/contact" className="block text-gray-700 hover:text-brand-primary">Contact</Link>
              <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-brand-primary">
                Cart{cartCount > 0 ? ` (${cartCount})` : ""}
              </Link>
            </>
          )}

          <div className="pt-4 border-t space-y-2">
            {!ready ? (
              <div className="space-y-2" aria-hidden="true">
                <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
              </div>
            ) : user ? (
              <UserInfo />
            ) : (
              <>
                <Link href="/auth/login" className="block text-brand-primary border border-brand-primary rounded px-4 py-2 text-center">Log in</Link>
                <Link href="/auth/register" className="block bg-brand-primary text-white rounded px-4 py-2 text-center">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
