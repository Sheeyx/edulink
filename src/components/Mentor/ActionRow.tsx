"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { ActionItem } from "@/libs/types/user/mentor/types";

export const ActionRow: React.FC<ActionItem> = ({ icon, title, desc, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full text-left bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md hover:border-gray-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
  >
    <span className="shrink-0">{icon}</span>
    <span className="flex-1">
      <span className="block font-bold text-lg mb-1">{title}</span>
      <span className="block text-sm text-gray-500">{desc}</span>
    </span>
    <span className="bg-purple-600 rounded-full p-2.5 shrink-0">
      <ChevronRight className="w-5 h-5 text-white" />
    </span>
  </button>
);
