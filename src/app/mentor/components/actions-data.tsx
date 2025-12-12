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

export function buildActions(setPanel: (p: PanelType) => void): ActionItem[] {
  return [
    {
      icon: <UserRound className="w-6 h-6 text-blue-700" />,
      title: "Edit your profile",
      desc: "Update bio, photo, and availability",
      onClick: () => setPanel("profile"),
    },
    {
      icon: <BookOpen className="w-6 h-6 text-green-700" />,
      title: "My Courses",
      desc: "Create, edit, and publish lessons",
      onClick: () => setPanel("courses"),
    },
    {
      icon: <ClipboardList className="w-6 h-6 text-orange-700" />,
      title: "Assignments",
      desc: "Post tasks, grade submissions, set deadlines",
      onClick: () => setPanel("assignments"),
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-purple-700" />,
      title: "Messages",
      desc: "Answer student questions & feedback",
      onClick: () => setPanel("messages"),
    },
    {
      icon: <DollarSign className="w-6 h-6 text-yellow-700" />,
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
