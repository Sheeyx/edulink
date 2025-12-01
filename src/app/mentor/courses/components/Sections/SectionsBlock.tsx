// app/mentor/courses/components/Sections/SectionsBlock.tsx
"use client";

import * as React from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiChevronDown,
  FiMove,
} from "react-icons/fi";

import type {
  SectionUI,
  LessonUI,
} from "@/libs/types/course/types";

type Props = {
  sections: SectionUI[];
  onAddLesson: (sectionId: string) => void;
  onEditSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;

  onEditLesson: (sectionId: string, lessonId: string) => void;
  onDeleteLesson: (sectionId: string, lessonId: string) => void;
  onReorderLessons: (sectionId: string, lessons: LessonUI[]) => void;
};

export default function SectionsBlock({
  sections,
  onAddLesson,
  onEditSection,
  onDeleteSection,
  onEditLesson,
  onDeleteLesson,
  onReorderLessons,
}: Props) {
  const activeSections = sections.filter(
    (s) => !s.status || s.status === "ACTIVE"
  );

  const [openSectionId, setOpenSectionId] = React.useState<string | null>(null);
  const toggleSection = (id: string) => {
    setOpenSectionId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight lg:text-lg">
          Sections
        </h3>
        <span className="text-xs text-slate-500">
          {activeSections.length} active sections
        </span>
      </div>

      {activeSections.length === 0 ? (
        <div className="rounded-xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
          No active sections yet. Use{" "}
          <span className="font-medium text-violet-600">Add Section</span> to
          create the first module.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activeSections.map((section) => (
            <SectionRow
              key={section.id}
              section={section}
              isOpen={openSectionId === section.id}
              onToggle={() => toggleSection(section.id)}
              onAddLesson={onAddLesson}
              onEditSection={onEditSection}
              onDeleteSection={onDeleteSection}
              onEditLesson={onEditLesson}
              onDeleteLesson={onDeleteLesson}
              onReorderLessons={onReorderLessons}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SectionRow({
  section,
  isOpen,
  onToggle,
  onAddLesson,
  onEditSection,
  onDeleteSection,
  onEditLesson,
  onDeleteLesson,
  onReorderLessons,
}: {
  section: SectionUI;
  isOpen: boolean;
  onToggle: () => void;
  onAddLesson: (sectionId: string) => void;
  onEditSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onEditLesson: (sectionId: string, lessonId: string) => void;
  onDeleteLesson: (sectionId: string, lessonId: string) => void;
  onReorderLessons: (sectionId: string, lessons: LessonUI[]) => void;
}) {
  const [localLessons, setLocalLessons] = React.useState<LessonUI[]>(
    section.lessons ?? []
  );
  const [draggedId, setDraggedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLocalLessons(section.lessons ?? []);
  }, [section.lessons]);

  const handleDragStart = (id: string) => (e: React.DragEvent) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (id: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (id: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedId || draggedId === id) return;

    setLocalLessons((prev) => {
      const currentIndex = prev.findIndex((l) => l.id === draggedId);
      const targetIndex = prev.findIndex((l) => l.id === id);
      if (currentIndex === -1 || targetIndex === -1) return prev;

      const updated = [...prev];
      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, moved);

      onReorderLessons(section.id, updated);
      return updated;
    });

    setDraggedId(null);
  };

  const lessons = localLessons;

  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-100">
      {/* Header row (accordion trigger) */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-start gap-2 text-left"
        >
          <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
            <FiChevronDown
              className={`h-3 w-3 text-slate-500 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </span>

          <div>
            <h4 className="font-medium">{section.title}</h4>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                Order: {section.order}
              </span>
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                {section.lessonsCount} Lessons
              </span>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            title="Add lesson"
            onClick={(e) => {
              e.stopPropagation();
              onAddLesson(section.id);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100"
          >
            <FiPlus className="h-4 w-4" />
          </button>

          <button
            title="Edit section"
            onClick={(e) => {
              e.stopPropagation();
              onEditSection(section.id);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>

          <button
            title="Delete section"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSection(section.id);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Accordion content: lessons */}
      {isOpen && (
        <div className="mt-3 border-t border-slate-200 pt-3">
          {lessons.length === 0 ? (
            <p className="text-xs italic text-slate-500">
              No lessons yet. Use the “+” button to add one.
            </p>
          ) : (
            <ul className="space-y-2">
              {lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  draggable
                  onDragStart={handleDragStart(lesson.id)}
                  onDragOver={handleDragOver(lesson.id)}
                  onDrop={handleDrop(lesson.id)}
                  className={`flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs ring-1 ring-slate-100 ${
                    draggedId === lesson.id ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <FiMove className="h-3 w-3" />
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">
                        {lesson.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {lesson.contentType ?? "CONTENT"} •{" "}
                        {lesson.duration ?? "-"} min
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      title="Edit lesson"
                      onClick={() => onEditLesson(section.id, lesson.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100"
                    >
                      <FiEdit2 className="h-3 w-3" />
                    </button>
                    <button
                      title="Delete lesson"
                      onClick={() => onDeleteLesson(section.id, lesson.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                    >
                      <FiTrash2 className="h-3 w-3" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
