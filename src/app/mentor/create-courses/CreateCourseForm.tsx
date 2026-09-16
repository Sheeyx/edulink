"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FiCalendar } from "react-icons/fi";

import { gqlFetchAuth } from "@/libs/graphql";
import { CREATE_COURSE } from "@/graphql/mutation/course/course";
import { uploadFilesToB2 } from "@/services/b2Upload";
import { getAccessToken } from "@/providers/auth-context";
import { COURSE_LEVEL, COURSE_STATUS, LANGUAGE_OPTIONS, CATEGORY_OPTIONS, CourseLevel, CourseStatus } from "@/libs/enums/course.enums";
import { CreateCourseResp, CreateFormState } from "@/libs/types/course/types";


const LEVEL_OPTIONS = Object.values(COURSE_LEVEL);
const STATUS_OPTIONS = Object.values(COURSE_STATUS);
const LANG_OPTIONS = Object.values(LANGUAGE_OPTIONS);
const CATEG_OPTIONS = Object.values(CATEGORY_OPTIONS);

const INITIAL_FORM: CreateFormState = {
  title: "",
  description: "",
  category: "",
  languageType: "",
  level: "BEGINNER",
  status: "DRAFT",
  price: "",
  maxStudents: 10,
  courseStartDate: null,
};

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

export default function CreateCourseClient() {
  const router = useRouter();

  const [form, setForm] = React.useState<CreateFormState>(INITIAL_FORM);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const [saving, setSaving] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [saveErr, setSaveErr] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

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

  /* ───────── Handlers ───────── */

  const handleInputChange = React.useCallback(
    (
      field: keyof CreateFormState,
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

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isDisabled) return;

      setSaving(true);
      setSaveErr(null);
      setSuccessMsg(null);

      try {
        let courseImageUrl: string | null = null;

        // 1) Upload image to B2 (if selected)
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
          courseTitle: form.title.trim(),
          courseDesc: form.description.trim(),
          courseCategory: form.category.trim(),
          languageType: form.languageType.trim(),
          courseLevel: form.level,
          coursePrice: safePrice,
          courseImage: courseImageUrl,
          maxStudents: safeMaxStudents,
          courseStartDate: form.courseStartDate,
        };

        const data = await gqlFetchAuth<CreateCourseResp>(
          CREATE_COURSE,
          { input },
          undefined,
          { withCredentials: true }
        );

        const created = data.createCourse;
        setSuccessMsg("Course created successfully.");
        router.push(`/mentor/courses/${created._id}`);
      } catch (err: unknown) {
        console.error("Create course error:", err);
        setSaveErr(getErrorMessage(err));
      } finally {
        setSaving(false);
        setUploadingImage(false);
      }
    },
    [form, imageFile, isDisabled, router]
  );

  /* ─────────────────── Render ─────────────────── */

  return (
    <div>
      {/* In-content header (mentor layout already provides the page shell) */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mt-3">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">
          Create Course
        </h1>
        <p className="mt-1 text-gray-600">
          Add a new course to your mentor dashboard.
        </p>
      </div>

      {/* Content */}
      <div className="mt-6 max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_8px_24px_rgba(99,99,160,0.08)]"
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
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
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
            <label
              htmlFor="course-title"
              className="text-xs font-medium text-slate-700"
            >
              Course title
            </label>
            <input
              id="course-title"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
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
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
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
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
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
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
                value={form.languageType}
                onChange={(e) => handleInputChange("languageType", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select language
                </option>
                {LANGUAGE_OPTIONS.map((lng) => (
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
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
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
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
                value={form.maxStudents}
                onChange={(e) => handleInputChange("maxStudents", e.target.value)}
                placeholder="10"
              />
            </div>
          </div>

          {/* Price + Start Date */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
                value={form.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700">
                Course Start Date
              </label>
              <div className="relative" ref={datePickerRef}>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="mt-1 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors hover:border-gray-400 focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
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

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              disabled={saving || uploadingImage}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-brand-selected px-5 py-2 text-sm font-extrabold text-white transition-colors hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDisabled}
            >
              {saving || uploadingImage ? "Creating..." : "Create course"}
            </button>
          </div>
        </form>
      </div>
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
              ? "bg-brand-selected text-white shadow-sm" 
              : isPast
              ? "text-slate-300 cursor-not-allowed"
              : "text-slate-700 hover:bg-slate-100"
            }
            ${isToday && !isSelected ? "ring-2 ring-brand-primary/25" : ""}
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