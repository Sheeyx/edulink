// app/user/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-context";
import LearningDashboard from "./LearningDashboard";

export default function UserPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [ready, setReady] = useState(false);

  // wait for AuthProvider to hydrate localStorage user
  useEffect(() => {
    // small tick to allow AuthProvider to set user from localStorage
    const t = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(t);
  }, []);

  const role = useMemo(
    () => (user?.role || "").toString().toUpperCase(),
    [user?.role]
  );

  useEffect(() => {
    console.log(user, "user");

    if (!ready) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (role === "STUDENT") return; // stay here

    if (role === "MENTOR") {
      router.replace("/mentor");
      return;
    }

    if (role === "ADMIN") {
      router.replace("/admin");
      return;
    }

    // unknown role -> send to login or a safe default
    router.replace("/auth/login");
  }, [ready, user, role, router]);

  if (!ready || !user || role !== "STUDENT") {
    // lightweight placeholder while we decide where to go
    return <div className="min-h-[50vh]" />;
  }

  // ✅ STUDENT view
  return (
    <LearningDashboard
      role="STUDENT"
      name={user.name || user.email}
      avatarUrl={user.image || undefined}
    />
  );
}
