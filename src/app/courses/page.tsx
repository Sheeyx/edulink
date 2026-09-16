"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CourseCard from "@/components/Course/CourseCard";
import CourseGridSkeleton from "@/components/Course/CourseGridSkeleton";
import { useCourses, type APICourse } from "@/hooks/useCourses";
import Pagination from "@/components/ui/Pagination";

import type { CourseFromApi } from "@/libs/types/course/types";
import { toCourseCardModel } from "@/libs/CourseMapper";
import { Lang, Level, Rating } from "./_libs/filter.types";
import CoursesFilters from "./_components/CoursesFilters";

const PAGE_LIMIT = 12;

export default function CoursesPage() {
  const [lang, setLang] = useState<Lang>("All");
  const [level, setLevel] = useState<Level>("All");
  const [rating, setRating] = useState<Rating>("All");
  const [page, setPage] = useState(1);

  // Any filter change invalidates the current page position.
  useEffect(() => {
    setPage(1);
  }, [lang, level, rating]);

  const input = useMemo(() => {
    return {
      page,
      limit: PAGE_LIMIT,
      language: lang === "All" ? undefined : lang,
      level: level === "All" ? undefined : level,
    };
  }, [page, lang, level]);

  const { data, isLoading } = useCourses(input);

  const list: APICourse[] = useMemo(() => {
    const raw = data?.list ?? [];
    return raw.filter((c) =>
      rating === "All"
        ? true
        : rating === "4.8+"
        ? (c.courseRating ?? 0) >= 4.8
        : (c.courseRating ?? 0) >= 4.5
    );
  }, [data, rating]);

  const totalPages = Math.max(1, Math.ceil((data?.metaCounter?.total ?? 0) / PAGE_LIMIT));

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-14 pb-20">
      {/* Header */}
      <div className="text-center mt-16 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Our Courses
        </h1>
        <p className="mt-2 text-gray-500">
          Discover thousands of courses from expert instructors and advance your
          skills today
        </p>
      </div>

      {/* Filters */}
      <CoursesFilters
        lang={lang}
        level={level}
        rating={rating}
        onLang={setLang}
        onLevel={setLevel}
        onRating={setRating}
        onReset={() => {
          setLang("All");
          setLevel("All");
          setRating("All");
        }}
      />

      {/* Grid */}
      {isLoading ? (
        <CourseGridSkeleton count={PAGE_LIMIT} />
      ) : list.length === 0 ? (
        <div className="mt-10 text-center text-gray-500">No courses found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {list.map((course, idx) => {
            const card = toCourseCardModel(course as unknown as CourseFromApi);

            return (
              <Link
                key={course?._id ?? idx}
                href={`/courses/${course._id}`}
                prefetch={false}
                aria-label={`Open course ${card.title}`}
                className="block h-full"
              >
                <CourseCard course={card} />
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-10">
        <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
      </div>
    </div>
  );
}
