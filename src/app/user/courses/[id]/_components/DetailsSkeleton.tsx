"use client";

export default function DetailsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-10 w-1/2 bg-gray-100 rounded-2xl animate-pulse" />
      <div className="h-6 w-2/3 bg-gray-100 rounded-2xl animate-pulse" />

      <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-[0_10px_35px_rgba(99,99,160,0.08)]">
        <div className="h-52 bg-gray-100 animate-pulse" />
        <div className="p-6 space-y-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
          <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_10px_35px_rgba(99,99,160,0.08)]">
        <div className="h-6 bg-gray-100 rounded animate-pulse w-1/4" />
        <div className="mt-4 space-y-3">
          <div className="h-14 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-14 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-14 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
