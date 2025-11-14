"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import CourseCard from "@/app/mentor/view-courses/components/CourseCard";
import { GET_MENTOR_COURSES } from "@/graphql/query/courses/courses";

type Course = {
  _id: string;
  courseTitle: string;
  courseDesc: string;
  courseCategory: string;
  languageType: string;
  courseLevel:
    | "BEGINNER" | "ELEMENTARY" | "INTERMEDIATE"
    | "UPPER_INTERMEDIATE" | "ADVANCED" | "PROFICIENCY" | "ALL_LEVELS";
  coursePrice: number;
  courseStatus:
    | "DRAFT" | "PUBLISHED" | "ARCHIVED"
    | "SUSPENDED" | "COMPLETED" | "PROGRESS";
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
  /** backend expects `sort` (NOT sortBy) */
  sort?: "createdAt" | "updatedAt" | "courseTitle" | "coursePrice";
  direction?: "ASC" | "DESC";
};

export default function MentorCoursesList({
  page = 1,
  limit = 8,
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
      const input: any = {
        page: p,
        limit: l,
        sort,        // ✅ use sort
        direction,   // ✅ keep direction if your schema supports it
      };
      if (q.trim()) input.search = q.trim(); // or omit if search is an object in your API

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
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget as HTMLFormElement);
          fetchData(1, limit, String(fd.get("q") || ""));
        }}
        className="flex gap-2"
      >
        <input
          name="q"
          placeholder="Title or description…"
          className="w-full rounded-xl border px-3 py-2 outline-none focus:border-violet-500"
          defaultValue={search}
        />
        <button
          className="rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500"
          type="submit"
        >
          Apply
        </button>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[240px] rounded-xl border bg-white shadow-sm animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-600">
          No courses found. Try adjusting filters or create your first course.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {rows.map((c) => (
            <CourseCard
              key={c._id}
              _id={c._id}
              courseTitle={c.courseTitle}
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

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          Page 1 of {totalPages} • {total} total
        </span>
      </div>
    </div>
  );
}
