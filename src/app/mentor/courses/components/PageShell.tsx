// app/mentor/courses/components/PageShell.tsx
//
// NOTE: this renders inside the mentor dashboard's own full-page shell
// (see app/mentor/layout.tsx), so it only owns an in-content header —
// it must not render its own min-h-screen page background/header bar.

"use client";

import { ArrowLeft } from "lucide-react";
import * as React from "react";

export default function PageShell({
  onBack,
  children,
}: {
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </button>

      {children}
    </div>
  );
}
