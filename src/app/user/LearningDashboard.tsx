"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserRound, BookOpen, ClipboardList, Compass } from "lucide-react";

import { LearningDashboardProps, PanelType } from "./_types/types";

import Badge from "./_components/Badge";
import ProgressCard from "./_components/ProgressCard";
import ActionRow from "./_components/ActionRow";
import DetailPanel from "./profile/DetailPanel";

export default function LearningDashboardClient({
  role,
  name,
  avatarUrl,
}: LearningDashboardProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const panel = useMemo(() => {
    const p = sp.get("panel");
    if (p === "profile") return "profile";
    if (p === "courses") return "courses";
    if (p === "assignments") return "assignments";
    if (p === "explore") return "explore";
    return null;
  }, [sp]) as PanelType;

  function go(next: PanelType) {
    router.push(next ? `/user?panel=${next}` : "/user");
  }

  return (
    <div className="space-y-5">
      {panel === null ? (
        <>
          <header className="mb-6">
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Welcome back, {name} 👋
            </h1>
            <p className="text-gray-800 text-base">
              Continue learning, track your progress, and reach your goals faster.
            </p>
          </header>

          <ActionRow
            icon={
              <Badge bg="bg-blue-100" fg="text-blue-700">
                <UserRound className="w-6 h-6" />
              </Badge>
            }
            title="Complete Your Profile"
            desc="Add your photo and personal details to personalize your learning experience"
            onClick={() => go("profile")}
          />

          <ActionRow
            icon={
              <Badge bg="bg-green-100" fg="text-green-700">
                <BookOpen className="w-6 h-6" />
              </Badge>
            }
            title="Continue Learning"
            desc="Pick up where you left off and keep making progress"
            onClick={() => go("courses")}
          />

          <ActionRow
            icon={
              <Badge bg="bg-orange-100" fg="text-orange-700">
                <ClipboardList className="w-6 h-6" />
              </Badge>
            }
            title="Your Assignments"
            desc="View tasks, submit homework, and never miss a deadline"
            onClick={() => go("assignments")}
          />

          <ActionRow
            icon={
              <Badge bg="bg-purple-100" fg="text-purple-700">
                <Compass className="w-6 h-6" />
              </Badge>
            }
            title="Explore New Courses"
            desc="Discover new skills and topics tailored to your goals"
            onClick={() => go("explore")}
          />

          <ProgressCard />
        </>
      ) : (
        <DetailPanel panel={panel} onBack={() => go(null)} />
      )}
    </div>
  );
}
