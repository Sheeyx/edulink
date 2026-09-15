"use client";

import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { PanelType } from "../_components/_types/types";
import ProfilePanel from "../_components/ProfilePanel/ProfilePanel";

type Props = {
  panel: Exclude<PanelType, null>;
  onBack: () => void;
};

const TITLES: Record<Props["panel"], string> = {
  profile: "Profile",
  courses: "Courses",
  assignments: "Assignments",
  explore: "Explore",
};

export default function DetailPanel({ panel, onBack }: Props) {
  const title = TITLES[panel];

  return (
    <section className="bg-white rounded-[28px] border border-gray-200 shadow-sm px-8 py-8 md:px-10 md:py-10">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-purple-700 font-extrabold text-1xl hover:text-purple-800 transition"
      >
        <ChevronLeft className="w-7 h-7" />
        Back to Dashboard
      </button>

      {/* Title */}
      <h1 className="mt-6 text-[36px] md:text-[34px] leading-[1.05] font-extrabold text-gray-900">
        {title}
      </h1>

      {/* Content */}
      <div className="mt-2">
        {panel === "profile" ? (
          <ProfilePanel />
        ) : (
          <p className="text-[22px] md:text-[26px] leading-snug text-gray-900">
            Manage your <span className="font-extrabold">{panel}</span> here.
            More advanced features will appear as you continue learning.
          </p>
        )}
      </div>
    </section>
  );
}
