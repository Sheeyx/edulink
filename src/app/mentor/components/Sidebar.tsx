// src/app/mentor/components/Sidebar.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { GraduationCap, PencilLine, BookOpen } from "lucide-react";
import React from "react";
import { buildDownloadUrl } from "@/utils/buildDownloadUrl";

type SidebarProps = {
  name: string;
  avatarUrl?: string; // DB: "members/xxx.png" or full URL
  roleLabel?: string;
  onOpenCourses: () => void;
};

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
}: SidebarProps) {
  const router = useRouter();
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
  console.log("AVATAR URL =>", avatarSrc);

  return (
    <aside className="md:col-span-2">
      <div className="rounded-[28px] bg-white shadow-[0_10px_35px_rgba(99,99,160,0.08)] border border-gray-100 p-8 text-center">
        {/* Avatar */}
        <div className="mx-auto relative w-28 h-28">
          <div className="absolute inset-0 rounded-full ring-8 ring-white shadow-[0_6px_20px_rgba(0,0,0,0.06)] overflow-hidden">
            <Image
              src={avatarSrc}
              alt={name}
              fill
              className="object-cover"
              sizes="112px"
              priority
            />
          </div>
        </div>

        {/* Name */}
        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
          Welcome, {name}!
        </h2>

        {/* Role pill */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-5 py-2">
          <GraduationCap className="h-5 w-5 text-indigo-600" />
          <span className="text-indigo-700 font-medium">{roleLabel}</span>
        </div>

        {/* Buttons */}
        <div className="mt-8 space-y-4">
          <button
            type="button"
            onClick={() => router.push("/mentor/edit-profile")}
            className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-violet-500 px-6 py-3.5 text-violet-700 font-semibold hover:bg-violet-50 transition"
          >
            <PencilLine className="h-5 w-5" />
            Edit Profile
          </button>

          <button
            type="button"
            onClick={() => router.push("/mentor/courses")}
            className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-violet-500 px-6 py-3.5 text-violet-700 font-semibold hover:bg-violet-50 transition"
          >
            <BookOpen className="h-5 w-5" />
            View My Courses
          </button>
        </div>
      </div>
    </aside>
  );
}
