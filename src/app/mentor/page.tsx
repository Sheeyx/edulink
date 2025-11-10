"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import MentorDashboardClient from "./MentorDashboardClient";
import { useAuth } from "@/providers/auth-context";

export default function MentorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  // Wait for AuthProvider to hydrate user from localStorage
  useEffect(() => {
    console.log(user, "USER");
    
    const t = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(t);
  }, []);

  const role = useMemo(() => (user?.role || "").toUpperCase(), [user?.role]);

  // Redirect based on role
  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (role === "STUDENT") {
      router.replace("/user");
      return;
    }

    if (role === "ADMIN") {
      router.replace("/admin");
      return;
    }

    if (role !== "MENTOR") {
      router.replace("/auth/login");
    }
  }, [hydrated, user, role, router]);

  // Simple loader or placeholder while deciding
  if (!hydrated || !user || role !== "MENTOR") {
    return <div className="min-h-[50vh]" />;
  }

  // ✅ Mentor dashboard visible only for MENTOR
  return (
    <MentorDashboardClient
      name={user.name || user.email}
      memberId={user.id}
      avatarUrl={user.image || undefined}
    />
  );
}
