"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Users, Globe, Clock3 } from "lucide-react";
import type { CourseDetail } from "./types";
import { normalizeImageSrc } from "./utils/images";

export default function CourseHero({ course }: { course: CourseDetail }) {
  const rating = Number.isFinite(course.rating) ? course.rating : 0;
  const clampedRating = Math.max(0, Math.min(5, rating));
  const roundedStars = Math.round(clampedRating);

  const instructorImg = normalizeImageSrc(course.instructor?.image);

  return (
    <div className="lg:col-span-2">
      {/* Breadcrumb */}
      <div className="text-xs text-white/60 mb-3">
        IT & Software <span className="mx-2">›</span> IT Certifications{" "}
        <span className="mx-2">›</span> {course.language}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
        {course.title}
      </h1>

      {/* Description */}
      <p className="mt-3 text-white/75 text-base md:text-lg leading-relaxed max-w-3xl">
        {course.desc}
      </p>

      {/* Stats */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="flex items-center gap-2">
          <span className="font-semibold">{clampedRating.toFixed(1)}</span>
          <span className="flex gap-1 text-amber-300">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4"
                fill={i < roundedStars ? "currentColor" : "none"}
              />
            ))}
          </span>
          <span className="text-violet-300 underline underline-offset-2 cursor-pointer">
            ({Math.max(0, Math.round(course.students / 40))} ratings)
          </span>
        </span>

        <span className="text-white/60">•</span>

        <span className="flex items-center gap-2 text-white/80">
          <Users className="h-4 w-4" />
          {course.students.toLocaleString()} students
        </span>

        <span className="text-white/60">•</span>

        <span className="flex items-center gap-2 text-white/80">
          <Globe className="h-4 w-4" />
          {course.language}
        </span>

        {course.updatedAt && (
          <>
            <span className="text-white/60">•</span>
            <span className="flex items-center gap-2 text-white/80">
              <Clock3 className="h-4 w-4" />
              Last updated {new Date(course.updatedAt).toLocaleDateString()}
            </span>
          </>
        )}
      </div>

      {/* INSTRUCTOR (MENTOR) BLOCK */}
      <div className="mt-6 flex items-center gap-4">
        <div className="relative h-14 w-14 rounded-full overflow-hidden border border-white/20 bg-white/10">
          <Image
            src={instructorImg}
            alt={course.instructor?.name || "Instructor"}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>

        <div className="text-sm">
          <div className="text-white/60">Instructor</div>
          <div className="font-semibold text-white">
            {course.instructor?.name || "Instructor"}
          </div>
        </div>
      </div>
    </div>
  );
}
