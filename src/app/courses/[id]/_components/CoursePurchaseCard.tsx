"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Play, Loader2 } from "lucide-react";

import { gqlFetchAuth } from "@/libs/graphql";
import type { CourseDetail } from "./types";
import { normalizeImageSrc } from "./utils/images";
import { ENROLL_IN_COURSE } from "@/graphql/mutation/course/enrollInCourse";

export default function PurchaseCardInner({
  course,
  onPreview,
}: {
  course: CourseDetail;
  onPreview: () => void;
}) {
  const router = useRouter();
  const mediaImg = normalizeImageSrc(course.mediaImage);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isEnrolled = !!(course as any).isEnrolled; // ✅ vaqtincha (type qo‘shib olasan)

  async function handlePrimaryAction() {
    // ✅ already bought → go learn
    if (isEnrolled) {
      router.push(`/courses/${course.id}/learn`);
      return;
    }

    // ✅ not bought → enroll
    try {
      setLoading(true);
      setError(null);

      await gqlFetchAuth(ENROLL_IN_COURSE, {
        input: course.id,
      });

      // enroll bo‘lgach ham learning page’ga otkazamiz
      router.push(`/courses/${course.id}/learn`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-black/10 bg-white shadow-xl">
      {/* Preview */}
      <div className="relative aspect-video bg-slate-100">
        <Image
          src={mediaImg}
          alt={course.title}
          fill
          priority
          sizes="360px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <button
          onClick={onPreview}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Preview course"
          type="button"
        >
          <span className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition">
            <Play className="h-6 w-6 text-black ml-0.5" />
          </span>
        </button>
      </div>

      {/* Purchase */}
      <div className="p-5 text-slate-900">
        <div className="flex items-end gap-3">
          <div className="text-3xl font-extrabold">{course.price}</div>
          {course.oldPrice && (
            <div className="text-slate-400 line-through">{course.oldPrice}</div>
          )}
        </div>

        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

        <div className="mt-4 space-y-2">
          <button
            disabled
            className="w-full bg-slate-200 rounded-xl py-3 font-semibold text-slate-500 cursor-not-allowed"
          >
            Add to cart
          </button>

          <button
            onClick={handlePrimaryAction}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 rounded-xl py-3 font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading
              ? "Please wait..."
              : isEnrolled
              ? "Continue / Start learning"
              : "Buy now"}
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-500 text-center">
          30-Day Money-Back Guarantee
        </div>
      </div>
    </div>
  );
}
