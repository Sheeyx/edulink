"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CourseCard from "@/components/Course/CourseCard";
import { useInfiniteCourses } from "@/hooks/useInfiniteCourses";

import type { CourseFromApi } from "@/libs/types/course/types";
import { toCourseCardModel } from "@/libs/CourseMapper";
import { Lang, Level, Rating } from "./libs/filter.types";

export default function CoursesPage() {
  const [lang, setLang] = useState<Lang>("All");
  const [level, setLevel] = useState<Level>("All");
  const [rating, setRating] = useState<Rating>("All");

  const input = useMemo(() => {
    return {
      limit: 5,
      language: lang === "All" ? undefined : lang, // map to LanguageType if backend expects enum
      level: level === "All" ? undefined : level,  // map to CourseLevel if backend expects enum
    };
  }, [lang, level]);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteCourses(input);

  const all = useMemo(() => {
    const flat: CourseFromApi[] = data?.pages.flatMap((p: any) => p.list) ?? [];
    return flat.filter((c) =>
      rating === "All"
        ? true
        : rating === "4.8+"
        ? (c.courseRating ?? 0) >= 4.8
        : (c.courseRating ?? 0) >= 4.5
    );
  }, [data, rating]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-14 pb-20">
      {/* Header */}
      <div className="text-center mt-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Our Courses
        </h1>
        <p className="mt-2 text-gray-500">
          Discover thousands of courses from expert instructors and advance your
          skills today
        </p>
      </div>

      {/* Filters (same UI as you have now) */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* ... keep your filter pills unchanged ... */}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="mt-10 text-center text-gray-500">Loading…</div>
      ) : all.length === 0 ? (
        <div className="mt-10 text-center text-gray-500">No courses found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {all.map((course, idx) => {
            const card = toCourseCardModel(course);

            return (
              <Link
                key={course?._id ?? idx}
                href={`/courses/${course._id}`}
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
