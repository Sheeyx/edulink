"use client";

import * as React from "react";
import type { TabKey } from "./types";

export default function CourseTabs({
  active,
  onTab,
}: {
  active: TabKey;
  onTab: (k: TabKey) => void;
}) {
  return (
    <div className="border-b border-gray-200 flex gap-6 text-sm">
      <TabButton active={active === "learn"} onClick={() => onTab("learn")}>
        About
      </TabButton>
      <TabButton active={active === "content"} onClick={() => onTab("content")}>
        Curriculum
      </TabButton>
      <TabButton active={active === "reviews"} onClick={() => onTab("reviews")}>
        Reviews
      </TabButton>
      <TabButton active={active === "instructor"} onClick={() => onTab("instructor")}>
        Instructor
      </TabButton>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-4 border-b-2 -mb-px font-semibold transition ${
        active
          ? "border-violet-600 text-violet-700"
          : "border-transparent text-slate-500 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}
