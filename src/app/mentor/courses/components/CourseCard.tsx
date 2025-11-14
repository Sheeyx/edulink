"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

type CourseStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED"
  | "SUSPENDED"
  | "COMPLETED"
  | "PROGRESS";

type CourseLevel =
  | "BEGINNER"
  | "ELEMENTARY"
  | "INTERMEDIATE"
  | "UPPER_INTERMEDIATE"
  | "ADVANCED"
  | "PROFICIENCY"
  | "ALL_LEVELS";

export type MentorCourseCardProps = {
  _id: string;
  courseTitle: string;
  courseDesc: string;
  courseImage?: string | null;
  courseLevel: CourseLevel;
  languageType: string;
  coursePrice: number;
  courseStatus: CourseStatus;
  courseEnrolledMembers?: number | null;
  courseTotalModules?: number | null;
  courseTotalLessons?: number | null;
  courseRating?: number | null;
  memberData?: { memberFullName?: string | null } | null;
};

const LEVEL_BADGE: Record<CourseLevel, string> = {
  BEGINNER: "bg-emerald-600",
  ELEMENTARY: "bg-teal-600",
  INTERMEDIATE: "bg-amber-500",
  UPPER_INTERMEDIATE: "bg-orange-500",
  ADVANCED: "bg-indigo-600",
  PROFICIENCY: "bg-purple-600",
  ALL_LEVELS: "bg-slate-600",
};

const STATUS_DOT: Record<CourseStatus, string> = {
  DRAFT: "bg-gray-400",
  PUBLISHED: "bg-emerald-500",
  ARCHIVED: "bg-amber-500",
  SUSPENDED: "bg-rose-500",
  COMPLETED: "bg-sky-500",
  PROGRESS: "bg-indigo-500",
};

export default function MentorCourseCard({
  _id,
  courseTitle,
  courseDesc,
  courseImage,
  courseLevel,
  languageType,
  coursePrice,
  courseStatus,
  courseEnrolledMembers = 0,
  courseTotalModules = 0,
  courseTotalLessons = 0,
  courseRating = 0,
  memberData,
}: MentorCourseCardProps) {
  return (
    <div className="group relative w-full max-w-[280px] overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-lg hover:border-violet-200">
      {/* Status chip */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-gray-700 shadow-sm">
        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[courseStatus]}`} />
        {courseStatus}
      </div>

      {/* Thumbnail */}
      <Link href={`/mentor/courses/${_id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50">
          {courseImage ? (
            <Image
              src={courseImage}
              alt={courseTitle}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-3xl text-gray-400">
              📘
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="mt-3 space-y-1.5">
        <Link href={`/mentor/courses/${_id}`} className="block">
          <h3 className="line-clamp-1 text-[15px] font-semibold text-gray-900 hover:text-violet-600 transition-colors">
            {courseTitle}
          </h3>
          <p className="line-clamp-2 text-xs text-gray-500">{courseDesc}</p>
        </Link>

        <div className="text-[11px] text-gray-500">
          {memberData?.memberFullName || "—"}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-600">
          <span className="inline-flex items-center gap-0.5">
            <span className="text-amber-500">★</span>
            <span>{Number(courseRating || 0).toFixed(1)}</span>
          </span>
          <span className="text-gray-300">•</span>
          <span>{languageType}</span>
          <span className="text-gray-300">•</span>
          <span>{courseEnrolledMembers} students</span>
        </div>

        {/* Level + Price */}
        <div className="flex items-center justify-between pt-1">
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${LEVEL_BADGE[courseLevel]}`}
          >
            {courseLevel}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            ₩{(coursePrice ?? 0).toLocaleString()}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-3 flex gap-2">
  <Link
    href={`/mentor/courses/${_id}`}
    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-[13px] font-semibold text-white shadow-sm transition-all hover:shadow-[0_0_10px_rgba(139,92,246,0.5)] focus:ring-2 focus:ring-violet-400"
  >
    <Eye className="h-4 w-4" />
    View
  </Link>

  {/* 🔥 Edit goes to /mentor/edit-course/[id] */}
  <Link
  href={`/mentor/edit-course/${_id}`}
  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-[13px] font-semibold text-gray-800 shadow-sm transition-all hover:border-violet-400 hover:text-violet-600 focus:ring-2 focus:ring-violet-400"
>
  <Pencil className="h-4 w-4" />
  Edit
</Link>
</div>

      </div>
    </div>
  );
}
