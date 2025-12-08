// app/mentor/edit-course/[id]/EditCourseClient.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCalendar } from "react-icons/fi";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_COURSE, UPDATE_COURSE } from "@/graphql/query/courses/courses";
import { uploadFilesToB2 } from "@/services/b2Upload";
import { getAccessToken } from "@/providers/auth-context";
import { COURSE_LEVEL, LANGUAGE_OPTIONS, CATEGORY_OPTIONS } from "@/libs/enums/course.enums";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

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
  courseImage?: string | null;
  maxStudents?: number | null;
  courseStartDate?: string | null;
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

type GetCourseResp = { getCourse: CourseFromApi };
type UpdateCourseResp = { updateCourse: CourseFromApi };

const LEVEL_OPTIONS = Object.values(COURSE_LEVEL);
const STATUS_OPTIONS: CourseStatus[] = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
  "SUSPENDED",
  "COMPLETED",
  "PROGRESS",
];
const LANG_OPTIONS = Object.values(LANGUAGE_OPTIONS);
const CATEG_OPTIONS = Object.values(CATEGORY_OPTIONS);

/* ─────────────────── Utils ─────────────────── */

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : "Something went wrong. Please try again.";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export default function EditCourseClient({ courseId }: { courseId: string }) {
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [saveErr, setSaveErr] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    title: "",
    description: "",
    category: "",
    languageType: "",
    level: "BEGINNER" as CourseLevel,
    status: "DRAFT" as CourseStatus,
    price: "",
    maxStudents: "10",
    courseStartDate: null as Date | null,
  });

  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = React.useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const datePickerRef = React.useRef<HTMLDivElement>(null);

  /* ───────── Click outside to close date picker ───────── */
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDatePicker]);

  // ---- Load course on mount -------------------------------------------
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

      const c = data.getCourse;
      setForm({
        title: c.courseTitle,
        description: c.courseDesc,
        category: c.courseCategory,
        languageType: c.languageType,
        level: c.courseLevel,
        status: c.courseStatus,
        price: String(c.coursePrice),
        maxStudents: String(c.maxStudents || 10),
        courseStartDate: c.courseStartDate ? new Date(c.courseStartDate) : null,
      });

      if (c.courseImage) {
        const imageUrl = buildDownloadUrl(c.courseImage);
        setExistingImageUrl(c.courseImage);
        setImagePreview(imageUrl);
      }
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

  /* ───────── Handlers ───────── */

  const handleInputChange = React.useCallback(
    (
      field: keyof typeof form,
      value: string | CourseLevel | CourseStatus | Date | null
    ) => {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleImageChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    },
    []
  );

  const handleDateSelect = React.useCallback((date: Date) => {
    handleInputChange("courseStartDate", date);
    setShowDatePicker(false);
  }, [handleInputChange]);

  const isDisabled =
    saving ||
    uploadingImage ||
    !form.title.trim() ||
    !form.description.trim() ||
    !form.languageType.trim();

  // ---- Submit edit -----------------------------------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isDisabled) return;

    setSaving(true);
    setSaveErr(null);
    setSuccessMsg(null);

    try {
      let courseImageUrl: string | null = existingImageUrl;

      // 1) Upload new image to B2 (if selected)
      if (imageFile) {
        setUploadingImage(true);

        const token = getAccessToken();
        if (!token) {
          throw new Error("Not authenticated: missing access token.");
        }

        const uploadedKeys = await uploadFilesToB2(
          [imageFile],
          "courses-images",
          token
        );

        if (!uploadedKeys.length) {
          throw new Error("File upload failed: empty response.");
        }

        courseImageUrl = uploadedKeys[0];
        setUploadingImage(false);
      }

      const priceNumber = Number(form.price || 0);
      const safePrice = Number.isFinite(priceNumber) ? priceNumber : 0;

      const maxStudentsNumber = Number(form.maxStudents || 10);
      const safeMaxStudents = Number.isFinite(maxStudentsNumber) && maxStudentsNumber >= 1 ? maxStudentsNumber : 10;

      // 2) Build GraphQL input
      const input = {
        _id: courseId,
        courseTitle: form.title.trim(),
        courseDesc: form.description.trim(),
        courseCategory: form.category.trim(),
        languageType: form.languageType.trim(),
        courseLevel: form.level,
        coursePrice: safePrice,
        courseStatus: form.status,
        courseImage: courseImageUrl,
        maxStudents: safeMaxStudents,
        courseStartDate: form.courseStartDate,
      };

      await gqlFetchAuth<UpdateCourseResp>(
        UPDATE_COURSE,
        { input },
        undefined,
        { withCredentials: true }
      );

      setSuccessMsg("Course updated successfully.");
      router.push(`/mentor/courses/${courseId}`);
    } catch (e: any) {
      console.error("Update course error:", e);
      setSaveErr(getErrorMessage(e));
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  }

  // ---- UI --------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 lg:px-0">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border bg-white"
              onClick={() => router.back()}
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
                Edit Course
              </h1>
              <p className="text-xs text-slate-500">Loading...</p>
            </div>
          </div>
        </header>
        <main className="mx-auto mt-6 max-w-3xl px-4 pb-10 lg:px-0">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 lg:px-0">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border bg-white"
              onClick={() => router.back()}
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
                Edit Course
              </h1>
            </div>
          </div>
        </header>
        <main className="mx-auto mt-6 max-w-3xl px-4 pb-10 lg:px-0">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-rose-100">
            <p className="text-sm text-rose-600">{err}</p>
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
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-slate-50"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
                Edit Course
              </h1>
              <p className="text-xs text-slate-500">
                Update your course information and publish when ready.
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
                    <span>{imageFile || existingImageUrl ? "Change image" : "Upload image"}</span>
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
            <label
              htmlFor="course-title"
              className="text-xs font-medium text-slate-700"
            >
              Course title
            </label>
            <input
              id="course-title"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              value={form.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="IELTS Speaking for Beginners"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="course-description"
              className="text-xs font-medium text-slate-700"
            >
              Description
            </label>
            <textarea
              id="course-description"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              rows={4}
              value={form.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Short summary of what students will learn..."
              required
            />
          </div>

          {/* Category + Language */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-700">Category</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                value={form.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              >
                <option value="" disabled>
                  Select category
                </option>
                {CATEG_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700">Language</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                value={form.languageType}
                onChange={(e) => handleInputChange("languageType", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select language
                </option>
                {LANG_OPTIONS.map((lng) => (
                  <option key={lng} value={lng}>
                    {lng}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Level + Max Students */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="course-level"
                className="text-xs font-medium text-slate-700"
              >
                Level
              </label>
              <select
                id="course-level"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                value={form.level}
                onChange={(e) =>
                  handleInputChange("level", e.target.value as CourseLevel)
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
              <label
                htmlFor="max-students"
                className="text-xs font-medium text-slate-700"
              >
                Max Students
              </label>
              <input
                id="max-students"
                type="number"
                min={1}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                value={form.maxStudents}
                onChange={(e) => handleInputChange("maxStudents", e.target.value)}
                placeholder="10"
              />
            </div>
          </div>

          {/* Status + Start Date */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-700">
                Status
              </label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                value={form.status}
                onChange={(e) =>
                  handleInputChange("status", e.target.value as CourseStatus)
                }
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700">
                Course Start Date
              </label>
              <div className="relative" ref={datePickerRef}>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="mt-1 flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors hover:border-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <span className={form.courseStartDate ? "text-slate-900" : "text-slate-400"}>
                    {form.courseStartDate ? formatDate(form.courseStartDate) : "Select start date"}
                  </span>
                  <FiCalendar className="h-4 w-4 text-slate-400" />
                </button>

                {showDatePicker && (
                  <div className="absolute z-50 mt-2 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                    <DatePicker
                      selectedDate={form.courseStartDate}
                      onSelectDate={handleDateSelect}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="course-price"
              className="text-xs font-medium text-slate-700"
            >
              Price (₩)
            </label>
            <input
              id="course-price"
              type="number"
              min={0}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              value={form.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              disabled={saving || uploadingImage}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDisabled}
            >
              {saving || uploadingImage ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

/* ─────────────────── Date Picker Component ─────────────────── */

interface DatePickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderDays = () => {
    const days = [];
    const emptyDays = firstDayOfMonth;

    // Empty cells before first day
    for (let i = 0; i < emptyDays; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      date.setHours(0, 0, 0, 0);
      
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      const isToday = date.getTime() === today.getTime();
      const isPast = date < today;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isPast && onSelectDate(date)}
          disabled={isPast}
          className={`
            h-9 w-9 rounded-lg text-sm font-medium transition-all
            ${isSelected 
              ? "bg-blue-600 text-white shadow-sm" 
              : isPast
              ? "text-slate-300 cursor-not-allowed"
              : "text-slate-700 hover:bg-slate-100"
            }
            ${isToday && !isSelected ? "ring-2 ring-blue-200" : ""}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="w-72">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={previousMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-sm font-semibold text-slate-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="flex h-9 w-9 items-center justify-center text-xs font-medium text-slate-500">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
}