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

  if (panel === "earnings") return <p className="text-gray-700">Earnings dashboard…</p>;
  if (panel === "assignments") return <p className="text-gray-700">Assignments UI…</p>;
  if (panel === "messages") return <p className="text-gray-700">Messages…</p>;
  if (panel === "explore") return <p className="text-gray-700">Explore resources…</p>;
  if (panel === "students") return <p className="text-gray-700">Student list…</p>;

  return null;
}
