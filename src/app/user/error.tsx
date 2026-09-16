"use client";

import { useEffect } from "react";
import ErrorFallback from "@/components/ui/ErrorFallback";

export default function UserError({
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
      title="Couldn't load this page"
      message="Something went wrong. You can try again or head back to your dashboard."
      onRetry={reset}
      homeHref="/user"
      homeLabel="Back to dashboard"
    />
  );
}
