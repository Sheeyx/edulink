"use client";

import * as React from "react";
import { ChevronDown, Layers, Maximize2, Minimize2 } from "lucide-react";
import type { EnrolledCourseDetails, Section } from "../_types/courseDetails.types";
import { formatDurationSeconds, lessonDurationSeconds } from "../_utils/format";
import LessonRow from "./LessonRow";

function sortSections(sections: Section[]) {
  return [...sections].sort((a, b) => (a.moduleOrder ?? 0) - (b.moduleOrder ?? 0));
}

export default function ModulesAccordion({
  course,
  activeLessonId,
  onSelectLesson,
  searchQuery,
  theaterMode,
  onToggleTheater,
  bare,
}: {
  course: EnrolledCourseDetails;
  activeLessonId?: string | null;
  onSelectLesson: (lessonId: string) => void;
  /** Filters lessons within each section by title; sections with no matches collapse out. */
  searchQuery?: string;
  theaterMode?: boolean;
  onToggleTheater?: () => void;
  /** When true, renders without the outer card chrome (used inside the "Course content" tab, which already has its own container). */
  bare?: boolean;
}) {
  const sections = sortSections(course.sectionsWithLessons || []);
  const [openId, setOpenId] = React.useState<string | null>(sections[0]?._id || null);
  const q = (searchQuery || "").trim().toLowerCase();

  // Keep the section containing the active lesson expanded as it changes.
  React.useEffect(() => {
    if (!activeLessonId) return;
    const found = sections.find((s) => (s.lessons || []).some((l) => l._id === activeLessonId));
    if (found?._id) setOpenId(found._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLessonId]);

  const visibleSections = sections
    .map((s) => {
      const lessons = s.lessons || [];
      const filtered = q ? lessons.filter((l) => (l.lessonTitle || "").toLowerCase().includes(q)) : lessons;
      return { section: s, lessons: filtered };
    })
    .filter(({ lessons }) => !q || lessons.length > 0);

  const content = (
    <>
      {sections.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-sm text-gray-600">
          No modules yet.
        </div>
      ) : visibleSections.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-sm text-gray-600">
          No lessons match &quot;{searchQuery}&quot;.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {visibleSections.map(({ section: s, lessons }, idx) => {
            const opened = q ? true : openId === s._id;
            const allLessons = s.lessons || [];
            const completedCount = allLessons.filter((l) => l.lessonProgress?.isCompleted).length;
            const totalSeconds = allLessons.reduce((sum, l) => sum + lessonDurationSeconds(l.lessonDuration), 0);

            return (
              <div key={s._id} className="rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenId(opened ? null : s._id)}
                  className="w-full flex items-center justify-between gap-3 p-4 bg-white hover:bg-gray-50 transition"
                >
                  <div className="min-w-0 text-left">
                    <div className="font-extrabold text-gray-900 truncate">
                      {typeof s.moduleOrder === "number"
                        ? `Section ${s.moduleOrder}: ${s.moduleTitle}`
                        : `Section ${idx + 1}: ${s.moduleTitle}`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {completedCount} / {allLessons.length}
                      {totalSeconds > 0 ? ` · ${formatDurationSeconds(totalSeconds)}` : ""}
                    </div>
                  </div>

                  <ChevronDown
                    className={[
                      "w-5 h-5 text-gray-500 transition-transform shrink-0",
                      opened ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                  />
                </button>

                {opened && (
                  <div className="bg-gray-50 p-4">
                    {lessons.length === 0 ? (
                      <div className="text-sm text-gray-600">No lessons in this module yet.</div>
                    ) : (
                      <div className="space-y-2">
                        {lessons.map((l) => {
                          const i = allLessons.findIndex((al) => al._id === l._id);
                          return (
                            <LessonRow
                              key={l._id}
                              index={i + 1}
                              lesson={l}
                              isActive={activeLessonId === l._id}
                              onSelect={onSelectLesson}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  if (bare) return content;

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-[0_10px_35px_rgba(251,133,0,0.08)] p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 rounded-2xl border border-brand-primary/15 bg-brand-primary/10 grid place-items-center shrink-0">
            <Layers className="w-5 h-5 text-brand-selected" />
          </div>
          <div className="min-w-0">
            <div className="text-lg font-black text-gray-900">Course content</div>
            <div className="text-sm text-gray-600 truncate">Sections and lessons</div>
          </div>
        </div>

        {onToggleTheater && (
          <button
            onClick={onToggleTheater}
            title={theaterMode ? "Exit expanded view" : "Expand panel"}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-extrabold text-gray-700 hover:bg-gray-50 transition"
          >
            {theaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {content}
    </div>
  );
}
