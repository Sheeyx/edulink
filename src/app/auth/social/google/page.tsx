"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { gqlFetch } from "@/libs/graphql";
import { useAuth } from "@/providers/auth-context";

type Role = "STUDENT" | "MENTOR" | "ADMIN";

/* ===== GraphQL ===== */
const CHECK_SOCIAL = `
  query CheckSocialIdExists($input: CheckSocialUserInput!) {
    checkSocialIdExists(input: $input) {
      exists
      memberData {
        _id
        memberRole
        memberStatus
        memberAuth
        memberEmail
        memberPhone
        memberGoogleId
        memberTelegramId
        memberKakaoId
        memberUsername
        memberFullName
        memberImage
        memberBio
        memberPoints
        memberRank
        memberLikes
        memberCoursesCompleted
        createdAt
        updatedAt
        accessToken
        refreshToken
        accessTokenExpiresIn
        refreshTokenExpiresIn
      }
    }
  }
`;

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

/* ===== Helpers ===== */
const roleSafe = (v?: string | null): Role =>
  (["STUDENT", "MENTOR", "ADMIN"].includes((v ?? "").toUpperCase())
    ? ((v ?? "").toUpperCase() as Role)
    : "STUDENT");

const redirectByRole = (v?: string | null) => {
  const r = (v ?? "").toUpperCase();
  if (r === "MENTOR") return "/mentor";
  if (r === "ADMIN") return "/admin";
  return "/user";
};

function persistTokens(
  accessToken: string,
  refreshToken: string,
  accessExpSec: number,
  refreshExpSec: number
) {
  localStorage.setItem("accessToken", accessToken || "");
  localStorage.setItem("refreshToken", refreshToken || "");
  localStorage.setItem(
    "accessTokenExpiresAt",
    String(Date.now() + (accessExpSec || 0) * 1000)
  );
  localStorage.setItem(
    "refreshTokenExpiresAt",
    String(Date.now() + (refreshExpSec || 0) * 1000)
  );
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,30}$/;

const googleSubFrom = (session: any): string | undefined =>
  session?.user?.sub || (session?.user as any)?.id || undefined;

