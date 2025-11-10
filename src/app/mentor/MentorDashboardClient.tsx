"use client";

import React, { useMemo, useState } from "react";
import { useRefreshRoleOnce } from "@/hooks/useRefreshRoleOnce";
import {
  UserRound,
  BookOpen,
  ClipboardList,
  MessageSquare,
  DollarSign,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

import {
  Badge,
  ActionRow,
  SmallTile,
  ProgressCard,
  type ActionItem,
  type TileItem,
} from "@/components/Mentor";

import UpdateMemberForm from "@/app/mentor/components/UpdateMemberForm";

/** Use a local union so it matches exactly what we render here */
type Panel =
  | "profile"
  | "courses"
  | "assignments"
  | "messages"
  | "earnings"
  | null;

type Props = { name: string; memberId: string; avatarUrl?: string };

export default function MentorDashboardClient({ name, memberId, avatarUrl }: Props) {
  useRefreshRoleOnce();
  const [panel, setPanel] = useState<Panel>(null);

  const actions: ActionItem[] = useMemo(
    () => [
      {
        icon: (
          <Badge bg="bg-blue-50" fg="text-blue-600">
            <UserRound className="w-6 h-6" />
          </Badge>
        ),
        title: "Edit your profile",
        desc: "Update bio, photo, and availability",
        onClick: () => setPanel("profile"),
      },
      {
        icon: (
          <Badge bg="bg-green-50" fg="text-green-600">
            <BookOpen className="w-6 h-6" />
          </Badge>
        ),
        title: "My Courses",
        desc: "Create, edit, and publish lessons",
        onClick: () => setPanel("courses"),
      },
      {
        icon: (
          <Badge bg="bg-orange-50" fg="text-orange-600">
            <ClipboardList className="w-6 h-6" />
          </Badge>
        ),
        title: "Assignments",
        desc: "Post tasks, grade submissions, set deadlines",
        onClick: () => setPanel("assignments"),
      },
      {
        icon: (
          <Badge bg="bg-purple-50" fg="text-purple-600">
            <MessageSquare className="w-6 h-6" />
          </Badge>
        ),
        title: "Messages",
        desc: "Answer student questions & feedback",
        onClick: () => setPanel("messages"),
      },
      {
        icon: (
          <Badge bg="bg-yellow-50" fg="text-yellow-600">
            <DollarSign className="w-6 h-6" />
          </Badge>
        ),
        title: "Earnings",
        desc: "Track payouts & revenue",
        onClick: () => setPanel("earnings"),
      },
    ],
    []
  );

  const tiles: TileItem[] = useMemo(
    () => [
      {
        iconTint: "bg-green-50 text-green-600",
        icon: <BookOpen className="w-6 h-6" />,
        title: "Create a Course",
        desc: "Start a new module",
        onClick: () => setPanel("courses"),
      },
      {
        iconTint: "bg-yellow-50 text-yellow-600",
        icon: <DollarSign className="w-6 h-6" />,
        title: "Earnings",
        desc: "Payouts & reports",
        onClick: () => setPanel("earnings"),
      },
    ],
    []
  );

  /** Renders the right-side panel when a specific section is open */
  function renderPanelContent(p: Exclude<Panel, null>) {
    if (p === "profile") {
      return (
        <UpdateMemberForm
          memberId={memberId}
          onDone={() => setPanel(null)}
        />
      );
    }

    if (p === "earnings") {
      return (
        <div className="grid gap-4">
          <div className="rounded-2xl border p-4">
            <div className="text-sm text-gray-500">Total this month</div>
            <div className="text-3xl font-bold mt-1">$1,284.00</div>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="text-sm text-gray-500">Next payout</div>
            <div className="text-3xl font-bold mt-1">Nov 15</div>
          </div>
        </div>
      );
    }

    if (p === "courses") {
      return <p className="text-gray-500">Your courses will be listed here.</p>;
    }

    if (p === "assignments") {
      return <p className="text-gray-500">Assignments management UI goes here.</p>;
    }

    if (p === "messages") {
      return <p className="text-gray-500">Inbox and student messages appear here.</p>;
    }

    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-6">
          {/* LEFT */}
          <aside className="space-y-5 md:col-span-2">
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col items-center">
                <img
                  src={
                    avatarUrl ||
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
                  }
                  alt={`${name} profile`}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">Welcome, {name}!</h2>

                <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg mb-6">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm font-medium">Mentor</span>
                </div>

                <div className="w-full grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setPanel("profile")}
                    type="button"
                    className="w-full border-2 border-purple-600 text-purple-600 rounded-xl py-3 font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit Profile
                  </button>

                  <button
                    onClick={() => setPanel("courses")}
                    type="button"
                    className="w-full bg-purple-600 text-white rounded-xl py-3 font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <BookOpen className="w-4 h-4" />
                    View My Courses
                  </button>
                </div>
              </div>
            </section>

            {tiles.map((t, i) => (
              <SmallTile key={i} {...t} />
            ))}
          </aside>

          {/* RIGHT */}
          <main className="space-y-5 md:col-span-4">
            {panel === null ? (
              <>
                <header className="mb-6">
                  <h1 className="text-4xl font-black mb-2">Let’s teach something great</h1>
                  <p className="text-gray-500 text-base">
                    Manage your courses, assignments, and students in one place.
                  </p>
                </header>

                {actions.map((a, i) => (
                  <ActionRow key={i} {...a} />
                ))}

                <ProgressCard />
              </>
            ) : (
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <button
                  onClick={() => setPanel(null)}
                  className="mb-6 text-purple-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                  Back
                </button>
                <h2 className="text-3xl font-bold mb-4 capitalize">{panel}</h2>
                {renderPanelContent(panel)}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
