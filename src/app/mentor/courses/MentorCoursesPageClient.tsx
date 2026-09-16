"use client";

import * as React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import CourseCard from "@/app/mentor/courses/_components/CourseCard";
import Pagination from "@/components/ui/Pagination";
import { GET_MENTOR_COURSES } from "@/graphql/query/courses/courses";
import { BookOpen, Plus, Search } from "lucide-react";
import Link from "next/link";

type Course = {
  courseImage: string | null;
  _id: string;
  courseTitle: string;
  courseDesc: string;
  courseCategory: string;
  languageType: string;
  courseLevel:
    | "BEGINNER"
    | "ELEMENTARY"
    | "INTERMEDIATE"
    | "UPPER_INTERMEDIATE"
    | "ADVANCED"
    | "PROFICIENCY"
    | "ALL_LEVELS";
  coursePrice: number;
  courseStatus:
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED"
    | "SUSPENDED"
    | "COMPLETED"
    | "PROGRESS";
  courseEnrolledMembers?: number | null;
  courseTotalModules?: number | null;
  courseTotalLessons?: number | null;
  courseRating?: number | null;
  createdAt: string;
  updatedAt: string;
};

type Resp = {
  getMentorCourses: { list: Course[]; metaCounter: { total: number } };
};

const LIMIT = 9; // multiples of 3 look cleaner in the grid

export default function MentorCoursesList() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["mentor-courses", page, LIMIT, search],
    queryFn: async () => {
      const input: Record<string, unknown> = {
        page,
        limit: LIMIT,
        sort: "createdAt",
        direction: "DESC",
      };
      if (search.trim()) input.search = search.trim();

      const data = await gqlFetchAuth<Resp>(
        GET_MENTOR_COURSES,
        { input },
        undefined,
        { withCredentials: true }
      );
      return data.getMentorCourses;
    },
    placeholderData: keepPreviousData,
  });

  const rows = data?.list ?? [];
  const total = data?.metaCounter?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            My Courses
          </h1>
          <p className="mt-1 text-gray-600">
            Manage, edit, and track your course progress.
          </p>
        </div>

        <Link
          href="/mentor/create-courses"
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-selected text-white font-extrabold px-5 py-3 shadow-sm hover:brightness-90 transition"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </Link>
      </div>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget as HTMLFormElement);
          setPage(1);
          setSearch(String(fd.get("q") || ""));
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            name="q"
            placeholder="Search by title or description..."
            className="w-full rounded-2xl border border-gray-200 pl-11 pr-4 py-2.5 outline-none focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15 transition"
            defaultValue={search}
          />
        </div>
        <button
          className="rounded-2xl border border-gray-200 bg-white px-5 py-2.5 font-bold text-gray-900 hover:bg-gray-50 transition"
          type="submit"
        >
          Apply
        </button>
      </form>

      {/* Error */}
      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="font-extrabold text-red-900">Failed to load courses</div>
          <div className="mt-1 text-sm text-red-800">
            {error instanceof Error ? error.message : "Something went wrong."}
          </div>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-2xl bg-red-700 text-white px-4 py-2 text-sm font-bold hover:bg-red-800 transition"
          >
            Try again
          </button>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(99,99,160,0.08)] overflow-hidden"
            >
              <div className="h-32 bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
                <div className="h-9 bg-gray-100 rounded-xl animate-pulse w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-[0_8px_24px_rgba(99,99,160,0.08)]">
          <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/15">
            <BookOpen className="w-7 h-7 text-brand-selected" />
          </div>

          <h2 className="mt-4 text-2xl font-black text-gray-900">
            No courses yet
          </h2>
          <p className="mt-1 text-gray-600">
            Try a different search, or create your first course.
          </p>

          <Link
            href="/mentor/create-courses"
            className="inline-flex mt-5 items-center justify-center gap-2 rounded-2xl bg-brand-selected text-white px-5 py-3 font-extrabold hover:brightness-90 transition"
          >
            <Plus className="w-4 h-4" />
            Create Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rows.map((c) => (
            <CourseCard
              key={c._id}
              _id={c._id}
              courseTitle={c.courseTitle}
              courseImage={c.courseImage}
              courseDesc={c.courseDesc}
              courseLevel={c.courseLevel}
              languageType={c.languageType}
              coursePrice={c.coursePrice ?? 0}
              courseStatus={c.courseStatus}
              courseEnrolledMembers={c.courseEnrolledMembers ?? 0}
              courseTotalModules={c.courseTotalModules ?? 0}
              courseTotalLessons={c.courseTotalLessons ?? 0}
              courseRating={c.courseRating ?? 0}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      {!isLoading && rows.length > 0 && (
        <div className="flex flex-col items-center gap-4">
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages} • {total} total
          </span>
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}
