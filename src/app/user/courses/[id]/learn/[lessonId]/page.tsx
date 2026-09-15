"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  X,
  Menu,
  ChevronDown,
  ArrowLeft,
  Search,
  CheckSquare,
  Square,
} from "lucide-react";

import { gqlFetchAuth } from "@/libs/graphql";
import { getAccessToken } from "@/providers/auth-context";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

/* ───────────────────────── GraphQL ───────────────────────── */

const GET_MY_ENROLLED_COURSE = /* GraphQL */ `
  query GetMyEnrolledCourse($input: String!) {
    getMyEnrolledCourse(courseId: $input) {
      _id
      courseTitle
      courseDesc
      sectionsWithLessons {
        _id
        moduleTitle
        moduleOrder
        totalLessons
        lessons {
          _id
          lessonTitle
          lessonUrl
          lessonDuration
          lessonContentType
          lessonStatus
        }
      }
    }
  }
`;

/* ───────────────────────── Types ───────────────────────── */

type Lesson = {
  _id: string;
  lessonTitle: string;
  lessonUrl?: string | null;
  lessonDuration?: string | number | null;
  lessonContentType?: string | null;
  lessonStatus?: string | null;
};

type Section = {
  _id: string;
  moduleTitle: string;
  moduleOrder?: number | null;
  totalLessons?: number | null;
  lessons?: Lesson[] | null;
};

type Course = {
  _id: string;
  courseTitle: string;
  courseDesc?: string | null;
  sectionsWithLessons?: Section[] | null;
};

type Resp = {
  getMyEnrolledCourse: Course | null;
};

/* ───────────────────────── Helpers ───────────────────────── */

function sortSections(sections: Section[]) {
  return [...sections].sort((a, b) => (a.moduleOrder ?? 0) - (b.moduleOrder ?? 0));
}

function isValidUrlValue(v?: string | null) {
  if (!v) return false;
  const s = String(v).trim();
  if (!s) return false;
  if (s === "null" || s === "undefined") return false;
  return true;
}

function resolveMediaUrl(v?: string | null) {
  if (!v) return "";
  const s = v.trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return buildDownloadUrl(s) || "";
}

/* ───────────────────────── Page ───────────────────────── */

