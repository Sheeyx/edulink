"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-[0_8px_24px_rgba(251,133,0,0.08)]">
      <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/15">
        <BookOpen className="w-7 h-7 text-brand-selected" />
      </div>

      <h2 className="mt-4 text-2xl font-black text-gray-900">
        No enrolled courses yet
      </h2>
      <p className="mt-1 text-gray-600">
        Explore courses and enroll to start learning.
      </p>

      <Link
        href="/user/explore"
        className="inline-flex mt-5 items-center justify-center rounded-2xl bg-brand-selected text-white px-5 py-3 font-extrabold hover:brightness-90 transition"
      >
        Explore Courses
      </Link>
    </div>
  );
}
