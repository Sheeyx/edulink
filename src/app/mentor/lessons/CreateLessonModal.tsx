// app/mentor/courses/[id]/components/Lessons/CreateLessonModal.tsx
"use client";

import * as React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/Modal";
import {
  TextInput,
  FileInput,
  ErrorAlert,
} from "@/components/ui/form/FormFields";
import { useCreateLesson } from "@/hooks/mutations/lessons/useCreateLesson";

type Props = {
  open: boolean;
  onClose: () => void;
  sectionId: string;
  onSuccess?: () => void;
};

export default function CreateLessonModal({
  open,
  onClose,
  sectionId,
  onSuccess,
}: Props) {
  const [lessonTitle, setLessonTitle] = React.useState("");
  const [lessonContentType, setLessonContentType] =
    React.useState<"TEXT" | "VIDEO" | "AUDIO">("TEXT");
  const [lessonDuration, setLessonDuration] = React.useState("");
  const [lessonUrl, setLessonUrl] = React.useState(""); // used for TEXT / AUDIO
  const [videoFile, setVideoFile] = React.useState<File | null>(null);

  const {
    createLesson,
    loading,
    error,
    setError,
  } = useCreateLesson();

  const labelId = "create-lesson-title";

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      await createLesson({
        sectionId,
        lessonTitle,
        lessonContentType,
        lessonDuration: Number(lessonDuration),
        lessonUrl,
        videoFile,
      });

      onSuccess?.();
      onClose();
    } catch {
      // error handled inside hook
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setVideoFile(e.target.files[0]);
  };

  const resetModal = () => {
    if (loading) return;
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={resetModal} labelledBy={labelId}>
      <ModalHeader id={labelId} title="Create Lesson" onClose={resetModal} />

      <ModalBody>
        {/* Lesson Title */}
        <TextInput
          id="lesson-title"
          label="Lesson Title"
          required
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          disabled={loading}
        />

        {/* Content Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Content Type
          </label>
          <select
            value={lessonContentType}
            onChange={(e) =>
              setLessonContentType(e.target.value as "TEXT" | "VIDEO" | "AUDIO")
            }
            disabled={loading}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
          >
            <option value="TEXT">TEXT</option>
            <option value="VIDEO">VIDEO</option>
            <option value="AUDIO">AUDIO</option>
          </select>
        </div>

        {/* Duration */}
        <TextInput
          id="lesson-duration"
          label="Duration (minutes)"
          type="number"
          value={lessonDuration}
          onChange={(e) => setLessonDuration(e.target.value)}
          disabled={loading}
        />

        {/* Conditional Input: VIDEO upload */}
        {lessonContentType === "VIDEO" && (
          <div className="space-y-1">
            <FileInput
              id="lesson-video"
              label="Upload Video"
              required
              accept="video/*"
              onChange={handleFileUpload}
              disabled={loading}
            />
            {videoFile && (
              <p className="text-xs text-slate-500">{videoFile.name}</p>
            )}
          </div>
        )}

        {/* Conditional Input: TEXT or AUDIO URL */}
        {(lessonContentType === "TEXT" ||
          lessonContentType === "AUDIO") && (
          <TextInput
            id="lesson-url"
            label="Lesson URL"
            placeholder="https://example.com/lesson"
            value={lessonUrl}
            onChange={(e) => setLessonUrl(e.target.value)}
            disabled={loading}
          />
        )}

        <ErrorAlert message={error} />
      </ModalBody>

      <ModalFooter>
        <button
          onClick={resetModal}
          className="px-4 py-2 rounded-xl font-semibold text-gray-600 hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-xl bg-brand-selected font-semibold text-white hover:brightness-90 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Lesson"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
