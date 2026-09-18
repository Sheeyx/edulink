"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import { useUploadFilesToB2 } from "@/hooks/useUploadFilesToB2";
import { CREATE_LESSON_MUTATION } from "@/graphql/mutation/lessons/createLesson";

export type CreateLessonValues = {
  sectionId: string;
  lessonTitle: string;
  lessonContentType: "TEXT" | "VIDEO" | "AUDIO";
  lessonDuration?: number;
  videoFile?: File | null; // 👈 new
  lessonUrl?: string;
};

type CreateLessonPayload = {
  _id: string;
  sectionId: string;
  lessonTitle: string;
  lessonContentType: string;
  lessonDuration?: number | null;
  lessonUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type CreateLessonResp = {
  createLesson?: CreateLessonPayload;
  data?: { createLesson?: CreateLessonPayload };
};

export function useCreateLesson() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { upload, uploading, uploadError, setUploadError } =
    useUploadFilesToB2({
      folder: "lesson/video", // 👈 videos go here
    });

  const isLoading = loading || uploading;

  const createLesson = React.useCallback(
    async (values: CreateLessonValues) => {
      const {
        sectionId,
        lessonTitle,
        lessonContentType,
        lessonDuration,
        videoFile,
        lessonUrl,
      } = values;

      try {
        setLoading(true);
        setError(null);
        setUploadError(null);

        let finalLessonUrl = lessonUrl || "";

        // If VIDEO type → upload file
        if (lessonContentType === "VIDEO" && videoFile) {
          const [uploadedUrl] = await upload([videoFile]);
          finalLessonUrl = uploadedUrl;
        }

        const input = {
          sectionId,
          lessonTitle: lessonTitle.trim(),
          lessonContentType,
          lessonDuration: lessonDuration ? Number(lessonDuration) : 0,
          lessonUrl: finalLessonUrl,
        };

        const res = await gqlFetchAuth<CreateLessonResp>(CREATE_LESSON_MUTATION, { input });

        return res.createLesson || res.data?.createLesson;
      } catch (err) {
        console.error("Create lesson error:", err);
        const msg = err instanceof Error ? err.message : "Failed to create lesson";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [upload, setUploadError]
  );

  return {
    createLesson,
    loading: isLoading,
    error: error ?? uploadError,
    setError,
  };
}
