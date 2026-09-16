// src/app/mentor/components/Sidebar.tsx
"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  GraduationCap,
  PencilLine,
  BookOpen,
  Home,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React from "react";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

type SidebarProps = {
  name: string;
  avatarUrl?: string; // DB: "members/xxx.png" or full URL
  roleLabel?: string;
  onOpenCourses: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
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
          ? "border-purple-200 bg-purple-50 shadow-sm"
          : "border-gray-200 bg-white hover:bg-gray-50",
      ].join(" ")}
    >
      <div className={collapsed ? "" : "flex items-start gap-3"}>
        <div
          className={[
            "grid place-items-center rounded-xl w-10 h-10 border shrink-0",
            active
              ? "bg-purple-600 text-white border-purple-600"
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

function isFullUrl(value?: string): boolean {
  return !!value && (value.startsWith("http://") || value.startsWith("https://"));
}

function sanitizeKey(raw?: string | null): string {
  if (!raw) return "";
  return raw.trim().replace(/,+$/, "").replace(/^\/+/, "");
}

/**
 * Always returns a string → safe for <Image src=... />
 */
function getFullAvatarUrl(name: string, avatarUrl?: string): string {
  const fileKey = sanitizeKey(avatarUrl);

  // 1) No avatar at all → UI Avatars
  if (!fileKey) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&size=128&background=6366f1&color=fff`;
  }

  // 2) Already a full URL (Google, Kakao, etc.)
  if (isFullUrl(fileKey)) {
    return fileKey;
  }

  // 3) Relative path → wrap with backend download route
  return buildDownloadUrl(fileKey); // 👈 IMPORTANT: RETURN here
}

export default function Sidebar({
  name,
  avatarUrl,
  roleLabel = "Mentor",
  onOpenCourses,
  collapsed,
  onToggleCollapsed,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // optional, if you need token somewhere
  const accessToken = React.useMemo(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("accessToken");
      if (t) return t;
    }
    const s = session as any;
    return s?.accessToken ?? s?.user?.accessToken ?? undefined;
  }, [session]);

  const avatarSrc: string = getFullAvatarUrl(name, avatarUrl);

  return (
    <div className="relative rounded-[28px] border border-gray-100 bg-white shadow-[0_10px_35px_rgba(99,99,160,0.08)] p-6">
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

      {/* Top profile */}
      <div className="flex flex-col items-center text-center">
        <div
          className={[
            "relative overflow-hidden rounded-full border border-gray-200 shadow-sm transition-all",
            collapsed ? "h-10 w-10" : "h-28 w-28",
          ].join(" ")}
        >
          <Image
            src={avatarSrc}
            alt={name}
            fill
            className="object-cover"
            sizes={collapsed ? "40px" : "112px"}
            priority
          />
        </div>

        {!collapsed && (
          <>
            <h2 className="mt-4 text-2xl font-black text-gray-900">{name}</h2>
            <p className="mt-1 text-sm text-gray-600">
              Grow your classroom. One course at a time.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-50 border border-purple-100 px-3 py-2">
              <GraduationCap className="w-4 h-4 text-purple-700" />
              <span className="text-sm font-bold text-purple-800">{roleLabel}</span>
            </div>
          </>
        )}

        <div className={collapsed ? "mt-5 grid w-full gap-2" : "mt-5 grid w-full gap-3"}>
          <button
            type="button"
            onClick={() => router.push("/mentor/edit-profile")}
            title={collapsed ? "Edit Your Profile" : undefined}
            className={[
              "rounded-2xl border-2 border-purple-600 text-purple-700 font-extrabold hover:bg-purple-50 transition",
              collapsed ? "grid place-items-center p-2.5" : "w-full py-3",
            ].join(" ")}
          >
            {collapsed ? <PencilLine className="h-4 w-4" /> : "Edit Your Profile"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/mentor/create-courses")}
            title={collapsed ? "Create a Course" : undefined}
            className={[
              "rounded-2xl bg-purple-700 text-white font-extrabold hover:bg-purple-800 transition",
              collapsed ? "grid place-items-center p-2.5" : "w-full py-3",
            ].join(" ")}
          >
            {collapsed ? <PlusCircle className="h-4 w-4" /> : "Create a Course"}
          </button>
        </div>
      </div>

      {/* Nav */}
      <div className={collapsed ? "mt-6 space-y-2" : "mt-6 space-y-3"}>
        <NavItem
          active={isActive(pathname, "/mentor") && pathname === "/mentor"}
          icon={<Home className="w-5 h-5" />}
          title="Dashboard"
          desc="Quick actions & overview"
          collapsed={collapsed}
          onClick={() => router.push("/mentor")}
        />

        <NavItem
          active={isActive(pathname, "/mentor/edit-profile")}
          icon={<PencilLine className="w-5 h-5" />}
          title="Profile"
          desc="Update your info"
          collapsed={collapsed}
          onClick={() => router.push("/mentor/edit-profile")}
        />

        <NavItem
          active={isActive(pathname, "/mentor/courses")}
          icon={<BookOpen className="w-5 h-5" />}
          title="My Courses"
          desc="Create, edit, and manage"
          collapsed={collapsed}
          onClick={onOpenCourses}
        />

        <NavItem
          active={isActive(pathname, "/mentor/create-courses")}
          icon={<PlusCircle className="w-5 h-5" />}
          title="New Course"
          desc="Start a new module"
          collapsed={collapsed}
          onClick={() => router.push("/mentor/create-courses")}
        />
      </div>
    </div>
  );
}
