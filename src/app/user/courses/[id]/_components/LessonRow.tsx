"use client";

import { useRouter } from "next/navigation";
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

export default function LessonRow({
  lesson,
  index,
  courseId,
}: {
  lesson: Lesson;
  index: number;
  courseId: string;
}) {
  const router = useRouter();
  const duration = normalizeDuration(lesson.lessonDuration);
  const hasUrl = !!lesson.lessonUrl;

  console.log(lesson, "lesson")

  const onPlay = () => {
    // ✅ THIS MATCHES YOUR STRUCTURE
    router.push(`/user/courses/${courseId}/learn/${lesson._id}`);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-2xl border border-gray-200 bg-gray-50 grid place-items-center text-sm font-extrabold">
          {index}
        </div>

        <div className="min-w-0">
          <div className="font-extrabold text-gray-900 truncate">
            {lesson.lessonTitle}
          </div>

          <div className="mt-1 flex gap-3 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1">
              {contentIcon(lesson.lessonContentType)}
              {lesson.lessonContentType || "CONTENT"}
            </span>

            {duration && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {duration}
              </span>
            )}
          </div>
        </div>
      </div>

      {hasUrl ? (
        <button
          onClick={onPlay}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-selected text-white px-4 py-2 text-sm font-extrabold hover:brightness-90"
        >
          <PlayCircle className="w-4 h-4" />
          Play
        </button>
      ) : (
        <button
          disabled
          className="inline-flex items-center gap-2 rounded-xl bg-gray-200 text-gray-600 px-4 py-2 text-sm font-extrabold"
        >
          <PlayCircle className="w-4 h-4" />
          No video
        </button>
      )}
    </div>
  );
}
