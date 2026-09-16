// src/hooks/useCourseAssignmentsList.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_ASSIGNMENTS_BY_COURSE } from "@/graphql/query/assignments/assignments";
import type { Assignment, GetAssignmentsByCourseResp } from "@/libs/types/assignments/assignment";

// Single source of truth for a course's assignment list. Shared by the
// Sections tab (grouped per section) and the Assignments tab (flat list) —
// both must use this exact query key ("course-assignments", courseId) since
// useUpdateAssignment/useRemoveAssignmentAttachment invalidate it by name.
export function useCourseAssignmentsList(courseId: string) {
  return useQuery({
    queryKey: ["course-assignments", courseId],
    queryFn: async (): Promise<Assignment[]> => {
      const res = await gqlFetchAuth<GetAssignmentsByCourseResp>(GET_ASSIGNMENTS_BY_COURSE, {
        courseId,
      });
      return res.getAssignmentsByCourse?.list ?? [];
    },
    enabled: !!courseId,
  });
}
