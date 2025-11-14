// app/mentor/courses/[id]/CourseDetailsClient.tsx
"use client";

import * as React from "react";
import {
  FiArrowLeft,
  FiClipboard,
  FiFileText,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_COURSE } from "@/graphql/query/courses/courses";
import SectionsBlock, { SectionUI } from "../components/Sections/SectionsBlock";
import EditSectionModal from "../components/Sections/EditSectionModal";
import CreateSectionModal from "../components/Sections/CreateSections";

/* ───────── GraphQL: Delete Section ───────── */
const DELETE_SECTION = `
  mutation RemoveSection($input: String!) {
    removeSection(sectionId: $input) {
      _id
    }
  }
`;

type RemoveSectionResp = {
  removeSection: {
    _id: string;
  } | null;
};

/* ───────── Types from API ───────── */
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
};

type GetCourseResp = { getCourse: CourseFromApi };

/* ───────── UI Types ───────── */
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

/* ───────── Helpers ───────── */
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
    currency: "₩",
    image: null, // plug real courseImage if you add it later
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

const statusClass: Record<CourseUI["status"], string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-600",
  DRAFT: "bg-slate-100 text-slate-600",
  ARCHIVED: "bg-amber-50 text-amber-700",
  SUSPENDED: "bg-rose-50 text-rose-600",
  COMPLETED: "bg-sky-50 text-sky-700",
  PROGRESS: "bg-indigo-50 text-indigo-600",
};

// simple stat atom
function Stat({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="mt-0.5 text-base font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}

/* ───────── Main View ───────── */
export default function CourseDetailsClient({ courseId }: { courseId: string }) {
  const [course, setCourse] = React.useState<CourseUI | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  const [addOpen, setAddOpen] = React.useState(false);

  // edit section
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState<{
    id: string;
    title: string;
    order: number;
  } | null>(null);

  // delete section modal
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [sectionToDelete, setSectionToDelete] = React.useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteErr, setDeleteErr] = React.useState<string | null>(null);

  async function loadCourse(id: string) {
    setLoading(true);
    setErr(null);
    try {
      const data = await gqlFetchAuth<GetCourseResp>(
        GET_COURSE,
        { input: id },
        undefined,
        { withCredentials: true }
      );
      setCourse(mapToUI(data.getCourse));
    } catch (e: any) {
      setErr(e.message || "Failed to load course.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (courseId) loadCourse(courseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  async function handleConfirmDelete() {
    if (!sectionToDelete || !course) return;

    const sectionId = sectionToDelete.id;
    const removedSection = course.sections.find((s) => s.id === sectionId);
    const removedLessons = removedSection?.lessonsCount ?? 0;

    try {
      setDeleteLoading(true);
      setDeleteErr(null);

      const resp = await gqlFetchAuth<RemoveSectionResp>(
        DELETE_SECTION,
        { input: sectionId }, // 👈 sends { "input": "id" }
        undefined,
        { withCredentials: true }
      );

      console.log("removeSection resp", resp);

      // update local UI
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.filter((s) => s.id !== sectionId),
          modules: Math.max(0, prev.modules - 1),
          lessons: Math.max(0, prev.lessons - removedLessons),
        };
      });

      setDeleteOpen(false);
      setSectionToDelete(null);
    } catch (e: any) {
      console.error(e);
      setDeleteErr(e.message || "Failed to delete section.");
    } finally {
      setDeleteLoading(false);
    }
  }

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
            <button
              title="Resources"
              className="flex h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-slate-50"
            >
              <FiClipboard className="h-4 w-4" />
            </button>
            <button
              title="Notes"
              className="flex h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-slate-50"
            >
              <FiFileText className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-6xl px-4 pb-10 lg:px-0">
        {/* Top card */}
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
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClass[course.status]}`}
                >
                  {course.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-6 text-sm">
                <Stat label="Modules" value={course.modules} />
                <Stat label="Lessons" value={course.lessons} />
                <Stat label="Rating" value={course.rating} />
                <Stat
                  label="Price"
                  value={
                    <span className="font-semibold text-violet-600">
                      {course.price.toLocaleString()} {course.currency}
                    </span>
                  }
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 md:flex-none md:px-6">
                  Add Resource
                </button>
                <button
                  onClick={() => setAddOpen(true)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-violet-700 md:flex-none md:px-6"
                >
                  <FiPlus className="h-4 w-4" />
                  Add Section
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

        {/* Sections list */}
        <SectionsBlock
          sections={course.sections}
          onAddLesson={(id) => alert(`Add lesson to section ${id}`)}
          onEditSection={(id) => {
            const sec = course.sections.find((s) => s.id === id);
            if (!sec) return;
            setSelectedSection({
              id: sec.id,
              title: sec.title,
              order: sec.order,
            });
            setEditOpen(true);
          }}
          onDeleteSection={(id) => {
            const sec = course.sections.find((s) => s.id === id);
            if (!sec) return;
            setSectionToDelete({ id: sec.id, title: sec.title });
            setDeleteErr(null);
            setDeleteOpen(true);
          }}
        />
      </main>

      {/* Create Section Modal */}
      <CreateSectionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        courseId={course.id}
        onCreated={() => loadCourse(course.id)}
      />

      {/* Edit Section Modal */}
      <EditSectionModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        courseId={course.id}
        sectionId={selectedSection?.id || null}
        initialTitle={selectedSection?.title || ""}
        initialOrder={selectedSection?.order || 1}
        onUpdated={() => loadCourse(course.id)}
      />

      {/* Delete Section Modal */}
      <DeleteSectionModal
        open={deleteOpen}
        title={sectionToDelete?.title || ""}
        loading={deleteLoading}
        error={deleteErr}
        onCancel={() => {
          if (deleteLoading) return;
          setDeleteOpen(false);
          setSectionToDelete(null);
          setDeleteErr(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

/* ───────── Delete Modal Component ───────── */
function DeleteSectionModal({
  open,
  title,
  loading,
  error,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  loading: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <FiTrash2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Delete section?
            </h2>
            <p className="text-xs text-slate-500">
              This action cannot be undone. You can&apos;t recover this section
              later.
            </p>
          </div>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <span className="font-semibold">Section:</span>{" "}
            <span>{title || "Untitled section"}</span>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-600">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              No, keep it
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-60"
            >
              {loading ? "Deleting…" : "Yes, delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
