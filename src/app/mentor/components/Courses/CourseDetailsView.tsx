"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { gqlFetchAuth } from "@/libs/graphql";
import {
  Plus, FilePlus2, Pencil, Trash2, ChevronLeft, ClipboardList, Save
} from "lucide-react";

/* ---------- GraphQL ---------- */
const GET_COURSE = `
  query GetCourse($input: String!) {
    getCourse(courseId: $input) {
      _id
      courseTitle
      courseDesc
      courseStatus
      coursePrice
      courseTotalModules
      courseTotalLessons
      courseRating
      sectionsWithLessons {
        _id
        moduleTitle
        moduleOrder
        totalLessons
      }
    }
  }
`;

type SectionLite = {
  _id: string;
  moduleTitle: string;
  moduleOrder: number;
  totalLessons: number;
};

type CourseResp = {
  getCourse: {
    _id: string;
    courseTitle: string;
    courseDesc: string;
    courseStatus:
      | "DRAFT" | "PUBLISHED" | "ARCHIVED"
      | "SUSPENDED" | "COMPLETED" | "PROGRESS";
    coursePrice: number;
    courseTotalModules: number;
    courseTotalLessons: number;
    courseRating: number;
    sectionsWithLessons: SectionLite[];
  };
};

/* ---------- Helpers ---------- */
const statusStyles: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-gray-100 text-gray-600",
  ARCHIVED: "bg-amber-100 text-amber-700",
  SUSPENDED: "bg-rose-100 text-rose-700",
  COMPLETED: "bg-sky-100 text-sky-700",
  PROGRESS: "bg-violet-100 text-violet-700",
};

function Badge({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`} >
      {children}
    </span>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="flex-1 min-w-[140px] text-center">
      <div className="text-violet-700 font-semibold text-lg">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}

/* ---------- Section Row ---------- */
function SectionRow({
  s,
  onAddLesson,
  onEdit,
  onDelete,
}: {
  s: SectionLite;
  onAddLesson: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center gap-4 shadow-sm">
      <div className="flex-1">
        <div className="font-semibold text-gray-900 text-lg">{s.moduleTitle}</div>
        <div className="mt-2 flex gap-2 text-sm text-gray-600">
          <span className="rounded-xl bg-gray-100 px-2 py-0.5">Order: {s.moduleOrder}</span>
          <span className="rounded-xl bg-gray-100 px-2 py-0.5">{s.totalLessons} Lessons</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onAddLesson(s._id)}
          className="rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2"
          title="Add lesson"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(s._id)}
          className="rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 px-3 py-2"
          title="Edit section"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(s._id)}
          className="rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-2"
          title="Delete section"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Main View ---------- */
export default function CourseDetailsView({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [c, setC] = React.useState<CourseResp["getCourse"] | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await gqlFetchAuth<CourseResp>(
        GET_COURSE,
        { input: courseId },
        undefined,
        { withCredentials: true }
      );
      setC(data.getCourse);
    } catch (e: any) {
      setErr(e.message || "Failed to load course.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); /* eslint-disable-next-line */ }, [courseId]);

  function addResource() {
    // TODO: open resource modal
    alert("Add Resource clicked");
  }
  function addSection() {
    // TODO: open create section modal
    alert("Add Section clicked");
  }
  function addLesson(sectionId: string) {
    alert(`Add lesson to section ${sectionId}`);
  }
  function editSection(sectionId: string) {
    alert(`Edit section ${sectionId}`);
  }
  function deleteSection(sectionId: string) {
    if (confirm("Delete this section?")) alert(`Deleted section ${sectionId}`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header (desktop) */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-white/80 backdrop-blur border-b">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-xl border px-3 py-2 hover:bg-gray-50"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Course Details</h1>

          <div className="ml-auto flex items-center gap-2">
            <button className="rounded-xl border px-3 py-2 hover:bg-gray-50" title="Resources">
              <ClipboardList className="w-5 h-5" />
            </button>
            <button className="rounded-xl border px-3 py-2 hover:bg-gray-50" title="Save">
              <Save className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="rounded-2xl border bg-white h-40 animate-pulse" />
      ) : err ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">{err}</div>
      ) : !c ? null : (
        <>
          {/* Course card */}
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 relative">
            <Badge className={`${statusStyles[c.courseStatus] ?? "bg-gray-100 text-gray-600"} absolute top-4 right-4`}>
              {c.courseStatus}
            </Badge>

            <h2 className="text-2xl font-semibold text-gray-900 leading-snug">{c.courseTitle}</h2>
            <p className="text-gray-500 mt-2 max-w-3xl">{c.courseDesc}</p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat value={c.courseTotalModules ?? 0} label="Modules" />
              <Stat value={c.courseTotalLessons ?? 0} label="Lessons" />
              <Stat value={c.courseRating ?? 0} label="Rating" />
              <Stat
                value={`${(c.coursePrice ?? 0).toLocaleString()}₩`}
                label="Price"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={addResource}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5"
            >
              <FilePlus2 className="w-4 h-4" />
              Add Resource
            </button>
            <button
              onClick={addSection}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2.5"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          </div>

          {/* Sections list */}
          <div className="space-y-3">
            {c.sectionsWithLessons?.length ? (
              c.sectionsWithLessons
                .slice()
                .sort((a, b) => a.moduleOrder - b.moduleOrder)
                .map((s) => (
                  <SectionRow
                    key={s._id}
                    s={s}
                    onAddLesson={addLesson}
                    onEdit={editSection}
                    onDelete={deleteSection}
                  />
                ))
            ) : (
              <div className="rounded-2xl border border-dashed p-10 text-center text-gray-500">
                No sections yet. Click <span className="text-violet-600 font-medium">Add Section</span> to create your first module.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
