// src/components/Auth/SocialGoogleButton.tsx
"use client";

import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export default function SocialGoogleButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/auth/social/google" })}
      className={`w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition ${className}`}
      aria-label="Continue with Google"
    >
      <FaGoogle size={22} className="text-[#DB4437]" />
    </button>
  );
}
