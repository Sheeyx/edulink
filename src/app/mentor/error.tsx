"use client";

import { useEffect } from "react";
import ErrorFallback from "@/components/ui/ErrorFallback";

export default function MentorError({
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
      message="Something went wrong in your mentor dashboard. You can try again or head back to the dashboard."
      onRetry={reset}
      homeHref="/mentor"
      homeLabel="Back to dashboard"
    />
  );
}
