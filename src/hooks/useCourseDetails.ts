// src/hooks/useCourseDetails.ts
"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_COURSE_FOR_MENTOR, REMOVE_RESOURCE } from "@/graphql/query/courses/courses";
import {
  CourseUI,
  CourseFromApi,
  SectionFromApi,
  SectionUI,
  ULesson,
  RemoveSectionResp,
  ResourceUI,
  RemoveResourceResp,
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
        GET_COURSE_FOR_MENTOR,
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
                lessonUrl: l.lessonUrl
              })
            ) ?? [],
        })) ?? [];

      const resources: ResourceUI[] = (api.resources ?? [])
        .filter((r) => r.resourceStatus === "ACTIVE")
        .map((r) => ({
          id: r._id,
          title: r.resourceTitle,
          type: r.resourceType,
          url: r.resourceUrl,
          size: r.resourceSize,
          isPublic: r.isPublic,
          downloadCount: r.downloadCount,
          createdAt: r.createdAt,
        }));

      const mapped: CourseUI = {
        id: api._id,
        title: api.courseTitle,
        description: api.courseDesc || "",
        status: api.courseStatus,
        modules: api.courseTotalModules ?? sections.length,
        lessons: api.courseTotalLessons ??
          sections.reduce((sum, s) => sum + (s.lessonsCount || 0), 0),
        rating: api.courseRating ?? 0,
        price: api.coursePrice,
        currency: "USD", // change to "KRW" if needed
        sections,
        resources,
        image: api.courseImage ?? null,
        enrolledMemberIds: api.courseEnrolledMembers ?? [],
      };

      console.log(api,"api");
      

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

  const removeResourceById = React.useCallback(
    async (resourceId: string) => {
      await gqlFetchAuth<RemoveResourceResp>(REMOVE_RESOURCE, { input: resourceId });

      setCourse((prev) =>
        prev
          ? {
              ...prev,
              resources: prev.resources.filter((r) => r.id !== resourceId),
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
    removeResourceById,
    error,
    removeSectionById,
    reload: fetchCourse,
  };
}
