// src/hooks/mutations/useRemoveAssignmentAttachment.ts
"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { REMOVE_ASSIGNMENT_ATTACHMENT_MUTATION } from "@/graphql/mutation/assignments/removeAssignmentAttachment";

type UseRemoveAssignmentAttachmentArgs = {
  courseId: string;
};

export function useRemoveAssignmentAttachment({
  courseId,
}: UseRemoveAssignmentAttachmentArgs) {
  const queryClient = useQueryClient();
  const [removing, setRemoving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const removeAttachment = React.useCallback(
    async (assignmentId: string, attachmentUrl: string) => {
      setRemoving(true);
      setError(null);

      try {
        const input = { assignmentId, attachmentUrl };
        await gqlFetchAuth(REMOVE_ASSIGNMENT_ATTACHMENT_MUTATION, { input });

        await queryClient.invalidateQueries({
          queryKey: ["course-assignments", courseId],
        });
      } catch (err) {
        console.error("removeAttachment error:", err);
        const message =
          err instanceof Error ? err.message : "Failed to remove attachment.";
        setError(message);
        throw err;
      } finally {
        setRemoving(false);
      }
    },
    [courseId, queryClient]
  );

  return {
    removeAttachment,
    removing,
    error,
    setError,
  };
}
