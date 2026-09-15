// src/app/mentor/components/actions-data.tsx
"use client";

import React from "react";
import { UserRound, BookOpen, ClipboardList, MessageSquare, DollarSign, PlusCircle } from "lucide-react";
import type { PanelType } from "@/app/mentor/MentorDashboardClient";

export type ActionItem = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
};
export type TileItem = {
  iconTint: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
};

function ActionIcon({
  bg,
  fg,
  children,
}: {
  bg: string;
  fg: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid place-items-center rounded-2xl w-14 h-14 shrink-0 ${bg} ${fg}`}
    >
      {children}
    </div>
  );
}

export function buildActions(setPanel: (p: PanelType) => void): ActionItem[] {
  return [
    {
      icon: (
        <ActionIcon bg="bg-blue-50" fg="text-blue-700">
          <UserRound className="w-6 h-6" />
        </ActionIcon>
      ),
      title: "Edit your profile",
      desc: "Update bio, photo, and availability",
      onClick: () => setPanel("profile"),
    },
    {
      icon: (
        <ActionIcon bg="bg-emerald-50" fg="text-emerald-700">
          <BookOpen className="w-6 h-6" />
        </ActionIcon>
      ),
      title: "My Courses",
      desc: "Create, edit, and publish lessons",
      onClick: () => setPanel("courses"),
    },
    {
      icon: (
        <ActionIcon bg="bg-orange-50" fg="text-orange-700">
          <ClipboardList className="w-6 h-6" />
        </ActionIcon>
      ),
      title: "Assignments",
      desc: "Post tasks, grade submissions, set deadlines",
      onClick: () => setPanel("assignments"),
    },
    {
      icon: (
        <ActionIcon bg="bg-purple-50" fg="text-purple-700">
          <MessageSquare className="w-6 h-6" />
        </ActionIcon>
      ),
      title: "Messages",
      desc: "Answer student questions & feedback",
      onClick: () => setPanel("messages"),
    },
    {
      icon: (
        <ActionIcon bg="bg-amber-50" fg="text-amber-700">
          <DollarSign className="w-6 h-6" />
        </ActionIcon>
      ),
      title: "Earnings",
      desc: "Track payouts & revenue",
      onClick: () => setPanel("earnings"),
    },
  ];
}

export function buildTiles(setPanel: (p: PanelType) => void): TileItem[] {
  return [
    {
      iconTint: "text-green-600",
      icon: <PlusCircle className="w-6 h-6" />,
      title: "Create a Course",
      desc: "Start a new module",
      onClick: () => setPanel("create-course"),
    },
    {
      iconTint: "text-blue-600",
      icon: <BookOpen className="w-6 h-6" />,
      title: "My Courses",
      desc: "View and manage your courses",
      onClick: () => setPanel("courses"),
    },
    {
      iconTint: "text-yellow-600",
      icon: <DollarSign className="w-6 h-6" />,
      title: "Earnings",
      desc: "Payouts & reports",
      onClick: () => setPanel("earnings"),
    },
  ];
}
