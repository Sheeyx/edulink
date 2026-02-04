"use client";

import Image from "next/image";
import Link from "next/link";
import { Layers, Clock, PlayCircle, Users } from "lucide-react";

import type { EnrolledCourse } from "../_types/courses.types";
import { computeProgress } from "../_utils/progress";
import RatingRow from "./RatingRow";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

export default function CourseCard({ course }: { course: EnrolledCourse }) {
  const img =
    buildDownloadUrl(course.courseImage) ||
    "https://ui-avatars.com/api/?name=Course&background=ede9fe&color=4c1d95";

  const mentorName = course.memberData?.memberFullName || "Mentor";
  const mentorAvatar =
    buildDownloadUrl(course.memberData?.memberImage) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      mentorName
    )}&background=EEF2FF&color=3730A3`;

  const { total, available, percent, firstLessonUrl } = computeProgress(course);

  const modules = course.courseTotalModules ?? course.sectionsWithLessons?.length ?? 0;
  const lessons = course.courseTotalLessons ?? total ?? 0;

  const seatsText =
    typeof course.currentEnrolledMembers === "number" &&
    typeof course.maxStudents === "number"
      ? `${course.currentEnrolledMembers}/${course.maxStudents}`
      : null;

  return (
    <div
      className="rounded-2xl border border-gray-100 bg-white
                 shadow-[0_8px_24px_rgba(99,99,160,0.08)]
                 overflow-hidden hover:shadow-[0_12px_36px_rgba(99,99,160,0.14)]
                 transition"
    >
      {/* image */}
      <div className="relative h-32 w-full">
        <Image
          src={img}
          alt={course.courseTitle}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />

        <div className="absolute left-3 bottom-3 right-3 flex flex-wrap items-center gap-1.5">
          {course.courseLevel && (
            <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-extrabold text-gray-900">
              {course.courseLevel}
            </span>
          )}
          {course.courseCategory && (
            <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-extrabold text-gray-900">
              {course.courseCategory}
            </span>
          )}
        </div>
      </div>

      {/* content */}
      <div className="p-4">
        <div className="min-w-0">
          <div className="text-base font-extrabold text-gray-900 truncate">
            {course.courseTitle}
          </div>

          {course.courseDesc ? (
            <div className="mt-0.5 text-xs text-gray-600 line-clamp-2">
              {course.courseDesc}
            </div>
          ) : (
            <div className="mt-0.5 text-xs text-gray-500">No description.</div>
          )}
        </div>

        {/* mentor + seats */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
              <Image
                src={mentorAvatar}
                alt={mentorName}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-gray-900 truncate">
                {mentorName}
              </div>
              <div className="text-[11px] text-gray-500 truncate">Instructor</div>
            </div>
          </div>

          {seatsText && (
            <div className="inline-flex items-center gap-1 text-xs text-gray-700">
              <Users className="w-3.5 h-3.5" />
              <span className="font-bold">{seatsText}</span>
              {course.isFull ? (
                <span className="ml-1 text-[11px] font-extrabold text-red-600">
                  FULL
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* stats */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-700">
          <div className="inline-flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span className="font-semibold">{modules} modules</span>
          </div>

          <div className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-semibold">{lessons} lessons</span>
          </div>

          <RatingRow rating={course.courseRating} />
        </div>

        {/* progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-700">Lessons ready</span>
            <span className="font-extrabold text-purple-700">
              {available}/{total || lessons}
            </span>
          </div>

          <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-purple-600 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="mt-1.5 text-[11px] text-gray-500">
            {total ? `${percent}% lessons have URLs` : "No lessons yet"}
          </div>
        </div>

        {/* actions */}
        <div className="mt-4 grid gap-2">
          {firstLessonUrl ? (
            <Link
              href={firstLessonUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-extrabold
                         bg-purple-700 text-white hover:bg-purple-800 transition"
            >
              <PlayCircle className="w-4 h-4" />
              Continue
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-extrabold
                         bg-gray-200 text-gray-600 cursor-not-allowed"
            >
              <PlayCircle className="w-4 h-4" />
              Continue (no lesson yet)
            </button>
          )}

          <Link
            href={`/user/courses/${course._id}`}
            className="inline-flex items-center justify-center rounded-xl
                       border border-gray-200 bg-white py-2.5
                       text-sm font-extrabold text-gray-900
                       hover:bg-gray-50 transition"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
