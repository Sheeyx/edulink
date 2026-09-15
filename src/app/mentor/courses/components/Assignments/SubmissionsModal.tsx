"use client";

import * as React from "react";
import { FiX, FiDownload, FiCheckCircle } from "react-icons/fi";
import { useAssignmentSubmissions } from "@/hooks/useAssignmentSubmissions";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";
import GradeSubmissionModal from "./GradeSubmissionModal";
import type { Submission } from "@/libs/types/submissions/submission";

export type SubmissionsModalTarget = { _id: string; title: string };

const STATUS_CLASS: Record<string, string> = {
  SUBMITTED: "bg-sky-50 text-sky-700",
  LATE: "bg-amber-50 text-amber-700",
  PASSED: "bg-emerald-50 text-emerald-700",
  FAILED: "bg-rose-50 text-rose-600",
};

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  open: boolean;
  onClose: () => void;
  assignment: SubmissionsModalTarget | null;
};

export default function SubmissionsModal({ open, onClose, assignment }: Props) {
  const assignmentId = assignment?._id ?? null;
  const { data: submissions = [], isLoading, refetch } = useAssignmentSubmissions(
    open ? assignmentId : null
  );

  const [grading, setGrading] = React.useState<Submission | null>(null);

  if (!open || !assignment) return null;

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">Submissions</h2>
            <p className="text-xs text-slate-500">{assignment.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-16 animate-pulse rounded-xl bg-slate-50" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-50" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
              No students have submitted work for this assignment yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {submissions.map((s) => (
                <li
                  key={s._id}
                  className="rounded-xl bg-white p-3.5 text-sm ring-1 ring-slate-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800">
                        {s.studentData?.memberFullName || "Student"}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                        Submitted {formatDate(s.submittedDate)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${STATUS_CLASS[s.status]}`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <p className="mt-2 whitespace-pre-wrap text-slate-700">{s.answer}</p>

                  {s.attachments && s.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {s.attachments.map((url, i) => (
                        <a
                          key={i}
                          href={buildDownloadUrl(url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200"
                        >
                          <FiDownload className="h-3 w-3" />
                          Attachment {s.attachments!.length > 1 ? i + 1 : ""}
                        </a>
                      ))}
                    </div>
                  )}

                  {s.status === "PASSED" || s.status === "FAILED" ? (
                    <div className="mt-2.5 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      <span className="font-semibold">
                        {s.graderData?.memberFullName || "Mentor"}&apos;s feedback:
                      </span>{" "}
                      {s.feedback}
                    </div>
                  ) : (
                    <button
                      onClick={() => setGrading(s)}
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-purple-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-800"
                    >
                      <FiCheckCircle className="h-3.5 w-3.5" />
                      Grade
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <GradeSubmissionModal
        open={!!grading}
        onClose={() => setGrading(null)}
        submission={grading}
        assignmentId={assignment._id}
        studentName={grading?.studentData?.memberFullName || undefined}
        onSuccess={() => {
          setGrading(null);
          refetch();
        }}
      />
    </div>
  );
}
