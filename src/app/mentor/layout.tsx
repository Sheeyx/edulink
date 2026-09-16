"use client"

// app/mentor/layout.tsx
import type { ReactNode } from "react";
import * as React from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/mentor/_components/Sidebar";
import { useAuth } from "@/providers/auth-context";

const COLLAPSE_STORAGE_KEY = "mentor-sidebar-collapsed";

export default function MentorLayout({ children }: { children: ReactNode }) {
        const { user } = useAuth();
        const router = useRouter();
        const name = user?.name || "Mentor";
        const avatarUrl = user?.image || "";

        const [collapsed, setCollapsed] = React.useState(false);

        React.useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 mt-20 p-6">
      <div className="mx-auto max-w-7xl">
        <div
          className={[
            "grid grid-cols-1 gap-6",
            collapsed ? "md:grid-cols-[80px_4fr]" : "md:grid-cols-[2fr_4fr]",
          ].join(" ")}
        >
          {/* Left: persistent sidebar */}
          <aside className="min-w-0">
            <Sidebar
                        name={name}
                        avatarUrl={avatarUrl}
                        roleLabel="Mentor"
                        onOpenCourses={() => router.push("/mentor/courses")}
                        collapsed={collapsed}
                        onToggleCollapsed={toggleCollapsed}
                      />
          </aside>

          {/* Right: page content */}
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
