// app/user/_types/types.ts
import type { MemberRole } from "@/providers/auth-context";

export type PanelType = "profile" | "courses" | "assignments" | "explore" | null;

export interface LearningDashboardProps {
  role: MemberRole;
  name: string;
  avatarUrl?: string;
}

export interface BadgeProps {
  bg: string;
  fg: string;
  children: React.ReactNode;
}

export interface ActionRowProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}

export interface SmallTileProps {
  iconTint: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}
