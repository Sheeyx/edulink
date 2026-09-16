"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  homeHref?: string;
  homeLabel?: string;
};

export default function ErrorFallback({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  homeHref = "/",
  homeLabel = "Go home",
}: Props) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-[0_8px_24px_rgba(99,99,160,0.08)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-rose-100 bg-rose-50">
          <AlertTriangle className="h-7 w-7 text-rose-600" />
        </div>

        <h2 className="mt-4 text-xl font-black text-gray-900">{title}</h2>
        <p className="mt-1.5 text-sm text-gray-600">{message}</p>

        <div className="mt-6 flex items-center justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-2xl bg-brand-selected px-5 py-2.5 text-sm font-extrabold text-white transition hover:brightness-90"
            >
              Try again
            </button>
          )}
          <Link
            href={homeHref}
            className="rounded-2xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
