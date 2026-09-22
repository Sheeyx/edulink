"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";

import type {
  EnrolledCourse,
  GetMyEnrolledCoursesResp,
} from "../_types/courses.types";
import { GET_MY_ENROLLED_COURSES } from "@/graphql/query/courses/courses";

export function useEnrolledCourses(enabled: boolean) {
  return useQuery({
    queryKey: ["user", "enrolledCourses"],
    queryFn: async (): Promise<EnrolledCourse[]> => {
      const res = await gqlFetchAuth<GetMyEnrolledCoursesResp>(GET_MY_ENROLLED_COURSES, {});
      return res.getMyEnrolledCourses || [];
    },
    enabled,
    staleTime: 30_000,
  });
}
