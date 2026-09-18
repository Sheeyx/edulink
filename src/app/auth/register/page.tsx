"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaGoogle } from "react-icons/fa";
import { SiKakaotalk } from "react-icons/si";
import { useAuth } from "@/providers/auth-context";
import { gqlFetch } from "@/libs/graphql";
import { signIn } from "next-auth/react";

// ===== API Types =====
type MemberInput = {
  memberEmail: string;
  memberPhone?: string;
  memberPassword: string;
  memberFullName: string;
  memberRole: "STUDENT" | "MENTOR" | "ADMIN";
  memberAuth: "SYSTEM" | "GOOGLE" | "KAKAO" | "TELEGRAM";
};

type SignupResult = {
  signup: {
    _id: string;
    memberRole?: "STUDENT" | "MENTOR" | "ADMIN" | string | null;
    memberEmail: string;
    memberFullName: string;
    memberImage?: string | null;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
  };
};

const SIGNUP_MUTATION = `
mutation Signup($input: MemberInput!) {
  signup(input: $input) {
    _id
    memberRole
    memberStatus
    memberAuth
    memberEmail
    memberFullName
    memberImage
    memberBio
    memberPoints
    memberRank
    memberLikes
    memberCoursesCompleted
    createdAt
    updatedAt
    memberPhone
    memberMedals { medalType awardedAt }
    accessToken
    refreshToken
    accessTokenExpiresIn
    refreshTokenExpiresIn
  }
}
`;

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,30}$/;

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    accepted: false,
  });

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = useMemo(
    () =>
      form.fullName.trim() &&
      form.email.trim() &&
      form.password &&
      form.confirm &&
      form.password === form.confirm &&
      form.accepted &&
      !loading,
    [form, loading]
  );

  const resolveRedirect = (roleRaw?: string | null): string => {
    const role = (roleRaw || "").toUpperCase();
    if (role === "MENTOR") return "/mentor";
    if (role === "ADMIN") return "/admin";
    return "/user";
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    // Client-side validation
    if (!PASSWORD_REGEX.test(form.password)) {
      setErr("Password must be 6–30 chars and include uppercase, lowercase, and a number.");
      return;
    }
    if (form.confirm !== form.password) {
      setErr("Passwords don't match.");
      return;
    }
    if (form.phone && !/^[+0-9()\-\s]{7,20}$/.test(form.phone)) {
      setErr("Please enter a valid phone number, or leave it empty.");
      return;
    }

    if (!canSubmit) return;

    setLoading(true);
    try {
      const input: MemberInput = {
        memberEmail: form.email.trim(),
        memberPassword: form.password,
        memberFullName: form.fullName.trim(),
        memberRole: "STUDENT",
        memberAuth: "SYSTEM",
        ...(form.phone.trim() ? { memberPhone: form.phone.trim() } : {}),
      };

      const data = await gqlFetch<SignupResult>(SIGNUP_MUTATION, { input });
      const res = data.signup;

      // Save tokens
      localStorage.setItem("accessToken", res.accessToken || "");
      localStorage.setItem("refreshToken", res.refreshToken || "");
      localStorage.setItem(
        "accessTokenExpiresAt",
        String(Date.now() + (res.accessTokenExpiresIn || 0) * 1000)
      );
      localStorage.setItem(
        "refreshTokenExpiresAt",
        String(Date.now() + (res.refreshTokenExpiresIn || 0) * 1000)
      );

      // Safely cast role to MemberRole
      const roleValue = (res.memberRole?.toUpperCase() || "").trim();
      const validRoles: string[] = ["STUDENT", "MENTOR", "ADMIN"];
      const role: "STUDENT" | "MENTOR" | "ADMIN" = validRoles.includes(roleValue)
        ? (roleValue as "STUDENT" | "MENTOR" | "ADMIN")
        : "STUDENT";

      // Update AuthContext + persist snapshot
      const currentUser = {
        id: res._id || "",
        email: res.memberEmail || "",
        name: res.memberFullName ?? null,
        role: role,
        image: res.memberImage ?? null,
      };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setUser(currentUser);

      router.push(resolveRedirect(res.memberRole));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid min-h-screen items-center gap-10 md:grid-cols-2">
          {/* Illustration */}
          <div className="relative hidden md:block">
            <Image
              src="/images/auth/register.png"
              alt="Register illustration"
              width={900}
              height={700}
              priority
              className="w-full h-auto"
            />
          </div>

          {/* Form */}
          <div className="w-full max-w-xl md:ml-auto">
            <h1 className="text-3xl font-extrabold tracking-tight mb-8">
              Create your account
            </h1>

            <form onSubmit={onSubmit} className="rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
              {/* Full Name */}
              <label className="block mb-4">
                <span className="mb-2 block text-sm font-medium text-gray-700">Full Name</span>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-brand-primary/80"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </label>

              {/* Email */}
              <label className="block mb-4">
                <span className="mb-2 block text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-brand-primary/80"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </label>

              {/* Phone (optional) */}
              <label className="block mb-4">
                <span className="mb-2 block text-sm font-medium text-gray-700">Phone</span>
                <input
                  type="tel"
                  placeholder="+01090909090"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-brand-primary/80"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>

              {/* Password */}
              <label className="block mb-4">
                <span className="mb-2 block text-sm font-medium text-gray-700">Password</span>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 outline-none focus:border-brand-primary/80"
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

              {/* Confirm Password */}
              <label className="block mb-2">
                <span className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</span>
                <div className="relative">
                  <input
                    type={showPw2 ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 outline-none focus:border-brand-primary/80"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPw2 ? "Hide password" : "Show password"}
                    onClick={() => setShowPw2((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                  >
                    {showPw2 ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                  </button>
                </div>
                {form.confirm && form.password !== form.confirm && (
                  <p className="mt-1 text-sm text-red-600">Passwords don&apos;t match.</p>
                )}
              </label>

              {/* Terms */}
              <label className="mt-4 flex items-start gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.accepted}
                  onChange={(e) => setForm({ ...form, accepted: e.target.checked })}
                />
                <span>
                  I accept the{" "}
                  <a className="text-brand-primary hover:underline" href="#">Terms of Service</a>{" "}
                  and{" "}
                  <a className="text-brand-primary hover:underline" href="#">Privacy Policy</a>.
                </span>
              </label>

              {/* Error */}
              {err && <p className="mt-3 text-sm text-red-600 whitespace-pre-wrap">{err}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 font-semibold transition text-white disabled:opacity-60 disabled:cursor-not-allowed bg-gray-300 data-[enabled=true]:bg-brand-primary data-[enabled=true]:hover:bg-brand-primary/80"
                data-enabled={canSubmit}
              >
                {loading ? "Creating account…" : "Sign Up with Email"}
              </button>

              {/* Divider */}
              <div className="my-8 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200" />
                <span className="text-sm text-gray-500">Or sign up with</span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Socials */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
  type="button"
  onClick={() => signIn("google", { callbackUrl: "/auth/social/google?intent=signup" })}
  className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition"
  aria-label="Sign up with Google"
>
  <FaGoogle size={22} className="text-[#DB4437]" />
</button>

                <button type="button" className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition" aria-label="Sign up with Telegram">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#229ED9" viewBox="0 0 24 24" width="22" height="22">
                    <path d="M9.999 15.177 9.85 18.21a.752.752 0 0 0 1.07.676l2.404-1.21 2.871 2.103c.528.391 1.291.097 1.419-.566l2.94-15.01a.75.75 0 0 0-1.049-.828L3.188 9.438a.75.75 0 0 0 .044 1.4l4.507 1.61 10.505-6.58-8.245 8.945Z" />
                  </svg>
                </button>
                <button type="button" className="w-14 h-14 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition bg-[#FEE500]" aria-label="Sign up with Kakao">
                  <SiKakaotalk size={20} className="text-black" />
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-brand-primary hover:underline">Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}