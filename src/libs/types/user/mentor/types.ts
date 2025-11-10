export type PanelType =
  | "profile"
  | "courses"
  | "assignments"
  | "explore"
  | "students"
  | "earnings"
  | "messages"
  | null;

export type ClickHandler = () => void;

export interface TileItem {
  iconTint: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick?: ClickHandler;
}

export interface ActionItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: ClickHandler;
}
