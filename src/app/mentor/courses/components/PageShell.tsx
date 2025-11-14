// app/mentor/courses/components/PageShell.tsx

"use client";

import { FiArrowLeft, FiClipboard, FiFileText } from "react-icons/fi";
import * as React from "react";

function IconCircleButton({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      className="flex h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

export default function PageShell({
  onBack,
  children,
}: {
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-0">
          <div className="flex items-center gap-3">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-slate-50"
              onClick={onBack}
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-lg font-semibold tracking-tight lg:text-xl">
              Course Details
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <IconCircleButton title="Resources">
              <FiClipboard className="h-4 w-4" />
            </IconCircleButton>
            <IconCircleButton title="Notes">
              <FiFileText className="h-4 w-4" />
            </IconCircleButton>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
