"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Layers, Pencil, Star, Users } from "lucide-react";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

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
  courseImage?: string | null; // B2 key like "courses-images/uuid.png" OR full URL
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
  ADVANCED: "bg-brand-primary",
  PROFICIENCY: "bg-brand-selected",
  ALL_LEVELS: "bg-gray-600",
};

const STATUS_DOT: Record<CourseStatus, string> = {
  DRAFT: "bg-gray-400",
  PUBLISHED: "bg-emerald-500",
  ARCHIVED: "bg-amber-500",
  SUSPENDED: "bg-rose-500",
  COMPLETED: "bg-sky-500",
  PROGRESS: "bg-brand-primary/80",
};

export default function MentorCourseCard({
  _id,
  courseTitle,
  courseDesc,
  courseImage,
  courseLevel,
  coursePrice,
  courseStatus,
  courseEnrolledMembers = 0,
  courseTotalModules = 0,
  courseRating = 0,
  memberData,
}: MentorCourseCardProps) {
  // 🔥 Turn B2 key → full URL (or keep as-is if already a URL)
  const imageUrl = courseImage ? buildDownloadUrl(courseImage) : "";

  return (
    <div className="group relative rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(251,133,0,0.08)] overflow-hidden hover:shadow-[0_12px_36px_rgba(251,133,0,0.14)] transition">
      {/* Status chip */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-gray-700 shadow-sm">
        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[courseStatus]}`} />
        {courseStatus}
      </div>

      {/* Thumbnail */}
      <Link href={`/mentor/courses/${_id}`} className="block relative h-32 w-full overflow-hidden bg-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={courseTitle}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-3xl text-gray-300">
            📘
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
      </Link>

      {/* Body */}
      <div className="p-4">
        <Link href={`/mentor/courses/${_id}`} className="block">
          <h3 className="line-clamp-1 text-base font-extrabold text-gray-900 hover:text-brand-selected transition-colors">
            {courseTitle}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">{courseDesc}</p>
        </Link>

        <div className="mt-2 text-[11px] text-gray-500">
          {memberData?.memberFullName || "—"}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-700">
          <span className="inline-flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold">{Number(courseRating || 0).toFixed(1)}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span className="font-semibold">{courseTotalModules} modules</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span className="font-semibold">{courseEnrolledMembers} students</span>
          </span>
        </div>

        {/* Level + Price */}
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold text-white ${LEVEL_BADGE[courseLevel]}`}
          >
            {courseLevel}
          </span>
          <span className="text-sm font-extrabold text-gray-900">
            ₩{(coursePrice ?? 0).toLocaleString()}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/mentor/courses/${_id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-extrabold bg-brand-selected text-white hover:brightness-90 transition"
          >
            <Eye className="h-4 w-4" />
            View
          </Link>

          <Link
            href={`/mentor/edit-course/${_id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-extrabold text-gray-900 hover:bg-gray-50 transition"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
