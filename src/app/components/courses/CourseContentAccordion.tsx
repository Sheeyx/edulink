// components/course/CourseContentAccordion.tsx
"use client";

import { useState } from "react";
import { FiVideo, FiHelpCircle, FiCode } from "react-icons/fi";

type Lesson = {
  _id: string;
  title: string;
  duration?: string; // "08:21"
  kind?: "video" | "quiz" | "code" | string;
  itemsCount?: number; // for quizzes if you have it
};

type Section = {
  _id: string;
  title: string;
  order?: number;
  lessons?: Lesson[];
};

export default function CourseContentAccordion({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState<number | null>(0);

  const iconFor = (kind?: string) => {
    if (kind === "quiz") return <FiHelpCircle className="text-gray-500" />;
    if (kind === "code") return <FiCode className="text-gray-500" />;
    return <FiVideo className="text-gray-500" />;
  };

  return (
    <div className="rounded-xl border overflow-hidden">
      {sections.map((s, idx) => {
        const isOpen = open === idx;
        const lectures = s.lessons?.length ?? 0;
        const lengthText = s.lessons?.reduce((acc, l) => acc + (l.duration ? ` ${l.duration}` : ""), "");

        return (
          <div key={s._id ?? idx} className="border-b last:border-b-0">
            <button
              onClick={() => setOpen(isOpen ? null : idx)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100"
            >
              <div className="text-left">
                <div className="font-semibold text-gray-800">
                  {s.title ?? `Section ${idx + 1}`}
                </div>
                <div className="text-xs text-gray-500">
                  {lectures} lectures {/* • {lengthText || "length"} */}
                </div>
              </div>
              <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            {isOpen && (
              <div className="bg-white">
                {s.lessons?.map((l) => (
                  <div key={l._id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      {iconFor(l.kind)}
                      <span className="text-sm text-gray-800">{l.title}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {l.kind === "quiz" && typeof l.itemsCount === "number" ? `${l.itemsCount} questions` : l.duration}
                    </div>
                  </div>
                ))}

                {!s.lessons?.length && (
                  <div className="px-4 py-3 text-sm text-gray-500">No lessons yet.</div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {!sections.length && (
        <div className="px-4 py-6 text-sm text-gray-500">No curriculum published yet.</div>
      )}
    </div>
  );
}
