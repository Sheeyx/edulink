"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { gqlFetchAuth } from "@/libs/graphql";
import { CREATE_COURSE } from "@/graphql/mutation/course/course";
import {
  COURSE_CATEGORY,
  LANGUAGE_TYPE,
  COURSE_LEVEL,
  type CourseCategory,
  type LanguageType,
  type CourseLevel,
} from "@/libs/enums/course.enums";
import { toISODateOrNull, toNumberOr } from "@/utils/date";

type Props = {
  onCreated?: (courseId: string) => void;
};

type FormState = {
  courseTitle: string;
  courseDesc: string;
  courseImage: string;        // optional
  courseCategory: CourseCategory;
  languageType: LanguageType;
  courseLevel: CourseLevel;
  coursePrice: string;        // string in UI; convert on submit
  maxStudents: string;        // string in UI; convert on submit
  courseStartDate: string;    // yyyy-mm-dd; convert to ISO on submit
};

export default function CreateCourseForm({ onCreated }: Props) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const [form, setForm] = React.useState<FormState>({
    courseTitle: "",
    courseDesc: "",
    courseImage: "",
    courseCategory: COURSE_CATEGORY[0],
    languageType: LANGUAGE_TYPE[0],
    courseLevel: COURSE_LEVEL[0],
    coursePrice: "0",     // backend default is 0
    maxStudents: "10",    // backend default is 10, min 1
    courseStartDate: "",
  });

  const update = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: val }));

  const canSubmit =
    form.courseTitle.trim().length > 0 &&
    form.courseDesc.trim().length > 0 &&
    !!form.courseCategory &&
    !!form.languageType &&
    !!form.courseLevel &&
    (form.coursePrice === "" || Number.isFinite(Number(form.coursePrice))) &&
    (form.maxStudents === "" ||
      (Number.isFinite(Number(form.maxStudents)) && Number(form.maxStudents) >= 1));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setErr(null);

    try {
      const input: Record<string, any> = {
        courseTitle: form.courseTitle.trim(),
        courseDesc: form.courseDesc.trim(),
        courseCategory: form.courseCategory,
        languageType: form.languageType,
        courseLevel: form.courseLevel,
        coursePrice: toNumberOr(form.coursePrice, 0),
        maxStudents: toNumberOr(form.maxStudents, 10),
      };

      if (form.courseImage.trim()) input.courseImage = form.courseImage.trim();

      const iso = toISODateOrNull(form.courseStartDate);
      if (iso) input.courseStartDate = iso;

      // No mentorId here; backend derives from JWT
      const data = await gqlFetchAuth<{ createCourse: { _id: string } }>(
        CREATE_COURSE,
        { input },
        undefined,
        { withCredentials: true }
      );

      const id = data?.createCourse?._id;
      if (!id) throw new Error("Course was created, but no ID returned.");

      onCreated?.(id);
      router.push(`/courses/${id}`);
    } catch (e: any) {
      setErr(e.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900">Create Course</h1>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Course title</label>
        <input
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-violet-500 outline-none"
          value={form.courseTitle}
          onChange={(e) => update("courseTitle", e.target.value)}
          placeholder="e.g., Master English"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-violet-500 outline-none"
          rows={5}
          value={form.courseDesc}
          onChange={(e) => update("courseDesc", e.target.value)}
          placeholder="What will students learn? Any prerequisites?"
          required
        />
      </div>

      {/* Optional image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Course image URL (optional)</label>
        <input
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-violet-500 outline-none"
          value={form.courseImage}
          onChange={(e) => update("courseImage", e.target.value)}
          placeholder="https://..."
        />
      </div>

      {/* Grid: Category, Language, Level, Price, MaxStudents, StartDate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:border-violet-500 outline-none"
            value={form.courseCategory}
            onChange={(e) => update("courseCategory", e.target.value as CourseCategory)}
          >
            {COURSE_CATEGORY.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language type</label>
          <select
            className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:border-violet-500 outline-none"
            value={form.languageType}
            onChange={(e) => update("languageType", e.target.value as LanguageType)}
          >
            {LANGUAGE_TYPE.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <select
            className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white focus:border-violet-500 outline-none"
            value={form.courseLevel}
            onChange={(e) => update("courseLevel", e.target.value as CourseLevel)}
          >
            {COURSE_LEVEL.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
          <input
            type="number"
            min={0}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-violet-500 outline-none"
            value={form.coursePrice}
            onChange={(e) => update("coursePrice", e.target.value)}
            placeholder="e.g., 100"
          />
        </div>

        {/* Max Students */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max students</label>
          <input
            type="number"
            min={1}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-violet-500 outline-none"
            value={form.maxStudents}
            onChange={(e) => update("maxStudents", e.target.value)}
            placeholder="e.g., 10"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
          <input
            type="date"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-violet-500 outline-none"
            value={form.courseStartDate}
            onChange={(e) => update("courseStartDate", e.target.value)}
          />
        </div>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="inline-flex items-center justify-center rounded-xl bg-violet-600 text-white px-5 py-3 font-semibold hover:bg-violet-500 disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create course"}
        </button>

        <button
          type="button"
          onClick={() =>
            setForm({
              courseTitle: "",
              courseDesc: "",
              courseImage: "",
              courseCategory: COURSE_CATEGORY[0],
              languageType: LANGUAGE_TYPE[0],
              courseLevel: COURSE_LEVEL[0],
              coursePrice: "0",
              maxStudents: "10",
              courseStartDate: "",
            })
          }
          className="rounded-xl px-5 py-3 font-semibold border border-gray-300 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
