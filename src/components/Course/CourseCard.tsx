// components/CourseCard.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import LikeButton from "./LikeButton";
import type { UICourseCard } from "@/libs/CourseMapper";

export default function CourseCard({ course }: { course: UICourseCard }) {
  const [imgError, setImgError] = useState(false);

  const hasImage = Boolean(course.image?.trim()) && !imgError;

  return (
    <div className="flex h-full w-full flex-col border border-gray-200 rounded-xl shadow-sm bg-white p-4">
      {/* Image / Placeholder */}
      <div className="relative w-full h-40 shrink-0 rounded-lg overflow-hidden bg-gray-100 group">
        {hasImage ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-5xl text-gray-400">
            📘
          </div>
        )}

        {course.id && (
          <LikeButton
            courseId={course.id}
            size="sm"
            className="absolute right-2 top-2"
          />
        )}
      </div>

      <h3 className="mt-4 line-clamp-2 font-bold text-md leading-snug text-gray-700">
        {course.title}
      </h3>
      <p className="mb-1 line-clamp-2 text-sm text-gray-600">{course.subtitle}</p>
      <p className="mb-2 line-clamp-1 text-sm text-gray-500">{course.instructor}</p>

      <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
        <div className="flex items-center gap-1 text-yellow-500 font-medium">
          <FaStar />
          <span>{course.rating}</span>
        </div>
        <span className="text-gray-500">({course.ratingCount} ratings)</span>
        <span className="text-gray-500">{course.hours} total hours</span>
        <span className="text-gray-500">{course.lectures} lectures</span>

        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${
            course.level === "BEGINNER"
              ? "bg-gradient-to-r from-green-400 to-green-600"
              : course.level === "INTERMEDIATE"
              ? "bg-gradient-to-r from-yellow-400 to-orange-500"
              : "bg-gradient-to-r from-purple-500 to-indigo-600"
          }`}
        >
          {course.level}
        </span>
      </div>

      {/* Pushes price/button to the bottom so every card ends flush, regardless of how much text is above */}
      <div className="mt-auto">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-lg text-black">{course.price}</span>
          {course.oldPrice ? (
            <span className="line-through text-gray-400 text-sm">
              {course.oldPrice}
            </span>
          ) : null}
        </div>

        <button className="mt-3 w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition">
          Add to cart
        </button>
      </div>
    </div>
  );
}
