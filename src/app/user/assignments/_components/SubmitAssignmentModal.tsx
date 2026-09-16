"use client";

import * as React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/Modal";
import { Textarea, FileInput, ErrorAlert } from "@/components/ui/form/FormFields";
import { useSubmitAssignment } from "@/hooks/mutations/submissions/useSubmitAssignment";
import { useUpdateSubmission } from "@/hooks/mutations/submissions/useUpdateSubmission";
import { useRemoveSubmissionAttachment } from "@/hooks/mutations/submissions/useRemoveSubmissionAttachment";
import type { AssignmentWithContext } from "../_types/assignments.types";

type Props = {
  open: boolean;
  onClose: () => void;
  item: AssignmentWithContext | null;
  onSuccess?: () => void;
};

export default function SubmitAssignmentModal({ open, onClose, item, onSuccess }: Props) {
  const [answer, setAnswer] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = React.useState<string[]>([]);

  const { submitAssignment, loading: submitLoading, error: submitError, setError: setSubmitError } =
    useSubmitAssignment();
  const { updateSubmission, loading: updateLoading, error: updateError, setError: setUpdateError } =
    useUpdateSubmission();
  const { removeAttachment, removing, error: removeError, setError: setRemoveError } =
    useRemoveSubmissionAttachment();

  const loading = submitLoading || updateLoading || removing;
  const error = submitError || updateError || removeError;

  const labelId = "submit-assignment-title";
  const isEditing = !!item?.submission;

  React.useEffect(() => {
    if (!item) return;
    setAnswer(item.submission?.answer || "");
    setExistingAttachments(item.submission?.attachments || []);
    setFiles([]);
    setSubmitError(null);
    setUpdateError(null);
    setRemoveError(null);
  }, [item, setSubmitError, setUpdateError, setRemoveError]);

  if (!open || !item) return null;

  const resetAndClose = () => {
    if (loading) return;
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleRemoveExisting = async (url: string) => {
    if (!item.submission) return;
    try {
      await removeAttachment(item.submission._id, url);
      setExistingAttachments((prev) => prev.filter((a) => a !== url));
    } catch {
      // error handled inside hook
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setSubmitError("Please write an answer before submitting.");
      return;
    }

    try {
      if (isEditing && item.submission) {
        await updateSubmission({
          _id: item.submission._id,
          answer,
          newFiles: files,
        });
      } else {
        await submitAssignment({
          assignmentId: item.assignment._id,
          answer,
          files,
        });
      }
      onSuccess?.();
      resetAndClose();
    } catch {
      // error handled inside hooks
    }
  };

  return (
    <Modal open={open} onClose={resetAndClose} labelledBy={labelId}>
      <ModalHeader
        id={labelId}
        title={isEditing ? "Edit Submission" : "Submit Assignment"}
        onClose={resetAndClose}
      />

      <ModalBody>
        <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <p className="font-semibold">{item.assignment.title}</p>
          <p className="text-xs text-slate-500">{item.courseTitle}</p>
        </div>

        <Textarea
          id="submission-answer"
          label="Your Answer"
          required
          rows={5}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your response here..."
          disabled={loading}
        />

        {existingAttachments.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Attached Files
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
                      onClick={() => handleRemoveExisting(file)}
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

        <div className="space-y-1">
          <FileInput
            id="submission-files"
            label={isEditing ? "Add More Files" : "Attachments"}
            hint="Optional"
            multiple
            onChange={handleFileChange}
            disabled={loading}
          />
          {files.length > 0 && (
            <p className="text-xs text-slate-500">{files.length} file(s) selected</p>
          )}
        </div>

        <ErrorAlert message={error} />
      </ModalBody>

      <ModalFooter>
        <button
          onClick={resetAndClose}
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
          {loading ? "Saving..." : isEditing ? "Save Changes" : "Submit"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
