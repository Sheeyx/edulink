"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { gqlFetchAuth } from "@/libs/graphql";
import { FiArrowLeft } from "react-icons/fi";
import { CREATE_COURSE } from "@/graphql/mutation/course/course";
import { uploadFilesToB2 } from "@/services/b2Upload";
import { getAccessToken } from "@/providers/auth-context";

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
  courseImage?: string | null;
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
    status: "DRAFT" as CourseStatus, // UI-only, not sent to backend
    price: "",
  });

  // Image upload state
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = React.useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveErr(null);
    setSuccessMsg(null);

    try {
      let courseImageUrl: string | null = null;

      // 1) Upload to B2 if image selected
      if (imageFile) {
        setUploadingImage(true);

        const token = getAccessToken();
        if (!token) {
          throw new Error("Not authenticated: missing access token.");
        }

        // Upload file(s) to backend → B2
        const uploadedKeys = await uploadFilesToB2(
          [imageFile],
          "courses-images",
          token
        );
        if (!uploadedKeys.length) {
          throw new Error("File upload failed: empty response.");
        }

        // ✅ Backend expects only the key: "courses-images/....png"
        courseImageUrl = uploadedKeys[0];

        setUploadingImage(false);
      }

      // 2) Build GraphQL input (matching backend)
      const input = {
        courseTitle: form.title.trim(),
        courseDesc: form.description.trim(),
        courseCategory: form.category.trim(),
        languageType: form.languageType.trim(),
        courseLevel: form.level,
        coursePrice: Number(form.price || 0),
        courseImage: courseImageUrl, // e.g. "courses-images/uuid.png" or null
      };

      // Debug (optional)
      // console.log("CREATE_COURSE input:", input);

      const data = await gqlFetchAuth<CreateCourseResp>(
        CREATE_COURSE,
        { input },
        undefined,
        { withCredentials: true }
      );

      const created = data.createCourse;
      setSuccessMsg("Course created successfully.");

      router.push(`/mentor/courses/${created._id}`);
    } catch (err: any) {
      console.error("Create course error:", err);
      setSaveErr(err.message || "Failed to create course.");
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  const isDisabled =
    saving ||
    uploadingImage ||
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

          {/* Course image upload */}
          <div>
            <label className="text-xs font-medium text-slate-700">
              Course thumbnail
            </label>

            <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Course thumbnail preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-[10px] text-slate-400">
                      <span>Thumbnail</span>
                      <span>Preview</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    <span>{imageFile ? "Change image" : "Upload image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="mt-1 text-[11px] text-slate-400">
                    JPG, PNG, or WEBP. Recommended ratio ~16:9.
                  </p>
                </div>
              </div>
            </div>
          </div>

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
                placeholder="LANGUAGE / BUSINESS / ..."
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
                placeholder="ENGLISH / TOPIK / ..."
                required
              />
            </div>
          </div>

          {/* Level + Status (status UI only, not sent on create) */}
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
                Status (not used on create)
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
              <p className="mt-1 text-[11px] text-slate-400">
                Status is managed after creation from the course edit page.
              </p>
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
              disabled={saving || uploadingImage}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isDisabled}
            >
              {saving || uploadingImage ? "Creating..." : "Create course"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
