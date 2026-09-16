"use client";

import { useEffect } from "react";
import ErrorFallback from "@/components/ui/ErrorFallback";

export default function RootError({
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
    <ErrorFallback
      title="Something went wrong"
      message="An unexpected error occurred. You can try again or head back home."
      onRetry={reset}
      homeHref="/"
    />
  );
}
