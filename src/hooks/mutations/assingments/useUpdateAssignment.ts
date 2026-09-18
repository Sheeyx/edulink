// src/hooks/mutations/useUpdateAssignment.ts
"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { useUploadFilesToB2 } from "@/hooks/useUploadFilesToB2";
import { UPDATE_ASSIGNMENT_MUTATION } from "@/graphql/mutation/assignments/updateAssignment";
import type { Assignment } from "@/libs/types/assignments/assignment";

type UseUpdateAssignmentArgs = {
  courseId: string;
};

export type UpdateAssignmentFormValues = {
  assignmentId: string;
  title?: string;
  description?: string;
  dueDate?: string; // datetime-local string
  existingAttachments: string[];
  newFiles: File[];
};

const buildIsoDate = (value?: string): string | undefined => {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
};

export function useUpdateAssignment({ courseId }: UseUpdateAssignmentArgs) {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { upload, uploading, uploadError, setUploadError } = useUploadFilesToB2({
    folder: "assignment",
  });

  const loading = submitting || uploading;

  const resetErrors = React.useCallback(() => {
    setError(null);
    setUploadError(null);
  }, [setUploadError]);

  const updateAssignment = React.useCallback(
    async (values: UpdateAssignmentFormValues): Promise<Assignment | void> => {
      const {
        assignmentId,
        title,
        description,
        dueDate,
        existingAttachments,
        newFiles,
      } = values;

      resetErrors();
      setSubmitting(true);

      try {
        // 1) upload new files (if any)
        let uploadedUrls: string[] = [];
        if (newFiles.length > 0) {
          uploadedUrls = await upload(newFiles);
        }

        // 2) merge attachments
        const finalAttachments = [...existingAttachments, ...uploadedUrls];

        // 3) build input
        const input: {
          _id: string;
          title?: string;
          description?: string;
          dueDate?: string;
          attachments?: string[];
        } = { _id: assignmentId };

        if (title?.trim()) input.title = title.trim();
        if (description?.trim()) input.description = description.trim();

        const isoDueDate = buildIsoDate(dueDate);
        if (isoDueDate) input.dueDate = isoDueDate;

        if (finalAttachments.length) input.attachments = finalAttachments;

        // 4) call GraphQL
        const res = await gqlFetchAuth<{ updateAssignment: Assignment }>(
          UPDATE_ASSIGNMENT_MUTATION,
          { input }
        );

        const assignment = res.updateAssignment;

        // 5) invalidate cache
        await queryClient.invalidateQueries({
          queryKey: ["course-assignments", courseId],
        });

        return assignment;
      } catch (err) {
        console.error("updateAssignment error:", err);
        const message =
          err instanceof Error ? err.message : "Failed to update assignment.";
        setError(message);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [courseId, queryClient, resetErrors, upload]
  );

  return {
    updateAssignment,
    loading,
    error: error ?? uploadError,
    setError,
  };
}
