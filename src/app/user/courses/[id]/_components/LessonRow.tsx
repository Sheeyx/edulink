"use client";

import { PlayCircle, Clock, FileText, Video } from "lucide-react";
import type { Lesson } from "../_types/courseDetails.types";

function contentIcon(type?: string | null) {
  const t = (type || "").toUpperCase();
  if (t.includes("VIDEO")) return <Video className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
}

function normalizeDuration(d?: string | number | null) {
  if (d === null || d === undefined) return null;
  return String(d);
}

export default function LessonRow({ lesson, index }: { lesson: Lesson; index: number }) {
  const url = lesson.lessonUrl || null;
  const duration = normalizeDuration(lesson.lessonDuration);
  const status = (lesson.lessonStatus || "").toUpperCase();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-2xl border border-gray-200 bg-gray-50 grid place-items-center text-sm font-extrabold text-gray-900">
          {index}
        </div>

        <div className="min-w-0">
          <div className="font-extrabold text-gray-900 truncate">
            {lesson.lessonTitle}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1">
              {contentIcon(lesson.lessonContentType)}
              {(lesson.lessonContentType || "CONTENT").toString().toUpperCase()}
            </span>

            {duration ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {duration}
              </span>
            ) : null}

            {status ? (
              <span className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 font-bold text-gray-700">
                {status}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {url ? (
        <a
          href={url}
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-purple-700 text-white px-4 py-2 text-sm font-extrabold hover:bg-purple-800 transition"
        >
          <PlayCircle className="w-4 h-4" />
          Play
        </a>
      ) : (
        <button
          disabled
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gray-200 text-gray-600 px-4 py-2 text-sm font-extrabold cursor-not-allowed"
        >
          <PlayCircle className="w-4 h-4" />
          No URL
        </button>
      )}
    </div>
  );
}