export default function LessonPlayerUdemyLike() {
  const router = useRouter();
  const params = useParams<{ id: string; lessonId: string }>();

  const courseId = params?.id;
  const lessonId = params?.lessonId;

  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const [openSectionId, setOpenSectionId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["user", "enrolledCourse", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const token = getAccessToken();
      const res = await gqlFetchAuth<Resp>(
        GET_MY_ENROLLED_COURSE,
        { input: courseId },
        token
      );
      return res.getMyEnrolledCourse;
    },
    staleTime: 30_000,
  });

  const course = data ?? null;

  const sections = React.useMemo(() => {
    const s = sortSections(course?.sectionsWithLessons || []);
    if (!search.trim()) return s;

    const q = search.toLowerCase();
    return s
      .map((sec) => ({
        ...sec,
        lessons: (sec.lessons || []).filter((l) =>
          (l.lessonTitle || "").toLowerCase().includes(q)
        ),
      }))
      .filter((sec) => (sec.lessons || []).length > 0);
  }, [course, search]);

  const allLessons = React.useMemo(
    () => (course?.sectionsWithLessons || []).flatMap((s) => s.lessons || []),
    [course]
  );

  const activeLesson = React.useMemo(() => {
    return allLessons.find((l) => l._id === lessonId) || null;
  }, [allLessons, lessonId]);

  const videoSrc = resolveMediaUrl(activeLesson?.lessonUrl);

  // auto-open section containing active lesson
  React.useEffect(() => {
    if (!course?.sectionsWithLessons?.length || !lessonId) return;
    const found = (course.sectionsWithLessons || []).find((s) =>
      (s.lessons || []).some((l) => l._id === lessonId)
    );
    if (found?._id) setOpenSectionId(found._id);
  }, [course, lessonId]);

  // responsive: close drawer on small screens by default
  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024) setDrawerOpen(false);
      else setDrawerOpen(true);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!courseId) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-8">
        Missing courseId
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Top header bar */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          onClick={() => router.push(`/user/courses/${courseId}`)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to course
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-extrabold hover:bg-gray-50 transition"
          >
            <Menu className="w-4 h-4" />
            Course content
          </button>

          <button
            onClick={() => refetch()}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-extrabold hover:bg-gray-50 transition"
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Main layout: video left, drawer right */}
      <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
        {/* LEFT: Video player */}
        <div className="rounded-3xl overflow-hidden border border-gray-100 bg-black shadow-[0_16px_45px_rgba(0,0,0,0.12)]">
          <div className="relative w-full aspect-video bg-black">
            {isLoading ? (
              <div className="absolute inset-0 grid place-items-center text-white/80">
                Loading video...
              </div>
            ) : isError ? (
              <div className="absolute inset-0 grid place-items-center text-white/80 px-6 text-center">
                {error instanceof Error ? error.message : "Failed to load"}
              </div>
            ) : videoSrc ? (
              <video
                key={videoSrc}
                className="absolute inset-0 w-full h-full"
                controls
                playsInline
                preload="metadata"
              >
                <source src={videoSrc} />
              </video>
            ) : (
              <div className="absolute inset-0 grid place-items-center text-white/80 px-6 text-center">
                No video URL for this lesson.
              </div>
            )}
          </div>

          {/* Title strip */}
          <div className="bg-white">
            <div className="px-5 py-4">
              <div className="text-lg font-black text-gray-900 truncate">
                {course?.courseTitle || "Course"}
              </div>
              <div className="mt-1 text-sm text-gray-600 truncate">
                {activeLesson?.lessonTitle || "Select a lesson"}
              </div>

              {!isValidUrlValue(activeLesson?.lessonUrl) && activeLesson ? (
                <div className="mt-2 text-xs text-red-600 font-bold">
                  Backend lessonUrl is empty → check API (lessonUrl is null/empty)
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* RIGHT: Drawer/panel (desktop visible, mobile overlay) */}
        <div
          className={[
            "lg:static lg:block",
            drawerOpen ? "block" : "hidden lg:block",
          ].join(" ")}
        >
          {/* mobile overlay */}
          {drawerOpen && (
            <div
              className="fixed inset-0 bg-black/30 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
          )}

          <aside
            className={[
              "lg:relative lg:w-auto",
              "fixed right-0 top-0 h-full w-[420px] max-w-[92vw] lg:h-auto",
              "bg-white border border-gray-200 rounded-none lg:rounded-3xl",
              "shadow-[0_16px_55px_rgba(0,0,0,0.18)] lg:shadow-[0_10px_35px_rgba(99,99,160,0.08)]",
              "z-50 lg:z-auto",
              drawerOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
              "transition-transform duration-200",
            ].join(" ")}
          >
            {/* drawer header */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-200">
              <div className="text-base font-black text-gray-900">Course content</div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="lg:hidden rounded-xl border border-gray-200 bg-white p-2 hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* search */}
            <div className="px-5 py-4 border-b border-gray-200">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search lessons"
                  className="w-full pl-9 pr-3 py-2 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>

            {/* content list */}
            <div className="px-2 py-2 overflow-y-auto max-h-[calc(100vh-140px)] lg:max-h-[calc(100vh-220px)]">
              {isLoading ? (
                <div className="p-4 text-sm text-gray-600">Loading sections...</div>
              ) : isError ? (
                <div className="p-4 text-sm text-red-600">
                  {error instanceof Error ? error.message : "Failed to load"}
                </div>
              ) : sections.length === 0 ? (
                <div className="p-4 text-sm text-gray-600">No lessons.</div>
              ) : (
                <div className="space-y-2">
                  {sections.map((sec, idx) => {
                    const opened = openSectionId === sec._id;
                    const lessons = sec.lessons || [];

                    return (
                      <div key={sec._id} className="rounded-2xl border border-gray-200 overflow-hidden">
                        <button
                          onClick={() => setOpenSectionId(opened ? null : sec._id)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <div className="min-w-0 text-left">
                            <div className="font-extrabold text-gray-900 truncate">
                              {typeof sec.moduleOrder === "number"
                                ? `Section ${sec.moduleOrder}: ${sec.moduleTitle}`
                                : `Section ${idx + 1}: ${sec.moduleTitle}`}
                            </div>
                            <div className="text-xs text-gray-600">
                              {lessons.length} lessons
                            </div>
                          </div>
                          <ChevronDown
                            className={[
                              "w-5 h-5 text-gray-500 transition-transform",
                              opened ? "rotate-180" : "rotate-0",
                            ].join(" ")}
                          />
                        </button>

                        {opened && (
                          <div className="bg-white">
                            {lessons.map((l, i) => {
                              const isActive = l._id === lessonId;
                              const hasUrl = isValidUrlValue(l.lessonUrl);

                              return (
                                <Link
                                  key={l._id}
                                  href={`/user/courses/${courseId}/learn/${l._id}`}
                                  onClick={() => {
                                    // on mobile, close after selecting
                                    if (window.innerWidth < 1024) setDrawerOpen(false);
                                  }}
                                  className={[
                                    "flex items-start justify-between gap-3 px-4 py-3 border-t border-gray-200",
                                    isActive ? "bg-purple-50" : "hover:bg-gray-50",
                                  ].join(" ")}
                                >
                                  <div className="flex items-start gap-3 min-w-0">
                                    <div className="mt-0.5 text-gray-700">
                                      {isActive ? (
                                        <CheckSquare className="w-5 h-5" />
                                      ) : (
                                        <Square className="w-5 h-5" />
                                      )}
                                    </div>

                                    <div className="min-w-0">
                                      <div
                                        className={[
                                          "text-sm font-extrabold truncate",
                                          isActive ? "text-purple-900" : "text-gray-900",
                                        ].join(" ")}
                                      >
                                        {i + 1}. {l.lessonTitle}
                                      </div>
                                      <div className="mt-1 text-xs text-gray-500">
                                        {hasUrl ? "Video ready" : "No URL"}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-xs font-bold text-gray-500 shrink-0">
                                    {hasUrl ? "Play" : "—"}
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
