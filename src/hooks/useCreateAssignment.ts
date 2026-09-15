// src/hooks/useCreateAssignment.ts
"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import { useUploadFilesToB2 } from "./useUploadFilesToB2";
import {
  Assignment,
  CreateAssignmentInput,
  GQLErrorItem,
} from "@/libs/types/assignments/assignment";
import { CREATE_ASSIGNMENT_MUTATION } from "@/graphql/mutation/assignments/createAssignment";

type UseCreateAssignmentArgs = {
  courseId: string;
  sectionId?: string;
  lessonId?: string;
  onSuccess?: (assignment: Assignment) => void;
};

type CreateAssignmentFormValues = {
  title: string;
  description?: string;
  dueDate?: string; // datetime-local string
  attachments?: File[];
};

type CreateAssignmentResponse = {
  createAssignment: Assignment;
};

const pickGraphQLError = (errors?: GQLErrorItem[]): string => {
  if (!errors?.length) return "Error creating assignment.";
  return errors[0].message || "Error creating assignment.";
};

const buildIsoDate = (value?: string): string | undefined => {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
};

export function useCreateAssignment({
  courseId,
  sectionId,
  lessonId,
  onSuccess,
}: UseCreateAssignmentArgs) {
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

  const createAssignment = React.useCallback(
    async (values: CreateAssignmentFormValues) => {
      const { title, description, dueDate, attachments } = values;

      if (!title.trim()) {
        setError("Title is required.");
        return;
      }
      if (!description?.trim()) {
        setError("Description is required.");
        return;
      }
      const isoDueDateEarly = buildIsoDate(dueDate);
      if (!isoDueDateEarly) {
        setError("Due date is required.");
        return;
      }

      setSubmitting(true);
      resetErrors();

      try {
        // 1) Upload files (if any)
        let uploadedUrls: string[] = [];
        if (attachments && attachments.length > 0) {
          uploadedUrls = await upload(attachments);
        }

        // 2) Build input
        // Backend AssignmentInput requires description and dueDate (both @IsNotEmpty()),
        // validated above before we get here.
        const input: CreateAssignmentInput = {
          title: title.trim(),
          courseId,
          description: description!.trim(),
          dueDate: isoDueDateEarly!,
        };

        if (sectionId) input.sectionId = sectionId;
        if (lessonId) input.lessonId = lessonId;
        if (uploadedUrls.length) input.attachments = uploadedUrls;

        // 3) Call GraphQL
        // IMPORTANT: gqlFetchAuth likely returns { createAssignment, errors? }
        // NOT { data: { createAssignment }, errors }
        const res = await gqlFetchAuth<CreateAssignmentResponse & { errors?: GQLErrorItem[] }>(
          CREATE_ASSIGNMENT_MUTATION,
          { input }
        );

        const errors = (res as any).errors as GQLErrorItem[] | undefined;
        if (errors?.length) {
          throw new Error(pickGraphQLError(errors));
        }

        // Support both shapes: res.data.createAssignment and res.createAssignment
        const dataPart = (res as any).data as CreateAssignmentResponse | undefined;
        const assignment =
          dataPart?.createAssignment || (res as any).createAssignment;

        if (!assignment) {
          throw new Error("Assignment was not created. Please try again.");
        }

        onSuccess?.(assignment);
        return assignment;
      } catch (err) {
        console.error("createAssignment error:", err);
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [courseId, sectionId, lessonId, onSuccess, resetErrors, upload]
  );

  return {
    createAssignment,
    loading,
    error: error ?? uploadError,
    setError,
  };
}
