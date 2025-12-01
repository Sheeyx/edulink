// src/app/admin/courses/page.tsx
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  KeyboardEvent,
} from "react";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { gqlFetchAuth } from "@/libs/graphql";
import {
  ADMIN_GET_COURSES,
  AdminCoursesResponse,
  CourseItem,
  CourseStatus,
  CoursesInquiryInput,
  LanguageType,
} from "@/graphql/query/admin/getCoursesByAdmin";

/* ───────── GraphQL: Update course status ───────── */

const UPDATE_COURSE_BY_ADMIN = /* GraphQL */ `
  mutation UpdateCourseByAdmin($input: CourseAdminUpdate!) {
    updateCourseByAdmin(input: $input) {
      _id
      courseStatus
    }
  }
`;

type UpdateCourseByAdminResp = {
  updateCourseByAdmin: {
    _id: string;
    courseStatus: CourseStatus;
  };
};

/* ===== Constants ===== */

const PAGE_LIMIT = 10;

const LANGUAGE_OPTIONS: Array<LanguageType | "ALL"> = [
  "ALL",
  "KOREAN",
  "ENGLISH",
  "RUSSIAN",
  "UZBEK",
];

const STATUS_OPTIONS: Array<CourseStatus | "ALL"> = [
  "ALL",
  "PUBLISHED",
  "DRAFT",
  "ARCHIVED",
];

/* ===== Helpers ===== */

function formatDate(value: string): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
}

function formatPrice(value: number): string {
  if (typeof value !== "number") return "-";
  return `${value.toLocaleString()} UZS`;
}

function languageBadgeClasses(lang: LanguageType): string {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border";
  switch (lang) {
    case "KOREAN":
      return `${base} bg-blue-50 text-blue-700 border-blue-200`;
    case "ENGLISH":
      return `${base} bg-green-50 text-green-700 border-green-200`;
    case "RUSSIAN":
      return `${base} bg-purple-50 text-purple-700 border-purple-200`;
    case "UZBEK":
      return `${base} bg-amber-50 text-amber-700 border-amber-200`;
    default:
      return `${base} bg-slate-50 text-slate-700 border-slate-200`;
  }
}

function statusSelectClasses(status: CourseStatus, disabled: boolean): string {
  const base =
    "rounded-full border px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 " +
    (disabled ? "opacity-60 cursor-not-allowed " : "");

  switch (status) {
    case "PUBLISHED":
      return base + "border-emerald-500 bg-emerald-50 text-emerald-700";
    case "DRAFT":
      return base + "border-amber-400 bg-amber-50 text-amber-700";
    case "ARCHIVED":
      return base + "border-slate-300 bg-slate-50 text-slate-600";
    default:
      return base + "border-slate-200 bg-white text-slate-700";
  }
}

