"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-context";

import { useEnrolledCourse } from "./_hooks/useEnrolledCourse";
import { computeProgress } from "./_utils/progress";
import DetailsSkeleton from "./_components/DetailsSkeleton";
import CourseDetailsHeader from "./_components/CourseDetailsHeader";
import NotFoundState from "./_components/NotFoundState";
import ErrorState from "../_components/ErrorState";
import CourseMeta from "./_components/CourseMeta";
import ModulesAccordion from "./_components/ModulesAccordion";


export default function UserCourseDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const courseId = params?.id;

  const { user } = useAuth();

  const { data: course, isLoading, isError, error, refetch, isFetching } =
    useEnrolledCourse(courseId, !!user);

  const progress = React.useMemo(() => {
    if (!course) return { total: 0, available: 0, percent: 0, firstLessonUrl: null as string | null };
    return computeProgress(course);
  }, [course]);

  if (isLoading) return <DetailsSkeleton />;

  if (isError) {
    return (
      <div className="space-y-4">
        <CourseDetailsHeader
          title="Course details"
          subtitle="Something went wrong."
          onBack={() => router.push("/user/courses")}
          onRefresh={() => refetch()}
          refreshing={isFetching}
          continueUrl={null}
        />
        <ErrorState
          message={error instanceof Error ? error.message : "Unknown error"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!course) {
    return (
      <NotFoundState
        onBack={() => router.push("/user/courses")}
        onGoExplore={() => router.push("/user/explore")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <CourseDetailsHeader
        title={course.courseTitle}
        subtitle={course.courseDesc || "Course details and lessons."}
        onBack={() => router.push("/user/courses")}
        onRefresh={() => refetch()}
        refreshing={isFetching}
        continueUrl={progress.firstLessonUrl}
      />

      <CourseMeta course={course} progress={progress} />

      <ModulesAccordion course={course} />
    </div>
  );
}
