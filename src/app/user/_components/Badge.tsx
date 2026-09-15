// app/user/_components/LearningDashboard/components/Badge.tsx
import React from "react";
import { BadgeProps } from "./_types/types";

export default function Badge({ bg, fg, children }: BadgeProps) {
  return (
    <div className={`${bg} ${fg} rounded-2xl p-3 flex items-center justify-center w-14 h-14`}>
      {children}
    </div>
  );
}
