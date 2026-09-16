"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-[0_8px_24px_rgba(99,99,160,0.08)]">
            <h2 className="text-xl font-black text-gray-900">
              The app hit an unexpected error
            </h2>
            <p className="mt-1.5 text-sm text-gray-600">
              Please try again. If this keeps happening, refresh the page.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={reset}
                className="rounded-2xl bg-brand-selected px-5 py-2.5 text-sm font-extrabold text-white transition hover:brightness-90"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
