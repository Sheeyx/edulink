// src/hooks/useAssignmentSubmissions.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_SUBMISSIONS } from "@/graphql/query/submissions/submissions";
import type { GetSubmissionsResp, Submission } from "@/libs/types/submissions/submission";

export function useAssignmentSubmissions(assignmentId: string | null) {
  return useQuery({
    queryKey: ["assignment-submissions", assignmentId],
    queryFn: async (): Promise<Submission[]> => {
      const res = await gqlFetchAuth<GetSubmissionsResp>(GET_SUBMISSIONS, {
        input: {
          page: 1,
          limit: 100,
          search: { assignmentId },
        },
      });
      return res.getSubmissions?.list ?? [];
    },
    enabled: !!assignmentId,
  });
}
