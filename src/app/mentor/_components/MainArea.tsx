// src/app/mentor/components/MainArea.tsx
"use client";

import React from "react";
import type { PanelType } from "@/app/mentor/MentorDashboardClient";
import PanelContent from "./PanelContent";

export type ActionItem = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
};

type Props = {
  actions: ActionItem[];
  panel: PanelType;
  memberId: string;
  onClosePanel: () => void;
};

export default function MainArea({ actions, panel, memberId, onClosePanel }: Props) {
  return (
    <section className="md:col-span-4 space-y-6">
      {/* Hero header */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-6">
        <h1 className="text-2xl font-bold">Let’s teach something great</h1>
        <p className="text-violet-100 mt-1">
          Manage your courses, assignments, and students in one place.
        </p>
      </div>

      {/* Actions grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={a.onClick}
            className="rounded-2xl border bg-white p-4 text-left hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              {a.icon}
              <div>
                <div className="font-semibold text-gray-900">{a.title}</div>
                <div className="text-sm text-gray-600">{a.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Right panel content */}
      {panel && (
        <div className="rounded-2xl border bg-white p-5">
          <PanelContent panel={panel} memberId={memberId} onClose={onClosePanel} />
        </div>
      )}
    </section>
  );
}
