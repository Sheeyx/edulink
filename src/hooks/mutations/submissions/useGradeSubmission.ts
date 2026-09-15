// src/hooks/mutations/submissions/useGradeSubmission.ts
"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { GRADE_SUBMISSION_MUTATION } from "@/graphql/mutation/submissions/submission";
import type { GradeSubmissionInput, GradeSubmissionResp, Submission } from "@/libs/types/submissions/submission";

export function useGradeSubmission(assignmentId: string) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const gradeSubmission = React.useCallback(
    async (input: GradeSubmissionInput): Promise<Submission> => {
      try {
        setLoading(true);
        setError(null);

        const res = await gqlFetchAuth<GradeSubmissionResp>(GRADE_SUBMISSION_MUTATION, { input });

        await queryClient.invalidateQueries({
          queryKey: ["assignment-submissions", assignmentId],
        });

        return res.gradeSubmission;
      } catch (err) {
        console.error("Grade submission error:", err);
        const msg = err instanceof Error ? err.message : "Failed to grade submission";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [assignmentId, queryClient]
  );

  return { gradeSubmission, loading, error, setError };
}
