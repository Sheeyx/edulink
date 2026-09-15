// app/mentor/courses/[id]/components/Assignments/UpdateAssignmentModal.tsx
"use client";

import * as React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/Modal";
import {
  TextInput,
  Textarea,
  FileInput,
  ErrorAlert,
} from "@/components/ui/form/FormFields";
import { useUpdateAssignment } from "@/hooks/mutations/assingments/useUpdateAssignment";
import { useRemoveAssignmentAttachment } from "@/hooks/mutations/assingments/useRemoveAssignmentAttachment";

/* ----------------------------------------------------
 * Local type: Only fields needed for editing
 * (avoids missing createdAt/updatedAt issues)
 * ---------------------------------------------------- */
type AssignmentForEdit = {
  _id: string;
  title: string;
  description?: string | null;
  courseId: string;
  sectionId?: string | null;
  lessonId?: string | null;
  mentorId?: string | null;
  dueDate?: string | null;
  attachments?: string[] | null;
  status?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  assignment: AssignmentForEdit;
  courseId: string;
};

export default function UpdateAssignmentModal({
  open,
  onClose,
  assignment,
  courseId,
}: Props) {
  /* ----------------------------------------------------
   * Local State
   * ---------------------------------------------------- */
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [existingAttachments, setExistingAttachments] = React.useState<string[]>(
    []
  );
  const [newFiles, setNewFiles] = React.useState<File[]>([]);

  const titleRef = React.useRef<HTMLInputElement | null>(null);

  /* ----------------------------------------------------
   * Hooks
   * ---------------------------------------------------- */
  const {
    updateAssignment,
    loading: updateLoading,
    error: updateError,
    setError: setUpdateError,
  } = useUpdateAssignment({ courseId });

  const {
    removeAttachment,
    removing: removeLoading,
    error: removeError,
    setError: setRemoveError,
  } = useRemoveAssignmentAttachment({ courseId });

  const loading = updateLoading || removeLoading;
  const error = updateError || removeError || null;

  const labelId = "update-assignment-title";

  /* ----------------------------------------------------
   * Effect: Sync modal state when opened
   * ---------------------------------------------------- */
  React.useEffect(() => {
    if (!open) return;

    setTitle(assignment.title || "");
    setDescription(assignment.description || "");

    // Convert ISO => datetime-local
    const iso = assignment.dueDate ? new Date(assignment.dueDate) : null;
    if (iso && !isNaN(iso.getTime())) {
      setDueDate(iso.toISOString().slice(0, 16));
    } else {
      setDueDate("");
    }

    setExistingAttachments(assignment.attachments || []);
    setNewFiles([]);

    setUpdateError(null);
    setRemoveError(null);

    if (titleRef.current) titleRef.current.focus();
  }, [assignment, open, setRemoveError, setUpdateError]);

  /* ----------------------------------------------------
   * Close Modal
   * ---------------------------------------------------- */
  const handleClose = () => {
    if (loading) return;
    setUpdateError(null);
    setRemoveError(null);
    onClose();
  };

  /* ----------------------------------------------------
   * Remove Attachment
   * ---------------------------------------------------- */
  const handleRemoveAttachment = async (file: string) => {
    try {
      await removeAttachment(assignment._id, file);
      setExistingAttachments((prev) => prev.filter((f) => f !== file));
    } catch {
      // hook already set the error
    }
  };

  /* ----------------------------------------------------
   * Submit Update
   * ---------------------------------------------------- */
  const handleSubmit = async () => {
    try {
      await updateAssignment({
        assignmentId: assignment._id,
        title,
        description,
        dueDate,
        existingAttachments,
        newFiles,
      });

      onClose();
    } catch {
      // error handled inside hook
    }
  };

  const selectedNewFilesLabel =
    newFiles.length > 0 ? `${newFiles.length} new file(s) selected` : undefined;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setNewFiles(Array.from(e.target.files));
  };

  /* ----------------------------------------------------
   * Render
   * ---------------------------------------------------- */
  return (
    <Modal open={open} onClose={handleClose} labelledBy={labelId}>
      <ModalHeader title="Edit Assignment" onClose={handleClose} id={labelId} />

      <ModalBody>
        {/* Title */}
        <TextInput
          id="update-assignment-title-input"
          label="Title"
          required
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        {/* Description */}
        <Textarea
          id="update-assignment-description"
          label="Description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />

        {/* Due Date */}
        <TextInput
          id="update-assignment-due-date"
          label="Due Date"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={loading}
        />

        {/* Existing Attachments */}
        {existingAttachments.length > 0 && (
          <div className="space-y-2 mt-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Existing Attachments
            </p>

            <div className="flex flex-wrap gap-2">
              {existingAttachments.map((file) => {
                const fileName = file.split("/").pop();

                return (
                  <div
                    key={file}
                    className="group flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-700 shadow-sm"
                  >
                    <span className="max-w-[160px] truncate">{fileName}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(file)}
                      className="text-red-500 transition hover:text-red-700"
                      disabled={loading}
                      title="Remove attachment"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* New File Upload */}
        <div className="space-y-1 mt-3">
          <FileInput
            id="update-assignment-new-files"
            label="Add Attachments"
            hint="Optional"
            multiple
            onChange={handleFileChange}
            disabled={loading}
          />
          {selectedNewFilesLabel && (
            <p className="text-xs text-slate-500">{selectedNewFilesLabel}</p>
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
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
