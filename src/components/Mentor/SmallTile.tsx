"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { TileItem } from "@/libs/types/user/mentor/types";

export const SmallTile: React.FC<TileItem> = ({
  iconTint,
  icon,
  title,
  desc,
  onClick,
}) => {
  const Wrapper: React.ElementType = onClick ? "button" : "div";

  return (
    <Wrapper
      {...(onClick ? { type: "button", onClick } : {})}
      className="w-full bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-gray-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 text-left"
    >
      <span
        className={`${iconTint} rounded-2xl p-3 flex items-center justify-center w-12 h-12 shrink-0`}
        aria-hidden
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-bold text-base mb-0.5">{title}</span>
        <span className="block text-sm text-gray-500">{desc}</span>
      </span>
      <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
    </Wrapper>
  );
};
