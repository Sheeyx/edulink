// src/app/mentor/lessons/EditLessonModal.tsx
"use client";

import { useEditLessonForm } from "@/hooks/mutations/lessons/useEditLessonForm";
import { EditLessonModalProps } from "@/libs/types/lessons/types";
import * as React from "react";
import { EditLessonDialog } from "./EditLessonDialog";

export default function EditLessonModal(props: EditLessonModalProps) {
  const {
    open,
    onClose,
    onSave,
    initialTitle,
    initialContentType,
    initialDuration,
    initialVideoUrl,
  } = props;

  const { values, loading, error, updateField, handleSubmit, setError } =
    useEditLessonForm({
      open,
      initialTitle,
      initialContentType,
      initialDuration,
      onSave,
    });

  const handleClose = () => {
    if (loading) return;
    setError(null);
    onClose();
  };

  const submit = () => {
    void handleSubmit(onClose);
  };

  return (
    <EditLessonDialog
      open={open}
      onClose={handleClose}
      loading={loading}
      error={error}
      values={values}
      onChange={updateField}
      onSubmit={submit}
      initialVideoUrl={initialVideoUrl}
    />
  );
}
