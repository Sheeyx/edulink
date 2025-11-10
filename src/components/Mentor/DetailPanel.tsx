"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { ClickHandler, PanelType } from "@/libs/types/user/mentor/types";

type DetailPanelProps = {
  panel: PanelType;
  onBack: ClickHandler;
  children?: React.ReactNode;
};

export const DetailPanel: React.FC<DetailPanelProps> = ({ panel, onBack, children }) => (
  <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
    <button
      type="button"
      onClick={onBack}
      className="mb-6 text-purple-600 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      aria-label="Go back"
    >
      <ChevronRight className="w-5 h-5 rotate-180" />
      Back
    </button>

    <h2 className="text-3xl font-bold mb-4 capitalize">{panel}</h2>
    {children ?? (
      <p className="text-gray-500">
        This is where the <span className="font-medium">{panel}</span> content would be displayed.
      </p>
    )}
  </section>
);
