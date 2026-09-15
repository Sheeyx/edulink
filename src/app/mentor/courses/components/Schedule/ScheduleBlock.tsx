"use client";

import * as React from "react";
import {
  FiCalendar,
  FiClock,
  FiEdit2,
  FiTrash2,
  FiVideo,
  FiBookOpen,
} from "react-icons/fi";
import type { ScheduleUI } from "@/libs/types/course/types";
import type { CourseScheduleStatus } from "@/libs/enums/course.enums";

const STATUS_CLASS: Record<CourseScheduleStatus, string> = {
  SCHEDULED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-rose-50 text-rose-600",
  COMPLETED: "bg-sky-50 text-sky-700",
};

function formatDateTime(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  schedules: ScheduleUI[];
  lessonTitleById?: Record<string, string>;
  onEdit: (schedule: ScheduleUI) => void;
  onDelete: (schedule: ScheduleUI) => void;
};

export default function ScheduleBlock({
  schedules,
  lessonTitleById,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight lg:text-lg">
          Live Class Schedule
        </h3>
        <span className="text-xs text-slate-500">
          {schedules.length} class{schedules.length === 1 ? "" : "es"}
        </span>
      </div>

      {schedules.length === 0 ? (
        <div className="rounded-xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
          No live classes scheduled yet. Use{" "}
          <span className="font-medium text-purple-700">Add Class</span> to
          schedule a session for students.
        </div>
      ) : (
        <ul className="space-y-2">
          {schedules.map((s) => (
            <li
              key={s.id}
              className="flex items-start justify-between gap-3 rounded-xl bg-white px-3 py-2.5 text-sm ring-1 ring-slate-100"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                  <FiCalendar className="h-4 w-4" />
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${STATUS_CLASS[s.status]}`}
                    >
                      {s.status}
                    </span>
                    {s.lessonId && lessonTitleById?.[s.lessonId] && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <FiBookOpen className="h-3 w-3" />
                        {lessonTitleById[s.lessonId]}
                      </span>
                    )}
                  </div>

                  <ul className="mt-1.5 space-y-1">
                    {s.startAt.map((dt, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-1.5 text-xs text-slate-600"
                      >
                        <FiClock className="h-3 w-3 shrink-0" />
                        {formatDateTime(dt)}
                      </li>
                    ))}
                  </ul>

                  {s.meetLinks.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {s.meetLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1 text-[11px] font-medium text-sky-700 hover:bg-sky-100"
                        >
                          <FiVideo className="h-3 w-3" />
                          Meet link {s.meetLinks.length > 1 ? i + 1 : ""}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  title="Edit class"
                  onClick={() => onEdit(s)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100"
                >
                  <FiEdit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  title="Delete class"
                  onClick={() => onDelete(s)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
