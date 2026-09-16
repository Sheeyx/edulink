"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import CourseCard from "@/app/mentor/courses/_components/CourseCard";
import { GET_MENTOR_COURSES } from "@/graphql/query/courses/courses";
import { BookOpen, Plus, Search } from "lucide-react";
import Link from "next/link";

type Course = {
  courseImage: string | null ;
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

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "createdAt" | "updatedAt" | "courseTitle" | "coursePrice";
  direction?: "ASC" | "DESC";
};

export default function MentorCoursesList({
  page = 1,
  limit = 9, // 👈 optional: multiples of 3 look cleaner
  search = "",
  sort = "createdAt",
  direction = "DESC",
}: Props) {
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<Course[]>([]);
  const [total, setTotal] = React.useState(0);

  async function fetchData(p = page, l = limit, q = search) {
    setLoading(true);
    setErr(null);
    try {
      const input: any = { page: p, limit: l, sort, direction };
      if (q.trim()) input.search = q.trim();

      const data = await gqlFetchAuth<Resp>(
        GET_MENTOR_COURSES,
        { input },
        undefined,
        { withCredentials: true }
      );

      setRows(data.getMentorCourses.list);
      setTotal(data.getMentorCourses.metaCounter.total);
    } catch (e: any) {
      setErr(e.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, sort, direction]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

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
          className="inline-flex items-center gap-2 rounded-2xl bg-purple-700 text-white font-extrabold px-5 py-3 shadow-sm hover:bg-purple-800 transition"
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
          fetchData(1, limit, String(fd.get("q") || ""));
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            name="q"
            placeholder="Search by title or description..."
            className="w-full rounded-2xl border border-gray-200 pl-11 pr-4 py-2.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
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
      {err && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="font-extrabold text-red-900">Failed to load courses</div>
          <div className="mt-1 text-sm text-red-800">{err}</div>
          <button
            onClick={() => fetchData()}
            className="mt-4 rounded-2xl bg-red-700 text-white px-4 py-2 text-sm font-bold hover:bg-red-800 transition"
          >
            Try again
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
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
          <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100">
            <BookOpen className="w-7 h-7 text-purple-700" />
          </div>

          <h2 className="mt-4 text-2xl font-black text-gray-900">
            No courses yet
          </h2>
          <p className="mt-1 text-gray-600">
            Try a different search, or create your first course.
          </p>

          <Link
            href="/mentor/create-courses"
            className="inline-flex mt-5 items-center justify-center gap-2 rounded-2xl bg-purple-700 text-white px-5 py-3 font-extrabold hover:bg-purple-800 transition"
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
      {!loading && rows.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Page 1 of {totalPages} • {total} total
          </span>
        </div>
      )}
    </div>
  );
}
