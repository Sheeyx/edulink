// app/user/_components/LearningDashboard/components/SmallTile.tsx
import React from "react";
import { ChevronRight } from "lucide-react";
import { SmallTileProps } from "../_types/types";

export default function SmallTile({ iconTint, icon, title, desc }: SmallTileProps) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition cursor-pointer">
      <div className={`${iconTint} rounded-2xl p-3 flex items-center justify-center w-12 h-12`}>
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-base text-gray-900 mb-0.5">{title}</h3>
        <p className="text-sm text-gray-800">{desc}</p>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-700" />
    </div>
  );
}
