"use client";

import { Star } from "lucide-react";

export default function RatingRow({ rating }: { rating?: number | null }) {
  const r = typeof rating === "number" ? Math.max(0, Math.min(5, rating)) : 0;

  return (
    <div className="flex items-center gap-1 text-xs text-gray-700">
      <Star className="w-3.5 h-3.5" />
      <span className="font-semibold">{r ? r.toFixed(1) : "—"}</span>
      <span className="text-gray-400">/5</span>
    </div>
  );
}
