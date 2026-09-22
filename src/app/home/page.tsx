"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gqlFetch } from "@/libs/graphql";
import { useAuth, redirectByRole } from "@/providers/auth-context";

/**
 * Landing spot for the backend's Google OAuth redirect
 * (`GET /auth/google/callback` → `${FRONTEND_URL}/home`).
 *
 * The backend hands back httpOnly cookies only — no member JSON — so all we
 * can do here is confirm the session via the cookie-authenticated `checkAuth`
 * query and send the visitor on. New Google sign-ups are always STUDENT on
 * the backend, so `/user` is correct for them; an existing MENTOR/ADMIN
 * account signing in via Google will land on `/user` too until a page that
 * loads their full profile runs.
 */
const CHECK_AUTH = `query CheckAuth { checkAuth }`;

export default function GoogleAuthLandingPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    (async () => {
      try {
        const data = await gqlFetch<{ checkAuth: string }>(CHECK_AUTH, undefined, {
          withCredentials: true,
        });
        const email = data.checkAuth.replace(/^Hi\s+/, "").trim();

        setUser((prev) => ({
          id: prev?.id ?? "",
          email: email || prev?.email || "",
          name: prev?.name ?? null,
          role: prev?.role ?? "STUDENT",
          image: prev?.image ?? null,
        }));

        router.replace(redirectByRole("STUDENT"));
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
