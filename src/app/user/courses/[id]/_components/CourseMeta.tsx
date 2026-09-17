"use client";

import Image from "next/image";
import { BadgeCheck, Layers, Clock, Star, Users } from "lucide-react";
import type { EnrolledCourseDetails } from "../_types/courseDetails.types";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

export default function CourseMeta({
  course,
  progress,
}: {
  course: EnrolledCourseDetails;
  progress: { total: number; available: number; percent: number; firstLessonId: string | null };
}) {
  const courseImg =
    buildDownloadUrl(course.courseImage) ||
    "https://ui-avatars.com/api/?name=Course&background=FFF1DB&color=B45500";

  const mentorName = course.memberData?.memberFullName || "Mentor";
  const mentorImg =
    buildDownloadUrl(course.memberData?.memberImage) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      mentorName
    )}&background=FFF3E0&color=B45500`;

  const modules = course.courseTotalModules ?? course.sectionsWithLessons?.length ?? 0;
  const lessons = course.courseTotalLessons ?? progress.total ?? 0;

  const seatsText =
    typeof course.currentEnrolledMembers === "number" &&
    typeof course.maxStudents === "number"
      ? `${course.currentEnrolledMembers}/${course.maxStudents}`
      : null;

  const rating =
    typeof course.courseRating === "number"
      ? Math.max(0, Math.min(5, course.courseRating))
      : 0;

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-[0_10px_35px_rgba(251,133,0,0.08)] overflow-hidden">
      <div className="relative h-52 w-full">
        <Image
          src={courseImg}
          alt={course.courseTitle}
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />

        <div className="absolute left-5 bottom-5 right-5 flex flex-wrap items-center gap-2">
          {course.languageType && (
            <span className="rounded-xl bg-white/90 px-3 py-1 text-xs font-extrabold text-gray-900">
              {course.languageType}
            </span>
          )}
          {course.courseLevel && (
            <span className="rounded-xl bg-white/90 px-3 py-1 text-xs font-extrabold text-gray-900">
              {course.courseLevel}
            </span>
          )}
          {course.courseCategory && (
            <span className="rounded-xl bg-white/90 px-3 py-1 text-xs font-extrabold text-gray-900">
              {course.courseCategory}
            </span>
          )}
          {course.courseStatus && (
            <span className="rounded-xl bg-white/90 px-3 py-1 text-xs font-extrabold text-gray-900 inline-flex items-center gap-2">
              <BadgeCheck className="w-4 h-4" />
              {course.courseStatus}
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-200">
              <Image
                src={mentorImg}
                alt={mentorName}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-gray-900 truncate">
                {mentorName}
              </div>
              <div className="text-xs text-gray-500 truncate">Instructor</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
            <div className="inline-flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="font-bold">{modules} modules</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-bold">{lessons} lessons</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span className="font-bold">{rating ? rating.toFixed(1) : "—"}</span>
              <span className="text-gray-400">/5</span>
            </div>

            {seatsText && (
              <div className="inline-flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-bold">{seatsText}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-extrabold text-gray-900">Lessons ready</span>
            <span className="font-extrabold text-brand-selected">
              {progress.available}/{progress.total || lessons}
            </span>
          </div>

          <div className="mt-2 h-3 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-primary transition-all"
              style={{ width: `${progress.percent}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            {progress.total ? `${progress.percent}% lessons have content URLs` : "No lessons yet"}
          </p>
        </div>
      </div>
    </div>
  );
}
