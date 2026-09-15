// src/hooks/mutations/submissions/useUpdateSubmission.ts
"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import { useUploadFilesToB2 } from "@/hooks/useUploadFilesToB2";
import { UPDATE_SUBMISSION_MUTATION } from "@/graphql/mutation/submissions/submission";
import type { UpdateSubmissionResp, Submission } from "@/libs/types/submissions/submission";

export type UpdateSubmissionValues = {
  _id: string;
  answer: string;
  newFiles: File[];
};

export function useUpdateSubmission() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { upload, uploading, uploadError, setUploadError } = useUploadFilesToB2({
    folder: "submission",
  });

  const updateSubmission = React.useCallback(
    async (values: UpdateSubmissionValues): Promise<Submission> => {
      const { _id, answer, newFiles } = values;

      try {
        setLoading(true);
        setError(null);
        setUploadError(null);

        const attachments = newFiles.length > 0 ? await upload(newFiles) : [];

        const input = {
          _id,
          answer: answer.trim(),
          attachments: attachments.length ? attachments : undefined,
        };

        const res = await gqlFetchAuth<UpdateSubmissionResp>(UPDATE_SUBMISSION_MUTATION, { input });
        return res.updateSubmission;
      } catch (err) {
        console.error("Update submission error:", err);
        const msg = err instanceof Error ? err.message : "Failed to update submission";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [upload, setUploadError]
  );

  return {
    updateSubmission,
    loading: loading || uploading,
    error: error ?? uploadError,
    setError,
  };
}
