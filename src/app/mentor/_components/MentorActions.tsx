// src/app/mentor/components/MentorActions.tsx
"use client";

import React from "react";
import ActionCard from "./ActionCard";
import {
  UserRound,
  BookOpen,
  ClipboardList,
  MessageSquare,
  DollarSign,
} from "lucide-react";

type Props = {
  onEditProfile: () => void;
  onOpenCourses: () => void;
  onOpenAssignments: () => void;
  onOpenMessages: () => void;
  onOpenEarnings: () => void;
};

const IconWrap = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => (
  <div
    className={`grid place-items-center h-10 w-10 rounded-xl border-2 ${className}`}
  >
    {children}
  </div>
);

export default function MentorActions({
  onEditProfile,
  onOpenCourses,
  onOpenAssignments,
  onOpenMessages,
  onOpenEarnings,
}: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <ActionCard
        icon={
          <IconWrap className="border-blue-500/70 text-blue-600">
            <UserRound className="h-6 w-6" />
          </IconWrap>
        }
        title="Edit your profile"
        subtitle="Update bio, photo, and availability"
        onClick={onEditProfile}
      />

      <ActionCard
        icon={
          <IconWrap className="border-green-600/70 text-green-600">
            <BookOpen className="h-6 w-6" />
          </IconWrap>
        }
        title="My Courses"
        subtitle="Create, edit, and publish lessons"
        onClick={onOpenCourses}
      />

      <ActionCard
        icon={
          <IconWrap className="border-orange-600/70 text-orange-600">
            <ClipboardList className="h-6 w-6" />
          </IconWrap>
        }
        title="Assignments"
        subtitle="Post tasks, grade submissions, set deadlines"
        onClick={onOpenAssignments}
      />

      <ActionCard
        icon={
          <IconWrap className="border-brand-primary/70 text-brand-primary">
            <MessageSquare className="h-6 w-6" />
          </IconWrap>
        }
        title="Messages"
        subtitle="Answer student questions & feedback"
        onClick={onOpenMessages}
      />

      <ActionCard
        icon={
          <IconWrap className="border-yellow-600/70 text-yellow-600">
            <DollarSign className="h-6 w-6" />
          </IconWrap>
        }
        title="Earnings"
        subtitle="Track payouts & revenue"
        onClick={onOpenEarnings}
      />
    </div>
  );
}
