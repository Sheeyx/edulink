"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { gqlFetchAuth } from "@/libs/graphql";
import { FiArrowLeft } from "react-icons/fi";
import { CREATE_COURSE } from "@/graphql/mutation/course/course";

type CourseLevel =
  | "BEGINNER"
  | "ELEMENTARY"
  | "INTERMEDIATE"
  | "UPPER_INTERMEDIATE"
  | "ADVANCED"
  | "PROFICIENCY"
  | "ALL_LEVELS";

type CourseStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED"
  | "SUSPENDED"
  | "COMPLETED"
  | "PROGRESS";

type CourseFromApi = {
  _id: string;
  courseTitle: string;
  courseDesc: string;
  courseCategory: string;
  languageType: string;
  courseLevel: CourseLevel;
  coursePrice: number;
  courseStatus: CourseStatus;
  mentorId: string;
  courseEnrolledMembers?: number | null;
  courseTotalModules?: number | null;
  courseTotalLessons?: number | null;
  courseRating?: number | null;
  courseLikes?: number | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

type CreateCourseResp = { createCourse: CourseFromApi };

const LEVEL_OPTIONS: CourseLevel[] = [
  "BEGINNER",
  "ELEMENTARY",
  "INTERMEDIATE",
  "UPPER_INTERMEDIATE",
  "ADVANCED",
  "PROFICIENCY",
  "ALL_LEVELS",
];

const STATUS_OPTIONS: CourseStatus[] = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
  "SUSPENDED",
  "COMPLETED",
  "PROGRESS",
];

export default function CreateCourseClient() {
  const router = useRouter();

  const [saving, setSaving] = React.useState(false);
  const [saveErr, setSaveErr] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    title: "",
    description: "",
    category: "",
    languageType: "",
    level: "BEGINNER" as CourseLevel,
    status: "DRAFT" as CourseStatus, // you can remove from input if backend sets default
    price: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveErr(null);
    setSuccessMsg(null);

    try {
      const input = {
        // 🔁 Adjust keys if your CourseCreate input is different
        courseTitle: form.title.trim(),
        courseDesc: form.description.trim(),
        courseCategory: form.category.trim(),
        languageType: form.languageType.trim(),
        courseLevel: form.level,
        courseStatus: form.status, // remove if your schema doesn't accept on create
        coursePrice: Number(form.price || 0),
      };

      const data = await gqlFetchAuth<CreateCourseResp>(
        CREATE_COURSE,
        { input },
        undefined,
        { withCredentials: true }
      );

      const created = data.createCourse;
      setSuccessMsg("Course created successfully.");

      // redirect to detail page
      router.push(`/mentor/courses/${created._id}`);
    } catch (err: any) {
      console.error("Create course error:", err);
      setSaveErr(err.message || "Failed to create course.");
    } finally {
      setSaving(false);
    }
  };

  const isDisabled =
    saving ||
    !form.title.trim() ||
    !form.description.trim() ||
    !form.languageType.trim();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-0">
          <div className="flex items-center gap-3">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-slate-50"
              onClick={() => router.back()}
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
                Create Course
              </h1>
              <p className="text-xs text-slate-500">
                Add a new course to your mentor dashboard.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto mt-6 max-w-3xl px-4 pb-12 lg:px-0">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
        >
          {saveErr && (
            <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-600">
              {saveErr}
            </div>
          )}

          {successMsg && (
            <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {successMsg}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-slate-700">
              Course title
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-violet-500"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="IELTS Speaking for Beginners"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-slate-700">
              Description
            </label>
            <textarea
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-violet-500"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Short summary of what students will learn..."
              required
            />
          </div>

          {/* Category + Language */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-700">
                Category
              </label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-violet-500"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                placeholder="IELTS / Conversation / Business English"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700">
                Language
              </label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-violet-500"
                value={form.languageType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, languageType: e.target.value }))
                }
                placeholder="ENGLISH / KOREAN / ..."
                required
              />
            </div>
          </div>

          {/* Level + Status */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-700">
                Level
              </label>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-violet-500"
                value={form.level}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    level: e.target.value as CourseLevel,
                  }))
                }
              >
                {LEVEL_OPTIONS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700">
                Status
              </label>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-violet-500"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as CourseStatus,
                  }))
                }
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="text-xs font-medium text-slate-700">
              Price (₩)
            </label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-violet-500"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  price: e.target.value,
                }))
              }
              placeholder="0"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isDisabled}
            >
              {saving ? "Creating..." : "Create course"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
