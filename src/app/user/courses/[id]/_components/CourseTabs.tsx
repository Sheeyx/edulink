"use client";

import { Search } from "lucide-react";

export type TabKey =
  | "content"
  | "overview"
  | "schedule"
  | "qa"
  | "notes"
  | "announcements"
  | "reviews"
  | "tools";

const TAB_LABELS: Record<TabKey, string> = {
  content: "Course content",
  overview: "Overview",
  schedule: "Live Schedule",
  qa: "Q&A",
  notes: "Notes",
  announcements: "Announcements",
  reviews: "Reviews",
  tools: "Learning tools",
};

export default function CourseTabs({
  tabs,
  active,
  onChange,
  searchOpen,
  onSearchToggle,
}: {
  tabs: TabKey[];
  active: TabKey;
  onChange: (tab: TabKey) => void;
  searchOpen?: boolean;
  onSearchToggle?: () => void;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-gray-200 px-2 overflow-x-auto">
      {onSearchToggle && (
        <button
          onClick={onSearchToggle}
          title="Search course content"
          className={[
            "shrink-0 rounded-lg p-2.5 transition",
            searchOpen ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50",
          ].join(" ")}
        >
          <Search className="w-4 h-4" />
        </button>
      )}

      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={[
            "shrink-0 px-3 py-3.5 text-sm font-bold border-b-2 transition whitespace-nowrap",
            active === t
              ? "border-brand-selected text-brand-selected"
              : "border-transparent text-gray-500 hover:text-gray-800",
          ].join(" ")}
        >
          {TAB_LABELS[t]}
        </button>
      ))}
    </div>
  );
}
