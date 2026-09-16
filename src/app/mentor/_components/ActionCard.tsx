// src/app/mentor/components/ActionCard.tsx
"use client";

import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
};

export default function ActionCard({ icon, title, subtitle, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group w-full text-left
        rounded-[28px] bg-white
        border border-gray-800/40
        px-7 py-6
        shadow-[0_8px_20px_rgba(0,0,0,0.03)]
        transition
        hover:border-gray-900
        focus:outline-none focus:ring-4 focus:ring-brand-primary/25
      "
    >
      <div className="flex gap-5">
        <div className="mt-1 shrink-0">{icon}</div>
        <div>
          <div className="text-[22px] leading-7 font-bold text-gray-900">
            {title}
          </div>
          <div className="mt-1 text-[18px] leading-7 text-gray-600">
            {subtitle}
          </div>
        </div>
      </div>
    </button>
  );
}
