"use client";

import { PlayCircle, FileText, Video, Lock, Check } from "lucide-react";
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

export default function LessonRow({
  lesson,
  index,
  isActive,
  onSelect,
}: {
  lesson: Lesson;
  index: number;
  isActive?: boolean;
  onSelect: (lessonId: string) => void;
}) {
  const duration = normalizeDuration(lesson.lessonDuration);
  const hasUrl = !!lesson.lessonUrl;
  const isLocked = !!lesson.isLocked;
  const isCompleted = !!lesson.lessonProgress?.isCompleted;
  const pct = Math.round(lesson.lessonProgress?.progressPercentage ?? 0);

  const onPlay = () => onSelect(lesson._id);

  return (
    <div
      onClick={!isLocked && hasUrl ? onPlay : undefined}
      className={[
        "rounded-2xl border p-4 flex items-center justify-between gap-3 transition",
        isActive ? "border-brand-selected bg-brand-primary/10" : "border-gray-200 bg-white",
        !isLocked && hasUrl ? "cursor-pointer hover:bg-gray-50" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={[
            "mt-0.5 w-5 h-5 rounded border-2 grid place-items-center shrink-0 transition",
            isCompleted ? "bg-brand-success border-brand-success" : "border-gray-300 bg-white",
          ].join(" ")}
          title={isCompleted ? "Completed" : "Not completed"}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-extrabold text-gray-900 truncate">
              {index}. {lesson.lessonTitle}
            </div>
            {isLocked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600">
                <Lock className="w-3 h-3" />
                Locked
              </span>
            )}
          </div>

          <div className="mt-1 flex gap-3 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1">
              {contentIcon(lesson.lessonContentType)}
              {duration || lesson.lessonContentType || "Content"}
            </span>

            {!isCompleted && pct > 0 ? <span className="font-bold">{pct}% watched</span> : null}
          </div>
        </div>
      </div>

      {isLocked ? (
        <button
          disabled
          className="inline-flex items-center gap-2 rounded-xl bg-gray-200 text-gray-600 px-4 py-2 text-sm font-extrabold shrink-0"
        >
          <Lock className="w-4 h-4" />
          Locked
        </button>
      ) : hasUrl ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className={[
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition shrink-0",
            isActive
              ? "bg-brand-selected text-white"
              : "bg-brand-selected text-white hover:brightness-90",
          ].join(" ")}
        >
          <PlayCircle className="w-4 h-4" />
          {isActive ? "Playing" : "Play"}
        </button>
      ) : (
        <button
          disabled
          className="inline-flex items-center gap-2 rounded-xl bg-gray-200 text-gray-600 px-4 py-2 text-sm font-extrabold shrink-0"
        >
          <PlayCircle className="w-4 h-4" />
          No video
        </button>
      )}
    </div>
  );
}
