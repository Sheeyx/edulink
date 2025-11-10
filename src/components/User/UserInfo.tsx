"use client";

import { useAuth } from "@/providers/auth-context";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserInfo() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const initials =
    (user.name?.trim() || user.email)
      .split(" ")
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 1)
      .join("") || "U";

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setOpen(false);
    const role = (user.role || "").toUpperCase();
    if (role === "MENTOR") {
      router.push("/mentor");
    } else {
      router.push("/user");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-9 h-9 rounded-full bg-[#8d6e63] text-white grid place-items-center font-semibold text-sm hover:opacity-90 transition"
      >
        {initials}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
          <p className="px-4 py-2 text-sm text-gray-700 font-medium border-b border-gray-100">
            {user.name || "User"}
          </p>

          {/* My Profile */}
          <button
            onClick={handleProfileClick}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Profile
          </button>

          {/* Log out */}
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
