"use client";

import { useAuth } from "@/providers/auth-context";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

function isFullUrl(value?: string | null): boolean {
  return !!value && (value.startsWith("http://") || value.startsWith("https://"));
}

function sanitizeKey(raw?: string | null): string {
  if (!raw) return "";
  return raw.trim().replace(/,+$/, "").replace(/^\/+/, "");
}

export default function UserInfo() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarSrc = useMemo(() => {
    const raw = (user?.image || user?.memberImage || "") as string;
    if (!raw) return null;

    // ✅ If it's already a full URL, don't sanitize it
    if (isFullUrl(raw)) return raw;

    // ✅ Otherwise treat it as a stored key
    const key = sanitizeKey(raw);
    if (!key) return null;

    return buildDownloadUrl(key);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const displayName = user.name || user.email || "User";

  const initials =
    displayName
      .trim()
      .split(" ")
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 1)
      .join("") || "U";

  const handleProfileClick = () => {
    setOpen(false);
    const role = (user.role || "").toUpperCase();
    router.push(role === "MENTOR" ? "/mentor" : "/user");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-9 h-9 p-0 border-0 rounded-full bg-[#8d6e63] text-white grid place-items-center font-semibold text-sm hover:opacity-90 transition overflow-hidden"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt={displayName}
            width={36}
            height={36}
            className="block h-full w-full object-cover rounded-full"
            unoptimized
          />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
          <p className="px-4 py-2 text-sm text-gray-700 font-medium border-b border-gray-100">
            {displayName}
          </p>

          <button
            onClick={handleProfileClick}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Profile
          </button>

          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
