"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Loader2 } from "lucide-react";

import { useAuth } from "@/providers/auth-context";
import { useCart } from "@/providers/cart-context";
import { gqlFetchAuth } from "@/libs/graphql";
import { ENROLL_IN_COURSE } from "@/graphql/mutation/course/enrollInCourse";
import { formatPrice } from "@/libs/format";

export default function CartPage() {
  const router = useRouter();
  const { user, ready: authReady } = useAuth();
  const { items, total, ready: cartReady, removeItem, clear } = useCart();

  const [checkingOut, setCheckingOut] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCheckout() {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (items.length === 0) return;

    setCheckingOut(true);
    setError(null);

    const failures: string[] = [];

    for (const item of items) {
      try {
        await gqlFetchAuth(ENROLL_IN_COURSE, { input: item.id });
      } catch (err) {
        // Already-enrolled (or similar) shouldn't block the rest of the cart.
        failures.push(item.title);
        console.error(`[cart] enroll failed for "${item.title}":`, err);
      }
    }

    setCheckingOut(false);

    if (failures.length === items.length) {
      setError("Checkout failed. Please try again.");
      return;
    }

    clear();
    router.push("/user/courses");
  }

  const loading = !authReady || !cartReady;

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 pt-28 pb-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-primary/10">
            <ShoppingCart className="h-7 w-7 text-brand-selected" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-1 text-gray-600">
            Browse our courses and add the ones you&apos;d like to enroll in.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white hover:bg-brand-selected transition"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.title} from cart`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                {items.length} course{items.length === 1 ? "" : "s"}
              </span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3 font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-3 font-semibold text-white transition hover:bg-brand-selected disabled:opacity-70"
            >
              {checkingOut && <Loader2 className="h-4 w-4 animate-spin" />}
              {checkingOut ? "Enrolling..." : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
