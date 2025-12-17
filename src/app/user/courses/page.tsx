"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-context";

import { useEnrolledCourses } from "./_hooks/useEnrolledCourses";

import CoursesHeader from "./_components/CoursesHeader";
import CourseCard from "./_components/CourseCard";
import SkeletonCard from "./_components/SkeletonCard";
import EmptyState from "./_components/EmptyState";
import ErrorState from "./_components/ErrorState";

export default function UserCoursesPage() {
  const router = useRouter();
  const { user } = useAuth();

  const { data, isLoading, isError, error, refetch, isFetching } =
    useEnrolledCourses(!!user);

  const courses = data || [];

  return (
    <div className="space-y-6">
      <CoursesHeader
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
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!isLoading && !isError && courses.length === 0 && <EmptyState />}

      {!isLoading && !isError && courses.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c._id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
