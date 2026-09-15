"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-context";

import { useEnrolledCourses } from "../courses/_hooks/useEnrolledCourses";
import { useMyAssignments } from "./_hooks/useMyAssignments";

import AssignmentsHeader from "./_components/AssignmentsHeader";
import AssignmentCard from "./_components/AssignmentCard";
import EmptyAssignments from "./_components/EmptyAssignments";
import SubmitAssignmentModal from "./_components/SubmitAssignmentModal";
import ErrorState from "../courses/_components/ErrorState";

import type { AssignmentWithContext } from "./_types/assignments.types";

export default function UserAssignmentsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: courses = [], isLoading: coursesLoading } = useEnrolledCourses(!!user);

  const {
    data: assignments = [],
    isLoading: assignmentsLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyAssignments(courses, !coursesLoading);

  const [submittingItem, setSubmittingItem] = React.useState<AssignmentWithContext | null>(
    null
  );

  const isLoading = coursesLoading || (courses.length > 0 && assignmentsLoading);

  return (
    <div className="space-y-6">
      <AssignmentsHeader
        onBack={() => router.push("/user")}
        onRefresh={() => refetch()}
        refreshing={isFetching}
      />

      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : "Unknown error"}
          onRetry={() => refetch()}
        />
      )}

      {isLoading && (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      )}

      {!isLoading && !isError && assignments.length === 0 && <EmptyAssignments />}

      {!isLoading && !isError && assignments.length > 0 && (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {assignments.map((item) => (
            <AssignmentCard
              key={item.assignment._id}
              item={item}
              onSubmit={setSubmittingItem}
            />
          ))}
        </div>
      )}

      <SubmitAssignmentModal
        open={!!submittingItem}
        onClose={() => setSubmittingItem(null)}
        item={submittingItem}
        onSuccess={() => {
          setSubmittingItem(null);
          refetch();
        }}
      />
    </div>
  );
}
