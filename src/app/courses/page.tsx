// app/courses/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CourseCard from "@/components/Course/CourseCard";
import { useInfiniteCourses } from "@/hooks/useInfiniteCourses";

/** UI model expected by <CourseCard /> */
type UICourse = {
  image: string;
  title: string;
  subtitle: string;
  instructor: string;
  price: string;    // stringified & formatted
  oldPrice: string; // MUST be string (can be empty)
  rating: number;
  ratingCount: number;
  hours: string;
  lectures: number;
  level: string;
};

type Lang = "All" | "English" | "TOPIK";
type Level = "All" | "Beginner" | "Intermediate" | "Advanced";
type Rating = "All" | "4.5+" | "4.8+";

/** Format price → always string */
function formatPrice(n?: number | string) {
  if (n === undefined || n === null || n === "") return "₩0";
  const num = typeof n === "string" ? Number(n) : n;
  return Number.isNaN(num) ? String(n) : `₩${num.toLocaleString()}`;
}

/** API → Card model (no extra keys) */
function toCardModel(c: any): UICourse {
  const priceStr = formatPrice(c.coursePrice);
  const oldPriceStr = c.courseOldPrice ? formatPrice(c.courseOldPrice) : "";

  return {
    image: c.coverImage || c.memberData?.memberImage || "/images/courses/placeholder.jpg",
    title: c.courseTitle ?? "",
    subtitle: c.courseDesc ?? "",
    instructor: c.memberData?.memberFullName ?? "Instructor",
    price: priceStr,
    oldPrice: oldPriceStr,
    rating: c.courseRating ?? 0,
    ratingCount: c.courseLikes ?? 0,
    hours: String(c.courseTotalLessons ?? ""), // if your card expects "12h", convert at source
    lectures: c.courseTotalLessons ?? 0,
    level: c.courseLevel ?? "Beginner",
  };
}

export default function CoursesPage() {
  const [lang, setLang] = useState<Lang>("All");
  const [level, setLevel] = useState<Level>("All");
  const [rating, setRating] = useState<Rating>("All");

  // Build hook input from filters
  // NOTE: If your backend expects enum names (e.g., ENGLISH / TOPIK) or different keys (languageType, courseLevel),
  // map them here before passing to the hook.
  const input = useMemo(() => {
    return {
      limit: 5,
      language: lang === "All" ? undefined : lang, // map to languageType/enum if needed
      level: level === "All" ? undefined : level,  // map to courseLevel/enum if needed
    };
  }, [lang, level]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteCourses(input);

  // Flatten pages and apply rating filter on the client
  const all = useMemo(() => {
    const flat = data?.pages.flatMap((p: any) => p.list) ?? [];
    return flat.filter((c: any) =>
      rating === "All"
        ? true
        : rating === "4.8+"
        ? (c.courseRating ?? 0) >= 4.8
        : (c.courseRating ?? 0) >= 4.5
    );
  }, [data, rating]);

  const pillsBase =
    "px-4 py-2 rounded-full text-sm border transition font-medium";
  const pillsActive = "bg-violet-600 text-white border-violet-600 shadow";
  const pillsIdle = "bg-white text-gray-700 border-gray-200 hover:bg-gray-50";

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-14 pb-20">
      {/* Header */}
      <div className="text-center mt-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Our Courses</h1>
        <p className="mt-2 text-gray-500">
          Discover thousands of courses from expert instructors and advance your skills today
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => {
            setLang("All");
            setLevel("All");
            setRating("All");
          }}
          className={`${pillsBase} ${
            lang === "All" && level === "All" && rating === "All"
              ? pillsActive
              : pillsIdle
          }`}
        >
          All Courses
        </button>

        <button
          onClick={() => setLang("English")}
          className={`${pillsBase} ${lang === "English" ? pillsActive : pillsIdle}`}
        >
          English
        </button>

        <button
          onClick={() => setLang("TOPIK")}
          className={`${pillsBase} ${lang === "TOPIK" ? pillsActive : pillsIdle}`}
        >
          Korean
        </button>

        <button
          onClick={() => setLevel("All")}
          className={`${pillsBase} ${level === "All" ? pillsActive : pillsIdle}`}
        >
          All Levels
        </button>

        <button
          onClick={() => setRating("All")}
          className={`${pillsBase} ${rating === "All" ? pillsActive : pillsIdle}`}
        >
          All Ratings
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="mt-10 text-center text-gray-500">Loading…</div>
      ) : all.length === 0 ? (
        <div className="mt-10 text-center text-gray-500">No courses found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {all.map((course: any, idx: number) => {
            const card = toCardModel(course);
            return (
              <Link
                key={course?._id ?? idx}
                href={`/courses/${course._id}`} // keep only id if your detail route is [id]
                prefetch={false}
                aria-label={`Open course ${card.title}`}
              >
                <CourseCard course={card} />
              </Link>
            );
          })}
        </div>
      )}

      {/* Load more */}
      {hasNextPage && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm disabled:opacity-60"
          >
            {isFetchingNextPage ? "Loading…" : "Load More Courses"}
          </button>
        </div>
      )}
    </div>
  );
}
