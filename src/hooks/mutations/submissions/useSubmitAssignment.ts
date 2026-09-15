// src/hooks/mutations/submissions/useSubmitAssignment.ts
"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import { useUploadFilesToB2 } from "@/hooks/useUploadFilesToB2";
import { SUBMIT_ASSIGNMENT_MUTATION } from "@/graphql/mutation/submissions/submission";
import type { SubmitAssignmentResp, Submission } from "@/libs/types/submissions/submission";

export type SubmitAssignmentValues = {
  assignmentId: string;
  answer: string;
  files: File[];
};

export function useSubmitAssignment() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { upload, uploading, uploadError, setUploadError } = useUploadFilesToB2({
    folder: "submission",
  });

  const submitAssignment = React.useCallback(
    async (values: SubmitAssignmentValues): Promise<Submission> => {
      const { assignmentId, answer, files } = values;

      try {
        setLoading(true);
        setError(null);
        setUploadError(null);

        const attachments = files.length > 0 ? await upload(files) : [];

        const input = {
          assignmentId,
          answer: answer.trim(),
          attachments: attachments.length ? attachments : undefined,
        };

        const res = await gqlFetchAuth<SubmitAssignmentResp>(SUBMIT_ASSIGNMENT_MUTATION, { input });
        return res.submitAssignment;
      } catch (err) {
        console.error("Submit assignment error:", err);
        const msg = err instanceof Error ? err.message : "Failed to submit assignment";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [upload, setUploadError]
  );

  return {
    submitAssignment,
    loading: loading || uploading,
    error: error ?? uploadError,
    setError,
  };
}
