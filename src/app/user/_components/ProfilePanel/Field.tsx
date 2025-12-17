"use client";

import * as React from "react";

export default function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-gray-950 font-extrabold text-lg">{label}</div>
      {children}
    </div>
  );
}
