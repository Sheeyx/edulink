// app/user/_components/LearningDashboard/components/ActionRow.tsx
import React from "react";
import { ChevronRight } from "lucide-react";
import { ActionRowProps } from "../_types/types";

export default function ActionRow({ icon, title, desc, onClick }: ActionRowProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex items-center gap-5 hover:shadow-md transition cursor-pointer"
    >
      {icon}
      <div className="flex-1">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-800">{desc}</p>
      </div>
      <div className="bg-purple-600 rounded-full p-2.5">
        <ChevronRight className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}
