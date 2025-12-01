// src/hooks/useCourseDetails.ts
"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_COURSE } from "@/graphql/query/courses/courses";
import {
  CourseUI,
  CourseFromApi,
  SectionFromApi,
  SectionUI,
  ULesson,
  RemoveSectionResp,
} from "@/libs/types/course/types";

const REMOVE_SECTION = `
  mutation RemoveSection($input: String!) {
    removeSection(sectionId: $input) {
      _id
    }
  }
`;

export function useCourseDetails(courseId: string) {
  const [course, setCourse] = React.useState<CourseUI | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCourse = React.useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);

      const resp = await gqlFetchAuth<{ getCourse: CourseFromApi }>(
        GET_COURSE,
        { input: courseId }
      );

      const api = resp.getCourse;
      if (!api) {
        setCourse(null);
        setError("Course not found.");
        return;
      }

      const sections: SectionUI[] =
        api.sectionsWithLessons?.map((sec: SectionFromApi) => ({
          id: sec._id,
          title: sec.moduleTitle,
          order: sec.moduleOrder,
          lessonsCount: sec.totalLessons,
          status: sec.sectionStatus || "ACTIVE",
          lessons:
            sec.lessons?.map(
              (l): ULesson => ({
                id: l._id, // map _id -> id
                title: l.lessonTitle || "",
                duration: l.lessonDuration,
                contentType: l.lessonContentType,
              })
            ) ?? [],
        })) ?? [];

      const mapped: CourseUI = {
        id: api._id,
        title: api.courseTitle,
        description: api.courseDesc || "",
        status: api.courseStatus,
        modules: api.courseTotalModules ?? sections.length,
        lessons:
          api.courseTotalLessons ??
          sections.reduce((sum, s) => sum + (s.lessonsCount || 0), 0),
        rating: api.courseRating ?? 0,
        price: api.coursePrice,
        currency: "USD",
        image: null,
        sections,
      };

      setCourse(mapped);
    } catch (err: any) {
      console.error("[useCourseDetails] error:", err);
      setError(err?.message || "Failed to fetch course.");
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const removeSectionById = React.useCallback(
    async (sectionId: string) => {
      await gqlFetchAuth<RemoveSectionResp>(REMOVE_SECTION, { input: sectionId });

      setCourse((prev) =>
        prev
          ? {
              ...prev,
              sections: prev.sections.filter((s) => s.id !== sectionId),
              modules: prev.modules - 1,
            }
          : prev
      );
    },
    []
  );

  React.useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return {
    course,
    loading,
    error,
    removeSectionById,
    reload: fetchCourse,
  };
}
