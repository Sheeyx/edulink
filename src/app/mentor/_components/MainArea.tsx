// src/app/mentor/components/MainArea.tsx
"use client";

import React from "react";
import PanelContent from "./PanelContent";
import { PanelType } from "../MentorDashboardClient";

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
    <section className="space-y-6">
      {/* Hero header */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white p-6 shadow-[0_8px_24px_rgba(251,133,0,0.16)]">
        <h1 className="text-2xl font-black">Let&apos;s teach something great</h1>
        <p className="text-white/80 mt-1">
          Manage your courses, assignments, and students in one place.
        </p>
      </div>

      {/* Actions grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={a.onClick}
            className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-[0_8px_24px_rgba(251,133,0,0.08)] hover:shadow-[0_12px_36px_rgba(251,133,0,0.14)] transition"
          >
            <div className="flex items-center gap-4">
              {a.icon}
              <div className="min-w-0">
                <div className="font-extrabold text-gray-900">{a.title}</div>
                <div className="text-sm text-gray-600">{a.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Right panel content */}
      {panel && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_24px_rgba(251,133,0,0.08)]">
          <PanelContent panel={panel} memberId={memberId} onClose={onClosePanel} />
        </div>
      )}
    </section>
  );
}
