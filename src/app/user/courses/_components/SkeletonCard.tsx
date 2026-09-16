"use client";

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(251,133,0,0.08)] overflow-hidden">
      <div className="h-32 bg-gray-100 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
        <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
        <div className="h-9 bg-gray-100 rounded-xl animate-pulse w-full" />
      </div>
    </div>
  );
}
