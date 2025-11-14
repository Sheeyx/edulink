// app/mentor/courses/[id]/CourseDetailsClient.tsx
"use client";

import * as React from "react";
import {
  FiArrowLeft,
  FiClipboard,
  FiFileText,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_COURSE } from "@/graphql/query/courses/courses";

type Lesson = {
  _id: string;
  sectionId: string;
  lessonTitle: string;
  lessonContentType: string;
  lessonDuration: string;
};

type SectionFromApi = {
  _id: string;
  courseId: string;
  moduleTitle: string;
  moduleOrder: number;
  totalLessons: number;
  lessons: Lesson[];
};

type CourseFromApi = {
  _id: string;
  courseTitle: string;
  courseDesc: string;
  courseCategory: string;
  languageType: string;
  courseLevel: string;
  coursePrice: number;
  courseStatus:
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED"
    | "SUSPENDED"
    | "COMPLETED"
    | "PROGRESS";
  mentorId: string;
  courseEnrolledMembers?: number | null;
  courseTotalModules?: number | null;
  courseTotalLessons?: number | null;
  courseRating?: number | null;
  courseLikes?: number | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  sectionsWithLessons: SectionFromApi[];
  memberData?: {
    _id: string;
    memberFullName?: string | null;
    memberImage?: string | null;
    memberBio?: string | null;
  } | null;
  // If later you add courseImage to backend, add it here too.
  // courseImage?: string | null;
};

type GetCourseResp = {
  getCourse: CourseFromApi;
};

type SectionUI = {
  id: string;
  title: string;
  order: number;
  lessonsCount: number;
};

type CourseUI = {
  id: string;
  title: string;
  description: string;
  status:
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED"
    | "SUSPENDED"
    | "COMPLETED"
    | "PROGRESS";
  modules: number;
  lessons: number;
  rating: number;
  price: number;
  currency: string;
  image?: string | null;
  sections: SectionUI[];
};

function mapToUI(c: CourseFromApi): CourseUI {
  return {
    id: c._id,
    title: c.courseTitle,
    description: c.courseDesc,
    status: c.courseStatus,
    modules: c.courseTotalModules ?? c.sectionsWithLessons.length,
    lessons:
      c.courseTotalLessons ??
      c.sectionsWithLessons.reduce(
        (sum, s) => sum + (s.totalLessons ?? s.lessons.length),
        0
      ),
    rating: c.courseRating ?? 0,
    price: c.coursePrice,
    currency: "₩", // change if you store currency separately
    // image: c.courseImage ?? null,
    image: null,
    sections: c.sectionsWithLessons
      .slice()
      .sort((a, b) => a.moduleOrder - b.moduleOrder)
      .map((s) => ({
        id: s._id,
        title: s.moduleTitle,
        order: s.moduleOrder,
        lessonsCount: s.totalLessons ?? s.lessons.length,
      })),
  };
}

export default function CourseDetailsClient({
  courseId,
}: {
  courseId: string;
}) {
  const [course, setCourse] = React.useState<CourseUI | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  async function loadCourse(id: string) {
    setLoading(true);
    setErr(null);
    try {
      const data = await gqlFetchAuth<GetCourseResp>(
        GET_COURSE,
        { input: id },
        undefined,
        { withCredentials: true } // 👈 token pattern same as MentorCoursesList
      );
      setCourse(mapToUI(data.getCourse));
    } catch (e: any) {
      setErr(e.message || "Failed to load course.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (!courseId) return;
    loadCourse(courseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // ===== loading & error states =====
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-0">
            <div className="flex items-center gap-3">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-white"
                onClick={() => window.history.back()}
              >
                <FiArrowLeft className="h-4 w-4" />
              </button>
              <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
                Course Details
              </h1>
            </div>
          </div>
        </header>

        <main className="mx-auto mt-6 max-w-6xl px-4 pb-10 lg:px-0">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            Loading course...
          </div>
        </main>
      </div>
    );
  }

  if (err || !course) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-0">
            <div className="flex items-center gap-3">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-white"
                onClick={() => window.history.back()}
              >
                <FiArrowLeft className="h-4 w-4" />
              </button>
              <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
                Course Details
              </h1>
            </div>
          </div>
        </header>

        <main className="mx-auto mt-6 max-w-6xl px-4 pb-10 lg:px-0">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-rose-100">
            <p className="text-sm text-rose-600">
              {err || "Course not found."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ===== main UI =====
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-0">
          <div className="flex items-center gap-3">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-slate-50"
              onClick={() => window.history.back()}
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
              Course Details
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-slate-50">
              <FiClipboard className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-slate-50">
              <FiFileText className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-6xl px-4 pb-10 lg:px-0">
        {/* ==== Course card top ==== */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
            {/* Text + stats */}
            <div>
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold leading-tight md:text-2xl">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {course.description}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    course.status === "PUBLISHED"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {course.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-6 text-sm">
                <Stat label="Modules" value={course.modules} />
                <Stat label="Lessons" value={course.lessons} />
                <Stat label="Rating" value={course.rating} />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Price</span>
                  <span className="text-base font-semibold text-violet-600">
                    {course.price.toLocaleString()} {course.currency}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 md:flex-none md:px-6">
                  Add Resource
                </button>
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-violet-700 md:flex-none md:px-6">
                  + Add Section
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="order-first h-40 w-full overflow-hidden rounded-xl bg-slate-100 md:order-none md:h-44">
              <img
                src={
                  course.image ||
                  "https://via.placeholder.com/600x400?text=Course+Image"
                }
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ==== Sections below ==== */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-tight lg:text-lg">
              Sections
            </h3>
            <span className="text-xs text-slate-500">
              {course.sections.length} total sections
            </span>
          </div>

          {course.sections.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
              No sections yet. Click &ldquo;+ Add Section&rdquo; to create the
              first module.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {course.sections.map((section) => (
                <SectionRow key={section.id} section={section} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="mt-0.5 text-base font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}

function SectionRow({ section }: { section: SectionUI }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-100 md:flex-row md:items-center md:justify-between">
      <div>
        <h4 className="font-medium">{section.title}</h4>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
            Order: {section.order}
          </span>
          <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
            {section.lessonsCount} Lessons
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start md:self-auto">
        <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100">
          +
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100">
          <FiEdit2 className="h-4 w-4" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100">
          <FiTrash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
