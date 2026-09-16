"use client";

export const COURSE_DETAIL_TABS = [
  "sections",
  "resources",
  "schedule",
  "attendance",
  "assignments",
] as const;

export type CourseDetailTab = (typeof COURSE_DETAIL_TABS)[number];

const TAB_LABEL: Record<CourseDetailTab, string> = {
  sections: "Sections",
  resources: "Resources",
  schedule: "Live Class Schedule",
  attendance: "Attendance",
  assignments: "Assignments",
};

type Props = {
  active: CourseDetailTab;
  onChange: (tab: CourseDetailTab) => void;
};

export default function CourseDetailTabs({ active, onChange }: Props) {
  return (
    <div className="mt-6 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-100">
      {COURSE_DETAIL_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition ${
            active === tab
              ? "bg-brand-selected text-white"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          {TAB_LABEL[tab]}
        </button>
      ))}
    </div>
  );
}
