"use client";

import * as React from "react";

type BadgeProps = {
  bg?: string;
  fg?: string;
  className?: string;
  children: React.ReactNode;
};

export const Badge: React.FC<BadgeProps> = ({
  bg = "bg-gray-50",
  fg = "text-gray-700",
  className = "",
  children,
}) => (
  <div
    className={`${bg} ${fg} rounded-2xl p-3 flex items-center justify-center w-14 h-14 ${className}`}
    aria-hidden
  >
    {children}
  </div>
);
