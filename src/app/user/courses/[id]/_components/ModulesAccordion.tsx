"use client";

import * as React from "react";
import { ChevronDown, Layers } from "lucide-react";
import type { EnrolledCourseDetails, Section } from "../_types/courseDetails.types";
import LessonRow from "./LessonRow";

function sortSections(sections: Section[]) {
  return [...sections].sort((a, b) => (a.moduleOrder ?? 0) - (b.moduleOrder ?? 0));
}

export default function ModulesAccordion({ course }: { course: EnrolledCourseDetails }) {
  const sections = sortSections(course.sectionsWithLessons || []);
  const [openId, setOpenId] = React.useState<string | null>(sections[0]?._id || null);
console.log(course, "course");

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-[0_10px_35px_rgba(99,99,160,0.08)] p-6">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-2xl border border-brand-primary/15 bg-brand-primary/10 grid place-items-center">
          <Layers className="w-5 h-5 text-brand-selected" />
        </div>
        <div>
          <div className="text-lg font-black text-gray-900">Modules</div>
          <div className="text-sm text-gray-600">Lessons inside each module</div>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-sm text-gray-600">
          No modules yet.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {sections.map((s, idx) => {
            const opened = openId === s._id;
            const lessons = s.lessons || [];

            return (
              <div key={s._id} className="rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenId(opened ? null : s._id)}
                  className="w-full flex items-center justify-between gap-3 p-4 bg-white hover:bg-gray-50 transition"
                >
                  <div className="min-w-0 text-left">
                    <div className="font-extrabold text-gray-900 truncate">
                      {typeof s.moduleOrder === "number"
                        ? `Module ${s.moduleOrder}: ${s.moduleTitle}`
                        : `Module ${idx + 1}: ${s.moduleTitle}`}
                    </div>
                    <div className="text-sm text-gray-600">{lessons.length} lessons</div>
                  </div>

                  <ChevronDown
                    className={[
                      "w-5 h-5 text-gray-500 transition-transform",
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
                        {lessons.map((l, i) => (
                          <LessonRow
                            key={l._id}
                            index={i + 1}
                            lesson={l}
                            courseId={course._id}   // ✅ PASS COURSE ID
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
