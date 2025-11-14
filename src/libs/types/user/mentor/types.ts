// ---------- Mentor Dashboard Types ----------

// src/libs/types/user/mentor/types.ts
export type PanelType =
  | null
  | "profile"
  | "courses"
  | "create-course"   // ✅ add this
  | "earnings"
  | "assignments"
  | "messages"
  | "explore"
  | "students";


// A reusable type for button or tile click actions
export type ClickHandler = () => void;

// Small dashboard tiles (e.g., Create Course, Earnings)
export interface TileItem {
  iconTint: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick?: ClickHandler;
}

// Action rows for main mentor dashboard sections
export interface ActionItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: ClickHandler;
}

// Props for the main Mentor Dashboard component
export interface MentorDashboardProps {
  name: string;
  memberId: string;
  avatarUrl?: string;
}
