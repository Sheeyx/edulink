// app/mentor/courses/hooks/useCourseDetails.ts

"use client";

import * as React from "react";
import { fetchCourseById, fetchSectionsByCourseId, deleteSectionById } from "../libs/courses/courseApi";
import { mapToCourseUI } from "../libs/courses/courseMapper";
import { CourseUI } from "@/libs/types/course/types";

type UseCourseDetailsState = {
  course: CourseUI | null;
  loading: boolean;
  error: string | null;
};

type UseCourseDetailsActions = {
  reload: () => Promise<void>;
  removeSectionById: (sectionId: string) => Promise<void>;
};

export function useCourseDetails(courseId: string): UseCourseDetailsState & UseCourseDetailsActions {
  const [course, setCourse] = React.useState<CourseUI | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);

    try {
      const [courseApi, sectionsApi] = await Promise.all([
        fetchCourseById(courseId),
        fetchSectionsByCourseId(courseId),
      ]);

      const mapped = mapToCourseUI(courseApi, sectionsApi);
      setCourse(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load course.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const removeSectionById = React.useCallback(
    async (sectionId: string) => {
      if (!course) return;
      await deleteSectionById(sectionId);
      await load();
    },
    [course, load]
  );

  return {
    course,
    loading,
    error,
    reload: load,
    removeSectionById,
  };
}
