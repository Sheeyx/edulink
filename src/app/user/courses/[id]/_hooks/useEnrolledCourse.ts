"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";

import type { GetMyEnrolledCourseResp, EnrolledCourseDetails } from "../_types/courseDetails.types";
import { GET_MY_ENROLLED_COURSE } from "@/graphql/query/courses/courses";

export function useEnrolledCourse(courseId?: string, enabled?: boolean) {
  return useQuery({
    queryKey: ["user", "enrolledCourse", courseId],
    queryFn: async (): Promise<EnrolledCourseDetails | null> => {
      if (!courseId) return null;
      const res = await gqlFetchAuth<GetMyEnrolledCourseResp>(GET_MY_ENROLLED_COURSE, {
        input: courseId,
      });
      return res.getMyEnrolledCourse ?? null;
    },
    enabled: !!enabled && !!courseId,
    staleTime: 30_000,
  });
}
