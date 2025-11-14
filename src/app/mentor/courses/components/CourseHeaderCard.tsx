// app/mentor/courses/components/CourseHeaderCard.tsx

"use client";

import { CourseStatus } from "@/libs/enums/course.enums";
import { CourseUI } from "@/libs/types/course/types";
import { FiPlus } from "react-icons/fi";

const courseStatusClass: Record<CourseStatus, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-600",
  DRAFT: "bg-slate-100 text-slate-600",
  ARCHIVED: "bg-amber-50 text-amber-700",
  SUSPENDED: "bg-rose-50 text-rose-600",
  COMPLETED: "bg-sky-50 text-sky-700",
  PROGRESS: "bg-indigo-50 text-indigo-600",
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
      <span className="text-xs text-slate-500">{label}</span>
      <span className="mt-0.5 text-base font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}

export default function CourseHeaderCard({
  course,
  onAddSection,
}: {
  course: CourseUI;
  onAddSection: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        {/* Text + stats */}
        <div>
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold leading-tight md:text-2xl">
                {course.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {course.description}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${courseStatusClass[course.status]}`}
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
                <span className="font-semibold text-violet-600">
                  {course.price.toLocaleString()} {course.currency}
                </span>
              }
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 md:flex-none md:px-6">
              Add Resource
            </button>
            <button
              onClick={onAddSection}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-violet-700 md:flex-none md:px-6"
            >
              <FiPlus className="h-4 w-4" />
              Add Section
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="order-first h-40 w-full overflow-hidden rounded-xl bg-slate-100 md:order-none md:h-44">
          <img
            src={
              course.image ||
              "https://via.placeholder.com/600x400?text=Course+Image"
            }
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
