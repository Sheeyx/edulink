// app/user/_components/LearningDashboard/types.ts

export type PanelType = "profile" | "courses" | "assignments" | "explore" | null;
export type MemberRole = "STUDENT" | "MENTOR" | "ADMIN";

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

export interface DetailPanelProps {
  panel: PanelType;
  onBack: () => void;
}

export interface SmallTileProps {
  iconTint: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}
