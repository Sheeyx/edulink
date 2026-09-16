"use client";

import Image from "next/image";
import * as React from "react";
import {
  GraduationCap,
  UserRound,
  BookOpen,
  ClipboardList,
  Compass,
  Home,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { DEFAULT_AVATAR } from "./constants";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

type Props = {
  name: string;
  avatarUrl?: string | null;
  roleLabel: string;
  activePath: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;

  onGoHome: () => void;
  onOpenProfile: () => void;
  onOpenCourses: () => void;
  onOpenAssignments: () => void;
  onOpenExplore: () => void;
  onOpenFavorites: () => void;
};

function isActive(path: string, target: string) {
  return path === target || path.startsWith(target + "/");
}

function NavItem({
  active,
  icon,
  title,
  desc,
  collapsed,
  onClick,
}: {
  active?: boolean;
  icon: React.ReactNode;
  title: string;
  desc: string;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? title : undefined}
      className={[
        "w-full rounded-2xl border transition",
        collapsed ? "flex justify-center p-3" : "text-left p-4",
        active
          ? "border-brand-primary/25 bg-brand-primary/10 shadow-sm"
          : "border-gray-200 bg-white hover:bg-gray-50",
      ].join(" ")}
    >
      <div className={collapsed ? "" : "flex items-start gap-3"}>
        <div
          className={[
            "grid place-items-center rounded-xl w-10 h-10 border shrink-0",
            active
              ? "bg-brand-primary text-white border-brand-primary"
              : "bg-gray-50 text-gray-700 border-gray-200",
          ].join(" ")}
        >
          {icon}
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <div className="font-extrabold text-gray-900">{title}</div>
            <div className="text-sm text-gray-600">{desc}</div>
          </div>
        )}
      </div>
    </button>
  );
}

export default function UserSidebar({
  name,
  avatarUrl,
  roleLabel,
  activePath,
  collapsed,
  onToggleCollapsed,
  onGoHome,
  onOpenProfile,
  onOpenCourses,
  onOpenAssignments,
  onOpenExplore,
  onOpenFavorites,
}: Props) {
  const initialAvatar = React.useMemo(() => {
    const url = buildDownloadUrl(avatarUrl);
    return url || DEFAULT_AVATAR;
  }, [avatarUrl]);

  const [imgSrc, setImgSrc] = React.useState(initialAvatar);

  React.useEffect(() => {
    setImgSrc(initialAvatar);
  }, [initialAvatar]);

  return (
    <div className="relative rounded-[28px] border border-gray-100 bg-white shadow-[0_10px_35px_rgba(251,133,0,0.08)] p-6">
      {/* Collapse toggle */}
      <button
        type="button"
        onClick={onToggleCollapsed}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-6 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <div className="flex flex-col items-center text-center">
        <div
          className={[
            "relative overflow-hidden rounded-full border border-gray-200 shadow-sm bg-gray-50 transition-all",
            collapsed ? "h-10 w-10" : "h-28 w-28",
          ].join(" ")}
        >
          <Image
            src={imgSrc}
            alt={`${name} avatar`}
            fill
            sizes={collapsed ? "40px" : "112px"}
            className="object-cover"
            priority
            unoptimized
            onError={() => {
              // fallback to local static avatar
              if (imgSrc !== DEFAULT_AVATAR) setImgSrc(DEFAULT_AVATAR);
            }}
          />
        </div>

        {!collapsed && (
          <>
            <h2 className="mt-4 text-2xl font-black text-gray-900">{name}</h2>
            <p className="mt-1 text-sm text-gray-600">
              Keep learning. One lesson at a time.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-primary/10 border border-brand-primary/15 px-3 py-2">
              <GraduationCap className="w-4 h-4 text-brand-selected" />
              <span className="text-sm font-bold text-brand-selected">{roleLabel}</span>
            </div>
          </>
        )}

        <div className={collapsed ? "mt-5 grid w-full gap-2" : "mt-5 grid w-full gap-3"}>
          <button
            onClick={onOpenProfile}
            title={collapsed ? "Edit Your Profile" : undefined}
            className={[
              "rounded-2xl border-2 border-brand-primary text-brand-selected font-extrabold hover:bg-brand-primary/10 transition",
              collapsed ? "grid place-items-center p-2.5" : "w-full py-3",
            ].join(" ")}
          >
            {collapsed ? <UserRound className="h-4 w-4" /> : "Edit Your Profile"}
          </button>

          <button
            onClick={onOpenCourses}
            title={collapsed ? "Go to My Courses" : undefined}
            className={[
              "rounded-2xl bg-brand-selected text-white font-extrabold hover:brightness-90 transition",
              collapsed ? "grid place-items-center p-2.5" : "w-full py-3",
            ].join(" ")}
          >
            {collapsed ? <BookOpen className="h-4 w-4" /> : "Go to My Courses"}
          </button>
        </div>
      </div>

      <div className={collapsed ? "mt-6 space-y-2" : "mt-6 space-y-3"}>
        <NavItem
          active={isActive(activePath, "/user")}
          icon={<Home className="w-5 h-5" />}
          title="Dashboard"
          desc="Quick actions & progress"
          collapsed={collapsed}
          onClick={onGoHome}
        />

        <NavItem
          active={isActive(activePath, "/user/profile")}
          icon={<UserRound className="w-5 h-5" />}
          title="Profile"
          desc="Update your info"
          collapsed={collapsed}
          onClick={onOpenProfile}
        />

        <NavItem
          active={isActive(activePath, "/user/courses")}
          icon={<BookOpen className="w-5 h-5" />}
          title="My Courses"
          desc="Continue where you left off"
          collapsed={collapsed}
          onClick={onOpenCourses}
        />

        <NavItem
          active={isActive(activePath, "/user/assignments")}
          icon={<ClipboardList className="w-5 h-5" />}
          title="Assignments"
          desc="Track and submit tasks"
          collapsed={collapsed}
          onClick={onOpenAssignments}
        />

        <NavItem
          active={isActive(activePath, "/user/explore")}
          icon={<Compass className="w-5 h-5" />}
          title="Explore"
          desc="Discover new courses"
          collapsed={collapsed}
          onClick={onOpenExplore}
        />

        <NavItem
          active={isActive(activePath, "/user/favorites")}
          icon={<Heart className="w-5 h-5" />}
          title="Favorites"
          desc="Courses you've saved"
          collapsed={collapsed}
          onClick={onOpenFavorites}
        />
      </div>
    </div>
  );
}
