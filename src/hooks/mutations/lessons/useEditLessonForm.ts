// src/app/mentor/lessons/edit/useEditLessonForm.ts
"use client";

import { EditLessonFormValues, EditLessonModalProps } from "@/libs/types/lessons/types";
import * as React from "react";

type Args = Pick<
  EditLessonModalProps,
  "open" | "initialTitle" | "initialContentType" | "initialDuration" | "onSave"
>;

export function useEditLessonForm({
  open,
  initialTitle,
  initialContentType = "TEXT",
  initialDuration = "",
  onSave,
}: Args) {
  const [values, setValues] = React.useState<EditLessonFormValues>({
    title: initialTitle,
    contentType: initialContentType,
    duration: String(initialDuration ?? ""),
    removeVideo: false,
    newVideoFile: null,
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;

    setValues({
      title: initialTitle,
      contentType: initialContentType,
      duration: String(initialDuration ?? ""),
      removeVideo: false,
      newVideoFile: null,
    });

    setError(null);
    setLoading(false);
  }, [open, initialTitle, initialContentType, initialDuration]);

  const updateField = React.useCallback(
    <K extends keyof EditLessonFormValues>(field: K, value: EditLessonFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const validate = React.useCallback((): string | null => {
    if (!values.title.trim()) return "Lesson title is required.";

    const d = values.duration.trim();
    if (!d || Number(d) <= 0) return "Duration must be a positive number.";

    // video validation: optional, but if selected must be video file
    if (values.newVideoFile && !values.newVideoFile.type.startsWith("video/")) {
      return "Please select a valid video file.";
    }

    return null;
  }, [values.title, values.duration, values.newVideoFile]);

  const handleSubmit = React.useCallback(
    async (onSuccess?: () => void) => {
      const v = validate();
      if (v) {
        setError(v);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        await onSave({
          title: values.title.trim(),
          contentType: values.contentType,
          duration: values.duration.trim(),
          removeVideo: !!values.removeVideo,
          newVideoFile: values.newVideoFile ?? null,
        });

        onSuccess?.();
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to save lesson.");
      } finally {
        setLoading(false);
      }
    },
    [onSave, validate, values]
  );

  return { values, loading, error, setError, updateField, handleSubmit };
}
