"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";

export default function EmptyAssignments() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-[0_8px_24px_rgba(99,99,160,0.08)]">
      <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100">
        <ClipboardList className="w-7 h-7 text-purple-700" />
      </div>

      <h2 className="mt-4 text-2xl font-black text-gray-900">
        No assignments yet
      </h2>
      <p className="mt-1 text-gray-600">
        Enroll in a course to see assignments from your mentors here.
      </p>

      <Link
        href="/user/courses"
        className="inline-flex mt-5 items-center justify-center rounded-2xl bg-purple-700 text-white px-5 py-3 font-extrabold hover:bg-purple-800 transition"
      >
        Go to My Courses
      </Link>
    </div>
  );
}
