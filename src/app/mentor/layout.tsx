"use client"

// app/mentor/layout.tsx
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/mentor/components/Sidebar";
import { useAuth } from "@/providers/auth-context";

export default function MentorLayout({ children }: { children: ReactNode }) {
        const { user } = useAuth();
        const router = useRouter();
        const name = user?.name || "Mentor";
        const avatarUrl = user?.image || "";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 mt-20 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-6">
          {/* Left: persistent sidebar */}
          <aside className="md:col-span-2">
            <Sidebar
                        name={name}
                        avatarUrl={avatarUrl}
                        roleLabel="Mentor"
                        onOpenCourses={() => router.push("/mentor/courses")}
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
