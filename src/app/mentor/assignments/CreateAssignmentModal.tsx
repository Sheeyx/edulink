"use client";

import * as React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { TextInput, Textarea, FileInput, ErrorAlert } from "@/components/ui/form/FormFields";
import { useCreateAssignment } from "@/hooks/useCreateAssignment";

type Props = {
  open: boolean;
  onClose: () => void;
  courseId: string;
  sectionId?: string;
  lessonId?: string;
  onSuccess?: () => void;
};

export default function CreateAssignmentModal({
  open,
  onClose,
  courseId,
  sectionId,
  lessonId,
  onSuccess,
}: Props) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [attachments, setAttachments] = React.useState<File[]>([]);

  const titleRef = React.useRef<HTMLInputElement | null>(null);

  const { createAssignment, loading, error, setError } = useCreateAssignment({
    courseId,
    sectionId,
    lessonId,
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setDueDate("");
      setAttachments([]);
      onSuccess?.();
      onClose();
    },
  });

  // Autofocus title when modal opens
  React.useEffect(() => {
    if (open && titleRef.current) {
      titleRef.current.focus();
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setAttachments(Array.from(e.target.files));
  };

  const handleClose = () => {
    if (loading) return;
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      await createAssignment({
        title,
        description,
        dueDate,
        attachments,
      });
    } catch {
      // error already handled inside hook
    }
  };

  const selectedFilesLabel =
    attachments.length > 0
      ? `${attachments.length} file(s) selected`
      : undefined;

  const labelId = "create-assignment-title";

  return (
    <Modal open={open} onClose={handleClose} labelledBy={labelId}>
      <ModalHeader title="Create Assignment" onClose={handleClose} id={labelId} />

      <ModalBody>
        <TextInput
          id="assignment-title"
          label="Title"
          required
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter assignment title"
          disabled={loading}
        />

        <Textarea
          id="assignment-description"
          label="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Enter assignment description"
          disabled={loading}
        />

        <TextInput
          id="assignment-due-date"
          label="Due Date"
          required
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={loading}
        />

        <div className="space-y-1">
          <FileInput
            id="assignment-attachments"
            label="Attachments"
            hint="Optional"
            multiple
            onChange={handleFileChange}
            disabled={loading}
          />
          {selectedFilesLabel && (
            <p className="text-xs text-slate-500">{selectedFilesLabel}</p>
          )}
        </div>

        <ErrorAlert message={error} />
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-60"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Assignment"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
