"use client";

import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";

export default function CourseDetailsHeader({
  title,
  subtitle,
  onBack,
  onRefresh,
  refreshing,
  continueUrl,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onRefresh: () => void;
  refreshing?: boolean;
  continueUrl?: string | null;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Courses
        </button>

        <h1 className="mt-3 text-3xl md:text-4xl font-black text-gray-900 truncate">
          {title}
        </h1>

        {subtitle ? <p className="mt-1 text-gray-600 line-clamp-2">{subtitle}</p> : null}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {continueUrl ? (
          <Link
            href={continueUrl}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-selected text-white px-4 py-2 text-sm font-extrabold hover:brightness-90 transition"
          >
            <PlayCircle className="w-4 h-4" />
            Continue
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-2 rounded-2xl bg-gray-200 text-gray-600 px-4 py-2 text-sm font-extrabold cursor-not-allowed"
          >
            <PlayCircle className="w-4 h-4" />
            Continue
          </button>
        )}

        <button
          onClick={onRefresh}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold hover:bg-gray-50 transition"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </div>
  );
}
