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
  Textarea,
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
        <div className="space-y-1">
          <label className="text-xs font-medium uppercase text-slate-500">
            Content Type
          </label>
          <select
            value={lessonContentType}
            onChange={(e) =>
              setLessonContentType(e.target.value as any)
            }
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
          className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
          disabled={loading}
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Lesson"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