/* ===== Pretty “Udemy-like” Loader ===== */
function BrandLoader({ infoText = "Connecting your Google account…" }: { infoText?: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md text-center">
        {/* Badge + spinning ring */}
        <div className="relative mx-auto mb-5 h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-violet-200" />
          <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
          <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center shadow-sm animate-pulse">
            <span className="text-violet-700 font-extrabold text-xl select-none">S</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900">Almost there…</h2>
        <p className="mt-1 text-sm text-gray-600">{infoText}</p>

        {/* Shimmer progress bar */}
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-400 via-violet-600 to-violet-400 animate-[shimmer_1.4s_ease-in-out_infinite]" />
        </div>

        {/* Tips */}
        <p className="mt-3 text-xs text-gray-500">This may take a few seconds…</p>
      </div>

      {/* Local keyframes for shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </main>
  );
}

/* ===== Component ===== */
export default function GoogleSocialRouter() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setUser } = useAuth();
  const sp = useSearchParams();

  const intent = (sp.get("intent") || "signup").toLowerCase() as "login" | "signup";
  const email = useMemo(() => session?.user?.email || "", [session]);
  const nameFromGoogle = useMemo(() => session?.user?.name || "", [session]);
  const image = useMemo(() => (session?.user as any)?.image || "", [session]);
  const googleSub = useMemo(() => googleSubFrom(session), [session]);

  const [phase, setPhase] = useState<"checking" | "ask_details" | "submitting" | "done">("checking");
  const [form, setForm] = useState({ name: nameFromGoogle, phone: "", password: "", confirm: "" });
  const [err, setErr] = useState<string | null>(null);

  const pwValid = useMemo(() => PASSWORD_REGEX.test(form.password), [form.password]);
  const pwMatch = useMemo(() => form.password && form.password === form.confirm, [form.password, form.confirm]);
  const canSubmit = form.name.trim() && form.phone.trim() && pwValid && pwMatch;

  /* ===== Step 1: Check if social user exists (silent) ===== */
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!googleSub) {
      setErr("Missing Google ID (sub). Try again.");
      setPhase("done");
      return;
    }

    (async () => {
      try {
        setPhase("checking");
        const check = await gqlFetch<{
          checkSocialIdExists: {
            exists: boolean;
            memberData?: any;
          };
        }>(CHECK_SOCIAL, {
          input: { memberAuth: "GOOGLE", memberGoogleId: googleSub },
        });

        const exists = check?.checkSocialIdExists?.exists;
        const userData = check?.checkSocialIdExists?.memberData;

        if (exists && userData) {
          // ✅ Backend already returned tokens → instant login
          persistTokens(
            userData.accessToken,
            userData.refreshToken,
            userData.accessTokenExpiresIn,
            userData.refreshTokenExpiresIn
          );

          setUser({
            id: userData._id,
            email: userData.memberEmail,
            name: userData.memberFullName ?? null,
            role: roleSafe(userData.memberRole),
            image: userData.memberImage ?? null,
          });

          router.replace(redirectByRole(userData.memberRole));
          setPhase("done");
        } else {
          // ❌ Not found → ask for phone/password for signup
          setPhase("ask_details");
        }
      } catch (e: any) {
        setErr(e.message || "Error checking social user.");
        setPhase("done");
      }
    })();
  }, [status, googleSub]);

  /* ===== Step 2: Signup flow ===== */
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setPhase("submitting");

      const signup = await gqlFetch<{
        signup: {
          _id: string;
          memberRole?: string | null;
          memberEmail: string;
          memberFullName?: string | null;
          memberImage?: string | null;
          accessToken: string;
          refreshToken: string;
          accessTokenExpiresIn: number;
          refreshTokenExpiresIn: number;
        };
      }>(SIGNUP, {
        input: {
          memberAuth: "GOOGLE",
          memberGoogleId: googleSub,
          memberEmail: email,
          memberFullName: form.name.trim(),
          memberPhone: form.phone.trim(),
          memberPassword: form.password,
          memberRole: "STUDENT",
          memberImage: image,
        },
      });

      const u = signup.signup;
      persistTokens(u.accessToken, u.refreshToken, u.accessTokenExpiresIn, u.refreshTokenExpiresIn);

      setUser({
        id: u._id,
        email: u.memberEmail,
        name: u.memberFullName ?? null,
        role: roleSafe(u.memberRole),
        image: u.memberImage ?? null,
      });

      router.replace(redirectByRole(u.memberRole));
      setPhase("done");
    } catch (e: any) {
      setErr(e.message || "Signup failed.");
      setPhase("ask_details");
    }
  }

  /* ===== UI ===== */
  if (phase === "checking") {
    return <BrandLoader infoText="Connecting your Google account…" />;
  }

  if (phase === "submitting") {
    return <BrandLoader infoText="Creating your account…" />;
  }

  if (phase === "ask_details") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md rounded-2xl border border-gray-200 p-6 shadow-sm bg-white"
        >
          <h1 className="text-xl font-semibold mb-2">Complete your registration 👋</h1>
          <p className="text-sm text-gray-600 mb-6">
            We need a few more details to finish setting up your account.
          </p>

          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-gray-100 cursor-not-allowed rounded-xl border border-gray-300 px-4 py-3 text-gray-600"
            />
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Full name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500"
            />
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Phone</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+82 10-1234-5678"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500"
            />
          </label>

          <label className="block mb-2">
            <span className="text-sm font-medium text-gray-700">Create password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 chars, include upper/lowercase and number"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500"
            />
            {!PASSWORD_REGEX.test(form.password) && form.password && (
              <p className="mt-1 text-xs text-red-600">
                Password must be 6–30 chars, include uppercase, lowercase, and a number.
              </p>
            )}
          </label>

          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Confirm password</span>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Confirm password"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500"
            />
            {form.confirm && form.password !== form.confirm && (
              <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
            )}
          </label>

          {err && <p className="text-sm text-red-600 mb-2">{err}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 font-semibold transition text-white disabled:opacity-60 disabled:cursor-not-allowed bg-gray-300 data-[enabled=true]:bg-violet-600 data-[enabled=true]:hover:bg-violet-500"
            data-enabled={canSubmit}
          >
            Continue
          </button>
        </form>
      </main>
    );
  }

  if (err) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-3">{err}</p>
          <button
            onClick={() => router.replace("/auth/login")}
            className="rounded-xl bg-violet-600 px-4 py-2 text-white"
          >
            Go back to login
          </button>
        </div>
      </main>
    );
  }

  return null;
}
