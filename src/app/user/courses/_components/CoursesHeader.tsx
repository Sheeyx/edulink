"use client";

import { ArrowLeft } from "lucide-react";

type Props = {
  onBack: () => void;
  onRefresh: () => void;
  refreshing?: boolean;
};

export default function CoursesHeader({ onBack, onRefresh, refreshing }: Props) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="mt-3 text-3xl md:text-4xl font-black text-gray-900">
          My Courses
        </h1>
        <p className="mt-1 text-gray-600">
          All courses you enrolled in — continue anytime.
        </p>
      </div>

      <button
        onClick={onRefresh}
        className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold hover:bg-gray-50 transition"
      >
        {refreshing ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
}
