// src/app/mentor/components/PanelContent.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import type { PanelType } from "@/app/mentor/MentorDashboardClient";
import UpdateMemberForm from "@/app/mentor/edit-profile/components/UpdateMemberForm"; // your real form

type PanelContentProps = {
  panel: Exclude<PanelType, null>;
  memberId: string;
  onClose: () => void;
};

export default function PanelContent({ panel, memberId, onClose }: PanelContentProps) {
  const sp = useSearchParams();

  if (panel === "profile") {
    return <UpdateMemberForm memberId={memberId} onDone={onClose} />;
  }

//   if (panel === "courses") {
//     const initialMode = (sp.get("mode") === "create" ? "create" : "view") as "view" | "create";
//     return <CoursesPanel onClose={onClose} initialMode={initialMode} />;
//   }

//   if (panel === "create-course") {
//     return <CoursesPanel onClose={onClose} initialMode="create" />;
//   }

  const comingSoon: Record<string, string> = {
    earnings: "Earnings dashboard",
    assignments: "Assignments overview",
    messages: "Messages",
    explore: "Explore resources",
    students: "Student list",
  };

  if (comingSoon[panel]) {
    return (
      <div className="rounded-2xl bg-purple-50 border border-purple-100 px-4 py-6 text-center">
        <p className="font-extrabold text-gray-900">{comingSoon[panel]}</p>
        <p className="mt-1 text-sm text-gray-600">Coming soon.</p>
      </div>
    );
  }

  return null;
}
