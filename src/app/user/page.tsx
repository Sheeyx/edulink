"use client";

import { useAuth } from "@/providers/auth-context";
import LearningDashboard from "./LearningDashboard";

export default function UserDashboardPage() {
  const { user } = useAuth();

  // layout already guards, this is just extra safety
  if (!user) return <div className="min-h-[30vh]" />;

  return (
    <LearningDashboard
      role="STUDENT"
      name={user.name || user.email}
      avatarUrl={user.image || undefined}
    />
  );
}
