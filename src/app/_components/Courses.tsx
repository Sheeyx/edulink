"use client";

import Link from "next/link";
import CourseCard from "@/components/Course/CourseCard";
import CourseGridSkeleton from "@/components/Course/CourseGridSkeleton";
import { useCourses, type APICourse } from "@/hooks/useCourses";
import type { CourseFromApi } from "@/libs/types/course/types";
import { toCourseCardModel } from "@/libs/CourseMapper";

const TEASER_LIMIT = 8;

export default function CourseGrid() {
  const { data, isLoading } = useCourses({ page: 1, limit: TEASER_LIMIT });
  const list: APICourse[] = data?.list ?? [];

  return (
    <section className="px-6 md:px-16 py-12 bg-white">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-extrabold text-gray-900">Our Courses</h2>
        <Link
          href="/courses"
          className="text-sm font-semibold text-brand-primary hover:text-brand-selected"
        >
          View all courses →
        </Link>
      </div>

      {isLoading ? (
        <CourseGridSkeleton count={TEASER_LIMIT} />
      ) : list.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No courses available yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center">
          {list.map((course) => (
            <CourseCard
              key={course._id}
              course={toCourseCardModel(course as unknown as CourseFromApi)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