/* ===== Component ===== */

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  // search input vs real search (debounced)
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [languageFilter, setLanguageFilter] = useState<LanguageType | "ALL">(
    "ALL"
  );
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "ALL">("ALL");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // updating status of a single course
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  /* --- Derived --- */

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_LIMIT)),
    [total]
  );

  const hasData = courses.length > 0;

  /* --- Data fetcher --- */

  const fetchCourses = useCallback(
    async (overridePage?: number) => {
      const nextPage = overridePage ?? page;

      const input: CoursesInquiryInput = {
        page: nextPage,
        limit: PAGE_LIMIT,
        search: {} as CoursesInquiryInput["search"],
      };

      if (search.trim()) {
        input.search!.courseTitle = search.trim();
      }

      if (languageFilter !== "ALL") {
        input.search!.languageType = languageFilter;
      }

      if (statusFilter !== "ALL") {
        input.search!.courseStatus = statusFilter;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await gqlFetchAuth<AdminCoursesResponse>(
          ADMIN_GET_COURSES,
          { input }
        );

        const payload = data.getAllCoursesByAdmin;
        setCourses(payload.list);
        setTotal(payload.metaCounter.total ?? 0);

        if (overridePage !== undefined) {
          setPage(overridePage);
        }
      } catch (err) {
        console.error("[AdminCourses] fetch error:", err);
        const message =
          err instanceof Error ? err.message : "Failed to load courses";
        setError(message);
        setCourses([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, search, languageFilter, statusFilter]
  );

  /* --- Initial + filter changes --- */

  useEffect(() => {
    fetchCourses(1);
  }, [search, languageFilter, statusFilter, fetchCourses]);

  /* --- Debounce search input --- */

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    return () => clearTimeout(id);
  }, [searchInput]);

  /* --- Handlers --- */

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearch(searchInput);
    }
  };

  const handleRefresh = () => {
    fetchCourses();
  };

  const handlePrevPage = () => {
    if (page <= 1) return;
    const prev = page - 1;
    fetchCourses(prev);
  };

  const handleNextPage = () => {
    if (page >= totalPages) return;
    const next = page + 1;
    fetchCourses(next);
  };

  const handleStatusChange = async (
    courseId: string,
    newStatus: CourseStatus
  ) => {
    const current = courses.find((c) => c._id === courseId)?.courseStatus;
    if (current === newStatus) return;

    setStatusUpdatingId(courseId);
    setError(null);

    try {
      const data = await gqlFetchAuth<UpdateCourseByAdminResp>(
        UPDATE_COURSE_BY_ADMIN,
        {
          input: {
            _id: courseId,
            courseStatus: newStatus,
          },
        }
      );

      const updated = data.updateCourseByAdmin;

      // UX: birinchi navbatda local state ni yangilaymiz
      setCourses((prev) =>
        prev.map((c) =>
          c._id === updated._id ? { ...c, courseStatus: updated.courseStatus } : c
        )
      );

      // Agar hozir filter Published bo'lsa va sen Draftga o'zgartirsang,
      // shu kurs Published listdan chiqib ketishi kerak → qayta fetch
      if (
        statusFilter !== "ALL" &&
        updated.courseStatus !== statusFilter
      ) {
        await fetchCourses(1);
      }
    } catch (err) {
      console.error("[AdminCourses] update status error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to update course status";
      setError(message);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  /* ===== Render ===== */

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Courses management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View, filter and monitor all courses created by mentors.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </header>

      {/* Filters */}
      <section className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-xl">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="Search by course title…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {/* Language filter (select) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Language:</span>
          <select
            value={languageFilter}
            onChange={(e) =>
              setLanguageFilter(e.target.value as LanguageType | "ALL")
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="ALL">All languages</option>
            <option value="KOREAN">KOREAN</option>
            <option value="ENGLISH">ENGLISH</option>
            <option value="RUSSIAN">RUSSIAN</option>
            <option value="UZBEK">UZBEK</option>
          </select>
        </div>

        {/* Status filter (select) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as CourseStatus | "ALL")
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="ALL">All</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </section>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Language / Level
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Modules / Lessons
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Students
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Rating / Likes
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading && !hasData && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    Loading courses…
                  </td>
                </tr>
              )}

              {!loading && !hasData && !error && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    No courses found with current filters.
                  </td>
                </tr>
              )}

              {courses.map((c) => {
                const rating =
                  typeof c.courseRating === "number"
                    ? c.courseRating.toFixed(1)
                    : "0.0";

                const disabled = statusUpdatingId === c._id;

                return (
                  <tr key={c._id} className="hover:bg-slate-50/70">
                    {/* Course */}
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-slate-900 line-clamp-1">
                        {c.courseTitle}
                      </div>
                      <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                        {c.courseDesc}
                      </div>
                      <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                        {c.courseCategory}
                      </div>
                    </td>

                    {/* Lang / Level */}
                    <td className="px-4 py-3 align-top space-y-1">
                      <div className={languageBadgeClasses(c.languageType)}>
                        {c.languageType}
                      </div>
                      <div className="text-xs text-slate-500">
                        Level:{" "}
                        <span className="font-medium">{c.courseLevel}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 align-top">
                      <span className="text-sm font-semibold text-slate-900">
                        {formatPrice(c.coursePrice)}
                      </span>
                    </td>

                    {/* Modules / Lessons */}
                    <td className="px-4 py-3 align-top">
                      <div className="text-xs text-slate-700">
                        Modules:{" "}
                        <span className="font-semibold">
                          {c.courseTotalModules}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700">
                        Lessons:{" "}
                        <span className="font-semibold">
                          {c.courseTotalLessons}
                        </span>
                      </div>
                    </td>

                    {/* Students */}
                    <td className="px-4 py-3 align-top">
                      <div className="text-xs text-slate-700">
                        Enrolled:{" "}
                        <span className="font-semibold">
                          {c.courseEnrolledMembers}
                        </span>
                      </div>
                    </td>

                    {/* Rating / Likes */}
                    <td className="px-4 py-3 align-top">
                      <div className="text-xs text-slate-700">
                        Rating:{" "}
                        <span className="font-semibold">{rating}</span>
                      </div>
                      <div className="text-xs text-slate-700">
                        Likes:{" "}
                        <span className="font-semibold">{c.courseLikes}</span>
                      </div>
                    </td>

                    {/* Status (editable select with colors) */}
                    <td className="px-4 py-3 align-top">
                      <select
                        value={c.courseStatus}
                        disabled={disabled}
                        onChange={(e) =>
                          handleStatusChange(
                            c._id,
                            e.target.value as CourseStatus
                          )
                        }
                        className={statusSelectClasses(c.courseStatus, disabled)}
                      >
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3 align-top text-right text-xs text-slate-500">
                      {formatDate(c.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <footer className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {hasData ? (page - 1) * PAGE_LIMIT + 1 : 0}
            </span>{" "}
            –{" "}
            <span className="font-semibold text-slate-800">
              {(page - 1) * PAGE_LIMIT + courses.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">{total}</span> courses
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={page <= 1 || loading}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-100"
            >
              Prev
            </button>
            <span>
              Page{" "}
              <span className="font-semibold text-slate-800">{page}</span> /
              <span className="font-semibold text-slate-800">
                {" "}
                {totalPages}
              </span>
            </span>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={page >= totalPages || loading}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
