"use client";

import { BookOpen } from "lucide-react";

export default function NotFoundState({
  onBack,
  onGoExplore,
}: {
  onBack: () => void;
  onGoExplore: () => void;
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-[0_10px_35px_rgba(99,99,160,0.08)]">
      <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100">
        <BookOpen className="w-7 h-7 text-purple-700" />
      </div>

      <h2 className="mt-4 text-2xl font-black text-gray-900">
        Course not found
      </h2>
      <p className="mt-1 text-gray-600">
        This course is not in your enrolled list.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onBack}
          className="rounded-2xl border border-gray-200 bg-white px-5 py-3 font-extrabold hover:bg-gray-50 transition"
        >
          Back to My Courses
        </button>
        <button
          onClick={onGoExplore}
          className="rounded-2xl bg-purple-700 text-white px-5 py-3 font-extrabold hover:bg-purple-800 transition"
        >
          Explore Courses
        </button>
      </div>
    </div>
  );
}
