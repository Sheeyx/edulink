"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function UserInfo() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session) return null;

  const name = session.user?.name || session.user?.email || "U";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative inline-block text-left">
      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold focus:outline-none"
      >
        {initial}
        <span className="absolute top-0 right-0 w-3 h-3 bg-purple-500 border-2 border-white rounded-full"></span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">{name}</div>
          <button
            onClick={() => signOut()}
            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
