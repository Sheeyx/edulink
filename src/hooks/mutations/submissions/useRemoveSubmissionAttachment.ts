// src/hooks/mutations/submissions/useRemoveSubmissionAttachment.ts
"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import { REMOVE_SUBMISSION_ATTACHMENT_MUTATION } from "@/graphql/mutation/submissions/submission";
import type { RemoveSubmissionAttachmentResp, Submission } from "@/libs/types/submissions/submission";

export function useRemoveSubmissionAttachment() {
  const [removing, setRemoving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const removeAttachment = React.useCallback(
    async (submissionId: string, attachmentUrl: string): Promise<Submission> => {
      try {
        setRemoving(true);
        setError(null);

        const input = { submissionId, attachmentUrl };
        const res = await gqlFetchAuth<RemoveSubmissionAttachmentResp>(
          REMOVE_SUBMISSION_ATTACHMENT_MUTATION,
          { input }
        );
        return res.removeSubmissionAttachment;
      } catch (err) {
        console.error("Remove submission attachment error:", err);
        const msg = err instanceof Error ? err.message : "Failed to remove attachment";
        setError(msg);
        throw err;
      } finally {
        setRemoving(false);
      }
    },
    []
  );

  return { removeAttachment, removing, error, setError };
}
