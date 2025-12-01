"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaGoogle } from "react-icons/fa";
import { SiKakaotalk } from "react-icons/si";
import { useAuth } from "@/providers/auth-context";
import { gqlFetch } from "@/libs/graphql";
import { signIn } from "next-auth/react";

type LoginInput = { memberEmail: string; memberPassword: string };
type LoginResult = {
  login: {
    _id: string;
    memberEmail: string;
    memberFullName?: string | null;
    memberImage?: string | null;
    memberRole?: "STUDENT" | "MENTOR" | "ADMIN" | string | null;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
  };
};

const LOGIN_MUTATION = `
mutation Login($input: LoginInput!) {
  login(input: $input) {
    _id
    memberEmail
    memberFullName
    memberImage
    memberRole
    accessToken
    refreshToken
    accessTokenExpiresIn
    refreshTokenExpiresIn
  }
}
`;

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useAuth();

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });

  // Handle URL parameters for error messages
  useEffect(() => {
    const error = params.get("error");
    const emailParam = params.get("email");

    if (error === "email_exists" && emailParam) {
      setErr(
        `An account with ${emailParam} already exists. Please log in with your email and password.`
      );
      setForm((prev) => ({ ...prev, email: emailParam }));
    }
  }, [params]);

  function resolveRedirect(roleRaw: string | null | undefined): string {
    const role = (roleRaw || "").toUpperCase();
    if (role === "MENTOR") return "/mentor";
    if (role === "ADMIN") return "/dashboard";
    return "/user"; // default STUDENT/unknown -> /user
  }

  function sanitizeCallbackUrl(fallback: string): string {
    const cb = params.get("callbackUrl");
    if (!cb) return fallback;
    try {
      const url = new URL(cb);
      const sameOrigin = url.origin === window.location.origin;
      // Only allow same-origin paths you actually support
      if (!sameOrigin) return fallback;
      const pathname = url.pathname;
      // Keep it simple: allow only a few destinations
      if (["/user", "/mentor", "/admin", "/courses"].includes(pathname)) {
        return pathname;
      }
      return fallback;
    } catch {
      return fallback;
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const variables: { input: LoginInput } = {
        input: { memberEmail: form.email, memberPassword: form.password },
      };
      const data = await gqlFetch<LoginResult>(LOGIN_MUTATION, variables);

      // Save tokens + user snapshot
      localStorage.setItem("accessToken", data.login.accessToken || "");
      localStorage.setItem("refreshToken", data.login.refreshToken || "");
      localStorage.setItem("accessTokenExpiresAt", String(Date.now() + (data.login.accessTokenExpiresIn || 0) * 1000));
      localStorage.setItem("refreshTokenExpiresAt", String(Date.now() + (data.login.refreshTokenExpiresIn || 0) * 1000));

      // Safely cast role to MemberRole
      const roleValue = (data.login.memberRole?.toUpperCase() || "").trim();
      const validRoles: string[] = ["STUDENT", "MENTOR", "ADMIN"];
      const role: "STUDENT" | "MENTOR" | "ADMIN" = validRoles.includes(roleValue)
        ? (roleValue as "STUDENT" | "MENTOR" | "ADMIN")
        : "STUDENT";

      const currentUser = {
        id: data.login._id || "",
        email: data.login.memberEmail || "",
        name: data.login.memberFullName ?? null,
        role: role,
        image: data.login.memberImage ?? null,
      };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setUser(currentUser); // navbar updates immediately

      // Redirect by role, optionally respecting safe callbackUrl
      const byRole = resolveRedirect(data.login.memberRole);
      const destination = sanitizeCallbackUrl(byRole);
      router.push(destination);
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid min-h-screen items-center gap-10 md:grid-cols-2">
          <div className="relative hidden md:block">
            <Image
              src="/images/auth/login.png"
              alt="Login illustration"
              width={900}
              height={700}
              priority
              className="w-full h-auto"
            />
          </div>

          <div className="w-full max-w-xl md:ml-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Welcome Back</h1>

            <form onSubmit={onSubmit} className="rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <label className="block mb-4">
                <span className="mb-2 block text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none ring-0 focus:border-violet-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </label>

              <label className="block mb-2">
                <span className="mb-2 block text-sm font-medium text-gray-700">Password</span>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 outline-none ring-0 focus:border-violet-500"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPw ? "Hide password" : "Show password"}
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                  >
                    {showPw ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                  </button>
                </div>
              </label>

              {err && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{err}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-white font-medium hover:bg-violet-500 transition disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              <div className="my-8 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200" />
                <span className="text-sm text-gray-500">Or sign in with</span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
               <button
  type="button"
 onClick={() =>
        signIn("google", { callbackUrl: "/auth/social/google?intent=login" })
      }  className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition"
  aria-label="Sign in with Google"
>
  <FaGoogle size={22} className="text-[#DB4437]" />
</button>

                <button type="button" className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition" aria-label="Sign in with Telegram">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#229ED9" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M9.999 15.177 9.85 18.21a.752.752 0 0 0 1.07.676l2.404-1.21 2.871 2.103c.528.391 1.291.097 1.419-.566l2.94-15.01a.75.75 0 0 0-1.049-.828L3.188 9.438a.75.75 0 0 0 .044 1.4l4.507 1.61 10.505-6.58-8.245 8.945Z" />
                  </svg>
                </button>
                <button type="button" className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition bg-[#FEE500]" aria-label="Sign in with Kakao">
                  <SiKakaotalk size={22} className="text-black" />
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-violet-600 hover:underline">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}