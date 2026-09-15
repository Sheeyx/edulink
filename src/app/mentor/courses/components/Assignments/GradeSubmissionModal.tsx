"use client";

import * as React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/Modal";
import { Textarea, ErrorAlert } from "@/components/ui/form/FormFields";
import { useGradeSubmission } from "@/hooks/mutations/submissions/useGradeSubmission";
import type { Submission } from "@/libs/types/submissions/submission";

type Props = {
  open: boolean;
  onClose: () => void;
  submission: Submission | null;
  assignmentId: string;
  studentName?: string;
  onSuccess?: () => void;
};

export default function GradeSubmissionModal({
  open,
  onClose,
  submission,
  assignmentId,
  studentName,
  onSuccess,
}: Props) {
  const [status, setStatus] = React.useState<"PASSED" | "FAILED">("PASSED");
  const [feedback, setFeedback] = React.useState("");

  const { gradeSubmission, loading, error, setError } = useGradeSubmission(assignmentId);

  const labelId = "grade-submission-title";

  React.useEffect(() => {
    if (!submission) return;
    setStatus(submission.status === "FAILED" ? "FAILED" : "PASSED");
    setFeedback(submission.feedback || "");
    setError(null);
  }, [submission, setError]);

  if (!open || !submission) return null;

  const resetAndClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      setError("Feedback is required.");
      return;
    }

    try {
      await gradeSubmission({
        submissionId: submission._id,
        feedback: feedback.trim(),
        status,
      });
      onSuccess?.();
      resetAndClose();
    } catch {
      // error handled inside hook
    }
  };

  return (
    <Modal open={open} onClose={resetAndClose} labelledBy={labelId}>
      <ModalHeader
        id={labelId}
        title={`Grade ${studentName || "submission"}`}
        onClose={resetAndClose}
      />

      <ModalBody>
        <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Answer
          </p>
          <p className="whitespace-pre-wrap">{submission.answer || "—"}</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Result
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStatus("PASSED")}
              disabled={loading}
              className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                status === "PASSED"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Pass
            </button>
            <button
              type="button"
              onClick={() => setStatus("FAILED")}
              disabled={loading}
              className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                status === "FAILED"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              Fail
            </button>
          </div>
        </div>

        <Textarea
          id="grade-feedback"
          label="Feedback"
          required
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Explain what was good and what needs work..."
          disabled={loading}
        />

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
          className="px-4 py-2 rounded-xl bg-purple-700 font-semibold text-white hover:bg-purple-800 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : "Submit Grade"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
