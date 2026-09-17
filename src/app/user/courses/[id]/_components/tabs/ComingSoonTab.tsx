"use client";

import type { LucideIcon } from "lucide-react";

export default function ComingSoonTab({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 px-6 text-center text-gray-400">
      <Icon className="w-8 h-8" />
      <div className="text-sm font-bold text-gray-600">{title}</div>
      <div className="text-xs max-w-sm">{description}</div>
    </div>
  );
}
