"use client";

import * as React from "react";
import Image from "next/image";
import { Play, ShieldCheck, BadgeCheck } from "lucide-react";
import type { CourseDetail } from "./types";
import { normalizeImageSrc } from "./utils/images";

/* ───────────────────────────────────────────── */

export default function CoursePurchaseCard({
  course,
  onPreview,
}: {
  course: CourseDetail;
  onPreview: () => void;
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isStopped, setIsStopped] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const footer = document.querySelector("footer");
      const card = cardRef.current;

      if (!footer || !card) return;

      const footerTop = footer.getBoundingClientRect().top;
      const cardHeight = card.offsetHeight;

      // 24px = top offset
      if (footerTop <= cardHeight + 24) {
        setIsStopped(true);
      } else {
        setIsStopped(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <aside className="lg:col-span-1 relative">
      {/* DESKTOP */}
      <div
        ref={cardRef}
        className={`
          hidden lg:block
          w-[360px]
          z-30
          ${isStopped ? "absolute bottom-0" : "fixed top-24"}
          right-[calc(50%-640px)]
        `}
      >
        <PurchaseCardInner course={course} onPreview={onPreview} />
      </div>
    </aside>
  );
}

/* ───────────────────────────────────────────── */

function PurchaseCardInner({
  course,
  onPreview,
}: {
  course: CourseDetail;
  onPreview: () => void;
}) {
  const mediaImg = normalizeImageSrc(course.mediaImage);

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
          <span className="h-14 w-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition">
            <Play className="h-6 w-6 text-black ml-0.5" />
          </span>
        </button>
        <div className="absolute bottom-3 left-3 text-xs text-white/90">
          Preview this course
        </div>
      </div>

      {/* Purchase */}
      <div className="p-5 text-slate-900">
        <div className="flex items-end gap-3">
          <div className="text-3xl font-extrabold">{course.price}</div>
          {course.oldPrice && (
            <div className="text-slate-400 line-through">
              {course.oldPrice}
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <button className="w-full bg-violet-600 hover:bg-violet-700 rounded-xl py-3 font-semibold text-white">
            Add to cart
          </button>
          <button className="w-full border border-slate-200 rounded-xl py-3 font-semibold hover:bg-slate-50">
            Buy now
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-500 text-center">
          30-Day Money-Back Guarantee
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold mb-3">
            This course includes:
          </div>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <Play className="h-4 w-4" /> On-demand video
            </li>
            <li className="flex gap-2">
              <ShieldCheck className="h-4 w-4" /> Full lifetime access
            </li>
            <li className="flex gap-2">
              <BadgeCheck className="h-4 w-4" /> Certificate of completion
            </li>
          </ul>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs text-slate-500 mb-2">Apply coupon</div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter coupon"
            />
            <button className="rounded-lg bg-slate-900 text-white px-4 text-sm font-semibold hover:bg-slate-800">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
