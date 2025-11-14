"use client";

import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

export type SectionUI = {
  id: string;
  title: string;
  order: number;
  lessonsCount: number;
  status?: "ACTIVE" | "INACTIVE" | "DELETED"; // 👈 optional status
};

type Props = {
  sections: SectionUI[];
  onAddLesson: (id: string) => void;
  onEditSection: (id: string) => void;
  onDeleteSection: (id: string) => void;
};

export default function SectionsBlock({
  sections,
  onAddLesson,
  onEditSection,
  onDeleteSection,
}: Props) {
  // only show ACTIVE sections
  const activeSections = sections.filter(
    (s) => !s.status || s.status === "ACTIVE"
  );

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
              onAddLesson={onAddLesson}
              onEdit={onEditSection}
              onDelete={onDeleteSection}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SectionRow({
  section,
  onAddLesson,
  onEdit,
  onDelete,
}: {
  section: SectionUI;
  onAddLesson: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-100 md:flex-row md:items-center md:justify-between">
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

      <div className="flex items-center gap-2 self-start md:self-auto">
        {/* ADD LESSON BUTTON */}
        <button
          title="Add lesson"
          onClick={() => onAddLesson(section.id)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100"
        >
          <FiPlus className="h-4 w-4" />
        </button>

        {/* EDIT SECTION */}
        <button
          title="Edit section"
          onClick={() => onEdit(section.id)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100"
        >
          <FiEdit2 className="h-4 w-4" />
        </button>

        {/* DELETE SECTION */}
        <button
          title="Delete section"
          onClick={() => onDelete(section.id)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
        >
          <FiTrash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

