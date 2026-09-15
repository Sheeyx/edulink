"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-context";
import UserSidebar from "./_components/UserSidebar";

export default function UserLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [ready, setReady] = useState(false);

  // wait for AuthProvider hydrate (localStorage)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(t);
  }, []);

  const role = useMemo(
    () => (user?.role || "").toString().toUpperCase(),
    [user?.role]
  );

  // ✅ Guard all /user/* pages here
  useEffect(() => {
    if (!ready) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (role === "STUDENT") return;

    if (role === "MENTOR") {
      router.replace("/mentor");
      return;
    }

    if (role === "ADMIN") {
      router.replace("/admin");
      return;
    }

    router.replace("/auth/login");
  }, [ready, user, role, router]);

  // block UI while deciding
  if (!ready || !user || role !== "STUDENT") {
    return <div className="min-h-[50vh]" />;
  }

  const name = user?.name || user?.email || "Student";
  const avatarUrl = user?.image || "";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 mt-20 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-6">
          {/* Left: persistent sidebar */}
          <aside className="md:col-span-2">
            <UserSidebar
              name={name}
              avatarUrl={avatarUrl}
              roleLabel="Student"
              activePath={pathname}
              onGoHome={() => router.push("/user")}
              onOpenProfile={() => router.push("/user/profile")}
              onOpenCourses={() => router.push("/user/courses")}
              onOpenAssignments={() => router.push("/user/assignments")}
              onOpenExplore={() => router.push("/user/explore")}
            />
          </aside>

          {/* Right: page content */}
          <main className="md:col-span-4">
            <div className="rounded-[28px] bg-white border border-gray-100 shadow-[0_10px_35px_rgba(99,99,160,0.08)] p-7">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
