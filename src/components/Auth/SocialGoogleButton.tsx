// src/components/Auth/SocialGoogleButton.tsx
"use client";

import { FaGoogle } from "react-icons/fa";
import { getGoogleAuthUrl } from "@/libs/auth/googleAuthUrl";

export default function SocialGoogleButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = getGoogleAuthUrl();
      }}
      className={`w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition ${className}`}
      aria-label="Continue with Google"
    >
      <FaGoogle size={22} className="text-[#DB4437]" />
    </button>
  );
}
