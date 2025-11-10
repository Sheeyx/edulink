// src/app/auth/onboarding/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { gqlFetch } from "@/libs/graphql";
import { useAuth } from "@/providers/auth-context";

const SIGNUP = `
mutation Signup($input: MemberInput!) {
  signup(input: $input) {
    _id
    memberRole
    memberEmail
    memberFullName
    memberImage
    accessToken
    refreshToken
    accessTokenExpiresIn
    refreshTokenExpiresIn
  }
}
`;

const PHONE_REGEX = /^[+0-9()\-\s]{7,20}$/;

function redirectByRole(role?: string | null) {
  const r = (role || "").toUpperCase();
  if (r === "MENTOR") return "/mentor";
  if (r === "ADMIN") return "/admin";
  return "/user";
}

export default function OnboardingPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();

  const email = sp.get("email") || "";
  const sid = sp.get("sid") || "";
  const provider = sp.get("provider") || "GOOGLE";
  const initialName = sp.get("name") || "";
  const image = sp.get("image") || "";

  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!fullName.trim()) return setErr("Please enter your full name.");
    if (!PHONE_REGEX.test(phone.trim()))
      return setErr("Please enter a valid phone number (e.g. +82 10-1234-5678).");
    if (!email || !sid) return setErr("Missing Google identity. Please try again.");

    try {
      setSaving(true);
      const res = await gqlFetch<{ signup: any }>(SIGNUP, {
        input: {
          memberEmail: email,
          memberPassword: "G" + Math.random().toString(36).slice(2, 7) + "9XyZ",
          memberFullName: fullName.trim(),
          memberPhone: phone.trim(),
          memberRole: "STUDENT",
          memberAuth: provider as any, // "GOOGLE"
          memberGoogleId: sid,
          ...(image ? { memberImage: image } : {}),
        },
      });

      const s = res.signup;
      localStorage.setItem("accessToken", s.accessToken);
      localStorage.setItem("refreshToken", s.refreshToken);
      localStorage.setItem(
        "accessTokenExpiresAt",
        String(Date.now() + (s.accessTokenExpiresIn ?? 0) * 1000)
      );
      localStorage.setItem(
        "refreshTokenExpiresAt",
        String(Date.now() + (s.refreshTokenExpiresIn ?? 0) * 1000)
      );
      const u = {
        id: s._id,
        email: s.memberEmail,
        name: s.memberFullName,
        role: (s.memberRole ?? "STUDENT") as "STUDENT" | "MENTOR" | "ADMIN",
        image: s.memberImage ?? null,
      };
      localStorage.setItem("currentUser", JSON.stringify(u));
      setUser(u);
      router.replace(redirectByRole(u.role));
    } catch (e: any) {
      setErr(e.message || "Could not complete onboarding.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-200 p-6 shadow-sm bg-white"
      >
        <h1 className="text-2xl font-bold mb-1">Complete your profile</h1>
        <p className="text-sm text-gray-600 mb-6">
          One last step: add your phone number to finish signup.
        </p>

        <label className="block mb-4">
          <span className="mb-2 block text-sm font-medium text-gray-700">Email</span>
          <input
            disabled
            value={email}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600"
          />
        </label>

        <label className="block mb-4">
          <span className="mb-2 block text-sm font-medium text-gray-700">Full name</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500"
          />
        </label>

        <label className="block mb-2">
          <span className="mb-2 block text-sm font-medium text-gray-700">Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+82 10-1234-5678"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500"
          />
        </label>

        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-white font-semibold hover:bg-violet-500 transition disabled:opacity-70"
        >
          {saving ? "Saving…" : "Finish"}
        </button>
      </form>
    </div>
  );
}
