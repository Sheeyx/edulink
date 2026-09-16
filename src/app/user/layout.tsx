"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-context";
import UserSidebar from "./_components/UserSidebar";

const COLLAPSE_STORAGE_KEY = "user-sidebar-collapsed";

export default function UserLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // wait for AuthProvider to hydrate localStorage
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_STORAGE_KEY) === "1");
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  const role = useMemo(
    () => (user?.role || "").toString().toUpperCase(),
    [user?.role]
  );

  // 🔐 Guard all /user routes
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

  const name = user.name || user.email || "Student";
  const avatarUrl = user.image || "";

  // ✅ Hide sidebar ONLY on course details ( /user/courses/[id] )
  //    Sidebar stays visible on /user/courses
  const hideSidebar =
    pathname.startsWith("/user/courses/") && pathname !== "/user/courses/";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 mt-20 p-6">
      <div className="mx-auto max-w-7xl">
        <div
          className={
            hideSidebar
              ? "block"
              : [
                  "grid grid-cols-1 gap-6",
                  collapsed ? "md:grid-cols-[80px_4fr]" : "md:grid-cols-[2fr_4fr]",
                ].join(" ")
          }
        >
          {/* Sidebar (hidden ONLY on details page) */}
          {!hideSidebar && (
            <aside className="min-w-0">
              <UserSidebar
                name={name}
                avatarUrl={avatarUrl}
                roleLabel="Student"
                activePath={pathname}
                collapsed={collapsed}
                onToggleCollapsed={toggleCollapsed}
                onGoHome={() => router.push("/user")}
                onOpenProfile={() => router.push("/user/profile")}
                onOpenCourses={() => router.push("/user/courses")}
                onOpenAssignments={() => router.push("/user/assignments")}
                onOpenExplore={() => router.push("/user/explore")}
              />
            </aside>
          )}

          {/* Page content */}
          <main className="min-w-0">
            <div className="rounded-[28px] bg-white border border-gray-100 shadow-[0_10px_35px_rgba(99,99,160,0.08)] p-7">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
