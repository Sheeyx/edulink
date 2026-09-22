"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth, redirectByRole, fetchSessionIdentity } from "@/providers/auth-context";

/**
 * Landing spot for the backend's Google OAuth redirect
 * (`GET /auth/google/callback` → `${FRONTEND_URL}/home`).
 *
 * The backend hands back httpOnly cookies only — no member JSON — so we
 * confirm the session via `fetchSessionIdentity()` (the cookie-authenticated
 * `checkAuthRoles` query). New Google sign-ups are always STUDENT on the
 * backend, but an *existing* MENTOR/ADMIN account signing in via Google
 * keeps their real role — so we route by the role this query reports
 * instead of assuming STUDENT.
 */
export default function GoogleAuthLandingPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    (async () => {
      const identity = await fetchSessionIdentity();
      if (!identity) {
        router.replace("/auth/login?error=google_auth_failed");
        return;
      }

      setUser((prev) => ({
        id: identity.id || prev?.id || "",
        email: identity.email || prev?.email || "",
        name: prev?.name ?? null,
        role: identity.role,
        image: prev?.image ?? null,
      }));

      router.replace(redirectByRole(identity.role));
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
