// app/user/_components/LearningDashboard/LearningDashboardClient.tsx
"use client";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import {
  UserRound,
  BookOpen,
  ClipboardList,
  Compass,
  GraduationCap,
  Users,
} from "lucide-react";

import { LearningDashboardProps, PanelType } from "./_components/_types/types";
import { DEFAULT_AVATAR, getRoleLabel } from "./_components/constants";

import Badge from "./_components/Badge";
import ProgressCard from "./_components/ProgressCard";
import DetailPanel from "./_components/DetailPanel";
import SmallTile from "./_components/SmallTile";
import ActionRow from "./_components/ActionRow";
import { buildDownloadUrl } from "@/libs/streamableUrl";


export default function LearningDashboardClient({
  role,
  name,
  avatarUrl,
}: LearningDashboardProps) {
  const [panel, setPanel] = useState<PanelType>(null);

  const roleLabel = getRoleLabel(role);
  const showBecomeMentor = role === "STUDENT";

  /* ✅ Resolve avatar URL safely */
  const resolvedAvatar = useMemo(() => {
    const url = buildDownloadUrl(avatarUrl);
    return url || DEFAULT_AVATAR;
  }, [avatarUrl]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-6 md:grid-cols-6">
          {/* LEFT */}
          <aside className="space-y-5 md:col-span-2">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border">
                  <Image
                    src={resolvedAvatar}
                    alt={`${name} avatar`}
                    fill
                    sizes="128px"
                    className="object-cover"
                    priority
                  />
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900">
                  {name}
                </h2>

                <p className="text-sm text-gray-800 mb-4">
                  Keep learning. One lesson at a time.
                </p>

                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg mb-6">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {roleLabel}
                  </span>
                </div>

                <button
                  onClick={() => setPanel("profile")}
                  className="w-full border-2 border-purple-600 text-purple-700 rounded-xl py-3 font-semibold mb-3 hover:bg-purple-50 transition"
                >
                  Edit Your Profile
                </button>

                <button
                  onClick={() => setPanel("courses")}
                  className="w-full bg-purple-700 text-white rounded-xl py-3 font-semibold hover:bg-purple-800 transition"
                >
                  Go to My Courses
                </button>
              </div>
            </div>

            {showBecomeMentor && (
              <SmallTile
                iconTint="bg-green-100 text-green-700"
                icon={<GraduationCap className="w-6 h-6" />}
                title="Become a Mentor"
                desc="Teach students and earn from your knowledge"
              />
            )}

            <SmallTile
              iconTint="bg-purple-100 text-purple-700"
              icon={<Users className="w-6 h-6" />}
              title="Invite a Friend"
              desc="Learn together and grow faster"
            />
          </aside>

          {/* RIGHT */}
          <main className="space-y-5 md:col-span-4">
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
                  onClick={() => setPanel("profile")}
                />

                <ActionRow
                  icon={
                    <Badge bg="bg-green-100" fg="text-green-700">
                      <BookOpen className="w-6 h-6" />
                    </Badge>
                  }
                  title="Continue Learning"
                  desc="Pick up where you left off and keep making progress"
                  onClick={() => setPanel("courses")}
                />

                <ActionRow
                  icon={
                    <Badge bg="bg-orange-100" fg="text-orange-700">
                      <ClipboardList className="w-6 h-6" />
                    </Badge>
                  }
                  title="Your Assignments"
                  desc="View tasks, submit homework, and never miss a deadline"
                  onClick={() => setPanel("assignments")}
                />

                <ActionRow
                  icon={
                    <Badge bg="bg-purple-100" fg="text-purple-700">
                      <Compass className="w-6 h-6" />
                    </Badge>
                  }
                  title="Explore New Courses"
                  desc="Discover new skills and topics tailored to your goals"
                  onClick={() => setPanel("explore")}
                />

                <ProgressCard />
              </>
            ) : (
              <DetailPanel panel={panel} onBack={() => setPanel(null)} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
