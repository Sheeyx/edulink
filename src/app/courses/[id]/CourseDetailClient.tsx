"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Users, Globe, Clock3, Play, ShieldCheck, BadgeCheck } from "lucide-react";
import CourseContentAccordion from "@/app/components/courses/CourseContentAccordion";

type CourseDetail = {
  id: string;
  title: string;
  desc: any;
  rating: number;
  students: number;
  level: string;
  language: string;
  totalModules: number;
  totalLessons: number;
  price: string;
  oldPrice?: string;
  updatedAt?: string | null;
  instructor: { name: string; image: string | null };
  mediaImage: string | null;
};

type TabKey = "learn" | "content" | "reviews" | "instructor";

function normalizeImageSrc(src?: string | null) {
  const FALLBACK = "/images/courses/placeholder.jpg";
  if (!src) return FALLBACK;

  const s = String(src).trim();
  if (!s || s === "null" || s === "undefined") return FALLBACK;

  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return s;

  return `/${s.replace(/^\/+/, "")}`;
}

export default function CourseDetailClient({
  course,
  sections,
}: {
  course: CourseDetail;
  sections: any[];
}) {
  const [activeTab, setActiveTab] = React.useState<TabKey>("learn");

  const learnRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const reviewsRef = React.useRef<HTMLDivElement>(null);
  const instructorRef = React.useRef<HTMLDivElement>(null);

  const scrollTo = (key: TabKey) => {
    setActiveTab(key);
    const el =
      key === "learn"
        ? learnRef.current
        : key === "content"
          ? contentRef.current
          : key === "reviews"
            ? reviewsRef.current
            : instructorRef.current;

    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const rating = Number.isFinite(course.rating) ? course.rating : 0;
  const clampedRating = Math.max(0, Math.min(5, rating));
  const roundedStars = Math.round(clampedRating);

  const instructorImg = normalizeImageSrc(course.instructor?.image);
  const mediaImg = normalizeImageSrc(course.mediaImage);

  return (
    <div className="min-h-screen bg-white mt-15">
      {/* ===================== */}
      {/* 1) HERO (DARK) ONLY */}
      {/* ===================== */}
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-10 pb-10 h-120">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* LEFT HERO TEXT */}
            <div className="lg:col-span-2">
              <div className="text-xs text-white/60 mb-3">
                IT & Software <span className="mx-2">›</span> IT Certifications{" "}
                <span className="mx-2">›</span> {course.language}
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                {course.title}
              </h1>

              <p className="mt-4 text-white/75 text-base md:text-lg leading-relaxed">
                {course.desc}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-2">
                  <span className="font-semibold">{clampedRating.toFixed(1)}</span>
                  <span className="flex gap-1 text-amber-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4"
                        fill={i < roundedStars ? "currentColor" : "none"}
                      />
                    ))}
                  </span>
                  <span className="text-violet-300 underline underline-offset-2 cursor-pointer">
                    ({Math.max(0, Math.round(course.students / 40))} ratings)
                  </span>
                </span>

                <span className="text-white/60">•</span>

                <span className="flex items-center gap-2 text-white/80">
                  <Users className="h-4 w-4" />
                  {course.students.toLocaleString()} students
                </span>

                <span className="text-white/60">•</span>

                <span className="flex items-center gap-2 text-white/80">
                  <Globe className="h-4 w-4" />
                  {course.language}
                </span>

                {course.updatedAt && (
                  <>
                    <span className="text-white/60">•</span>
                    <span className="flex items-center gap-2 text-white/80">
                      <Clock3 className="h-4 w-4" />
                      Last updated {new Date(course.updatedAt).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/20">
                  <Image
                    src={instructorImg}
                    alt={course.instructor?.name || "Instructor"}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="text-sm">
                  <div className="text-white/60">Created by</div>
                  <div className="font-semibold">{course.instructor?.name || "Instructor"}</div>
                </div>
              </div>
            </div>

            {/* RIGHT STICKY CARD (OVERLAPS WHITE SECTION) */}
            <aside className="lg:col-span-1 lg:sticky lg:top-24">
              {/* This negative margin makes it overlap the white section like screenshot */}
              <div className="lg:-mb-24">
                <div className="rounded-2xl overflow-hidden border border-black/10 bg-white shadow-xl">
                  {/* Preview */}
                  <div className="relative aspect-video bg-slate-100">
                    <Image
                      src={mediaImg}
                      alt={course.title}
                      fill
                      priority
                      sizes="(min-width: 1024px) 360px, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/25" />
                    <button
                      onClick={() => scrollTo("content")}
                      className="absolute inset-0 flex items-center justify-center"
                      aria-label="Preview course"
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
                        <div className="text-slate-400 line-through">{course.oldPrice}</div>
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
                      <div className="text-sm font-semibold mb-3">This course includes:</div>
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

                    {/* Coupon */}
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

                <div className="mt-3 text-xs text-white/50 text-center lg:text-left">
                  Secure checkout • Instant access
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ===================== */}
      {/* 2) BODY (WHITE) BELOW */}
      {/* ===================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT CONTENT */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="border-b flex gap-6 text-sm">
                <TabButton active={activeTab === "learn"} onClick={() => scrollTo("learn")}>
                  What you’ll learn
                </TabButton>
                <TabButton active={activeTab === "content"} onClick={() => scrollTo("content")}>
                  Curriculum
                </TabButton>
                <TabButton active={activeTab === "reviews"} onClick={() => scrollTo("reviews")}>
                  Reviews
                </TabButton>
                <TabButton active={activeTab === "instructor"} onClick={() => scrollTo("instructor")}>
                  Instructor
                </TabButton>
              </div>

              {/* Learn */}
              <div ref={learnRef} className="pt-8 scroll-mt-24">
                <h2 className="text-2xl font-extrabold text-slate-900">What you’ll learn</h2>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                    <li>✅ Python basics</li>
                    <li>✅ Data types & operators</li>
                    <li>✅ Lists, tuples, dicts</li>
                    <li>✅ Loops</li>
                    <li>✅ Functions</li>
                    <li>✅ Exceptions</li>
                  </ul>
                </div>
              </div>

              {/* Curriculum */}
              <div ref={contentRef} className="pt-10 scroll-mt-24">
                <h2 className="text-2xl font-extrabold text-slate-900">Course content</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {course.totalModules} sections • {course.totalLessons} lectures
                </p>

                <CourseContentAccordion sections={sections} />

              </div>

              {/* Reviews */}
              <div ref={reviewsRef} className="pt-10 scroll-mt-24">
                <h2 className="text-2xl font-extrabold text-slate-900">Reviews</h2>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                  Reviews UI goes here.
                </div>
              </div>

              {/* Instructor */}
              <div ref={instructorRef} className="pt-10 scroll-mt-24">
                <h2 className="text-2xl font-extrabold text-slate-900">Instructor</h2>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 flex items-center gap-4">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden border">
                    <Image
                      src={instructorImg}
                      alt={course.instructor?.name || "Instructor"}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{course.instructor?.name || "Instructor"}</div>
                    <div className="text-sm text-slate-600">Mentor / Instructor</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT EMPTY SPACE (because card is in HERO and overlaps) */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-4 border-b-2 -mb-px font-semibold transition ${
        active
          ? "border-violet-600 text-violet-700"
          : "border-transparent text-slate-500 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}
