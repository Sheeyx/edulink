"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gqlFetch } from "@/libs/graphql";
import { useAuth, redirectByRole, roleSafe } from "@/providers/auth-context";

/**
 * Landing spot for the backend's Google OAuth redirect
 * (`GET /auth/google/callback` → `${FRONTEND_URL}/home`).
 *
 * The backend hands back httpOnly cookies only — no member JSON — so we
 * confirm the session via the cookie-authenticated `checkAuthRoles` query,
 * which packs email/role/id into a string ("Hi {email} you are {role}
 * (memberId) {id}") without needing to already know our own id. New Google
 * sign-ups are always STUDENT on the backend, but an *existing* MENTOR/ADMIN
 * account signing in via Google keeps their real role — so we route by the
 * role this query reports instead of assuming STUDENT.
 */
const CHECK_AUTH_ROLES = `query CheckAuthRoles { checkAuthRoles }`;
const CHECK_AUTH_PATTERN = /^Hi\s+(.+?)\s+you are\s+(\S+)\s+\(memberId\)\s+(\S+)$/;

export default function GoogleAuthLandingPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    (async () => {
      try {
        const data = await gqlFetch<{ checkAuthRoles: string }>(CHECK_AUTH_ROLES);
        const match = CHECK_AUTH_PATTERN.exec(data.checkAuthRoles);
        const [, email, rawRole, id] = match ?? [];
        const role = roleSafe(rawRole);

        setUser((prev) => ({
          id: id || prev?.id || "",
          email: email || prev?.email || "",
          name: prev?.name ?? null,
          role,
          image: prev?.image ?? null,
        }));

        router.replace(redirectByRole(role));
      } catch {
        router.replace("/auth/login?error=google_auth_failed");
      }
    })();
  }, [router, setUser]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md text-center">
        <div className="relative mx-auto mb-5 h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-brand-primary/25" />
          <div className="absolute inset-0 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Signing you in…</h2>
        <p className="mt-1 text-sm text-gray-600">Finishing up your Google sign-in.</p>
      </div>
    </main>
  );
}
