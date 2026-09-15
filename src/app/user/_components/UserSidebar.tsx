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
} from "lucide-react";

import { buildDownloadUrl } from "@/libs/streamableUrl";
import { DEFAULT_AVATAR } from "./constants";

type Props = {
  name: string;
  avatarUrl?: string | null;
  roleLabel: string;
  activePath: string;

  onGoHome: () => void;
  onOpenProfile: () => void;
  onOpenCourses: () => void;
  onOpenAssignments: () => void;
  onOpenExplore: () => void;
};

function isActive(path: string, target: string) {
  return path === target || path.startsWith(target + "/");
}

function NavItem({
  active,
  icon,
  title,
  desc,
  onClick,
}: {
  active?: boolean;
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left rounded-2xl border p-4 transition",
        active
          ? "border-purple-200 bg-purple-50 shadow-sm"
          : "border-gray-200 bg-white hover:bg-gray-50",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "grid place-items-center rounded-xl w-10 h-10 border",
            active
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-gray-50 text-gray-700 border-gray-200",
          ].join(" ")}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="font-extrabold text-gray-900">{title}</div>
          <div className="text-sm text-gray-600">{desc}</div>
        </div>
      </div>
    </button>
  );
}

export default function UserSidebar({
  name,
  avatarUrl,
  roleLabel,
  activePath,
  onGoHome,
  onOpenProfile,
  onOpenCourses,
  onOpenAssignments,
  onOpenExplore,
}: Props) {
  const resolvedAvatar = React.useMemo(() => {
    const url = buildDownloadUrl(avatarUrl || undefined);
    return url || DEFAULT_AVATAR;
  }, [avatarUrl]);

  return (
    <div className="rounded-[28px] border border-gray-100 bg-white shadow-[0_10px_35px_rgba(99,99,160,0.08)] p-6">
      {/* Top profile */}
      <div className="flex flex-col items-center text-center">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border border-gray-200 shadow-sm">
          <Image
            src={resolvedAvatar}
            alt={`${name} avatar`}
            fill
            sizes="112px"
            className="object-cover"
            priority
          />
        </div>

        <h2 className="mt-4 text-2xl font-black text-gray-900">{name}</h2>
        <p className="mt-1 text-sm text-gray-600">
          Keep learning. One lesson at a time.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-50 border border-purple-100 px-3 py-2">
          <GraduationCap className="w-4 h-4 text-purple-700" />
          <span className="text-sm font-bold text-purple-800">{roleLabel}</span>
        </div>

        <div className="mt-5 grid w-full gap-3">
          <button
            onClick={onOpenProfile}
            className="w-full rounded-2xl border-2 border-purple-600 text-purple-700 py-3 font-extrabold hover:bg-purple-50 transition"
          >
            Edit Your Profile
          </button>

          <button
            onClick={onOpenCourses}
            className="w-full rounded-2xl bg-purple-700 text-white py-3 font-extrabold hover:bg-purple-800 transition"
          >
            Go to My Courses
          </button>
        </div>
      </div>

      {/* Nav */}
      <div className="mt-6 space-y-3">
        <NavItem
          active={isActive(activePath, "/user")}
          icon={<Home className="w-5 h-5" />}
          title="Dashboard"
          desc="Quick actions & progress"
          onClick={onGoHome}
        />

        <NavItem
          active={isActive(activePath, "/user/profile")}
          icon={<UserRound className="w-5 h-5" />}
          title="Profile"
          desc="Update your info"
          onClick={onOpenProfile}
        />

        <NavItem
          active={isActive(activePath, "/user/courses")}
          icon={<BookOpen className="w-5 h-5" />}
          title="My Courses"
          desc="Continue where you left off"
          onClick={onOpenCourses}
        />

        <NavItem
          active={isActive(activePath, "/user/assignments")}
          icon={<ClipboardList className="w-5 h-5" />}
          title="Assignments"
          desc="Track and submit tasks"
          onClick={onOpenAssignments}
        />

        <NavItem
          active={isActive(activePath, "/user/explore")}
          icon={<Compass className="w-5 h-5" />}
          title="Explore"
          desc="Discover new courses"
          onClick={onOpenExplore}
        />
      </div>
    </div>
  );
}
