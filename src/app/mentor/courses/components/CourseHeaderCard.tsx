// app/mentor/courses/components/CourseHeaderCard.tsx

"use client";

import { CourseStatus } from "@/libs/enums/course.enums";
import { CourseUI } from "@/libs/types/course/types";
import { FiCalendar, FiPlus } from "react-icons/fi";

const courseStatusClass: Record<CourseStatus, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700",
  DRAFT: "bg-gray-100 text-gray-600",
  ARCHIVED: "bg-amber-50 text-amber-700",
  SUSPENDED: "bg-rose-50 text-rose-600",
  COMPLETED: "bg-sky-50 text-sky-700",
  PROGRESS: "bg-purple-50 text-purple-700",
};

function Stat({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="mt-0.5 text-base font-extrabold text-gray-900">
        {value}
      </span>
    </div>
  );
}

export default function CourseHeaderCard({
  course,
  onAddSection,
  onAddResource,
  onAddSchedule,
}: {
  course: CourseUI;
  onAddSection: () => void;
  onAddResource: () => void;
  onAddSchedule: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_24px_rgba(99,99,160,0.08)]">
      <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        {/* Text + stats */}
        <div>
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-black leading-tight text-gray-900 md:text-2xl">
                {course.title}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {course.description}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${courseStatusClass[course.status]}`}
            >
              {course.status}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <Stat label="Modules" value={course.modules} />
            <Stat label="Lessons" value={course.lessons} />
            <Stat label="Rating" value={course.rating} />
            <Stat
              label="Price"
              value={
                <span className="font-extrabold text-purple-700">
                  {course.price.toLocaleString()} {course.currency}
                </span>
              }
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onAddResource}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-emerald-700 transition md:flex-none md:px-6"
            >
              <FiPlus className="h-4 w-4" />
              Add Resource
            </button>
            <button
              onClick={onAddSection}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-purple-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-purple-800 transition md:flex-none md:px-6"
            >
              <FiPlus className="h-4 w-4" />
              Add Section
            </button>
            <button
              onClick={onAddSchedule}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-sky-700 transition md:flex-none md:px-6"
            >
              <FiCalendar className="h-4 w-4" />
              Add Class
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="order-first h-40 w-full overflow-hidden rounded-2xl bg-gray-100 md:order-none md:h-44">
          <img
            src={
              course.image ||
              "https://ui-avatars.com/api/?name=Course&background=ede9fe&color=4c1d95&size=256"
            }
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
