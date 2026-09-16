"use client";

import * as React from "react";
import { FiClock, FiDownload, FiEdit3 } from "react-icons/fi";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";
import type { AssignmentWithContext } from "../_types/assignments.types";

const STATUS_CLASS: Record<string, string> = {
  NOT_SUBMITTED: "bg-gray-100 text-gray-600",
  OVERDUE: "bg-rose-50 text-rose-600",
  SUBMITTED: "bg-sky-50 text-sky-700",
  LATE: "bg-amber-50 text-amber-700",
  PASSED: "bg-emerald-50 text-emerald-700",
  FAILED: "bg-rose-50 text-rose-600",
};

const STATUS_LABEL: Record<string, string> = {
  NOT_SUBMITTED: "Not submitted",
  OVERDUE: "Overdue",
  SUBMITTED: "Submitted",
  LATE: "Submitted late",
  PASSED: "Passed",
  FAILED: "Failed",
};

function formatDate(value?: string | null): string {
  if (!value) return "No due date";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  item: AssignmentWithContext;
  onSubmit: (item: AssignmentWithContext) => void;
};

export default function AssignmentCard({ item, onSubmit }: Props) {
  const { assignment, courseTitle, submission } = item;

  const isPastDue = assignment.dueDate
    ? new Date(assignment.dueDate).getTime() < Date.now()
    : false;

  const statusKey = submission
    ? submission.status
    : isPastDue
    ? "OVERDUE"
    : "NOT_SUBMITTED";

  const canSubmit = !submission || submission.status === "SUBMITTED" || submission.status === "LATE";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_24px_rgba(99,99,160,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-selected">
            {courseTitle}
          </p>
          <h3 className="mt-0.5 truncate text-lg font-black text-gray-900">
            {assignment.title}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${STATUS_CLASS[statusKey]}`}
        >
          {STATUS_LABEL[statusKey]}
        </span>
      </div>

      {assignment.description && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{assignment.description}</p>
      )}

      <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
        <FiClock className="h-3.5 w-3.5" />
        Due {formatDate(assignment.dueDate)}
      </p>

      {assignment.attachments && assignment.attachments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {assignment.attachments.map((url, i) => (
            <a
              key={i}
              href={buildDownloadUrl(url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200"
            >
              <FiDownload className="h-3 w-3" />
              Attachment {assignment.attachments!.length > 1 ? i + 1 : ""}
            </a>
          ))}
        </div>
      )}

      {submission && (submission.status === "PASSED" || submission.status === "FAILED") && (
        <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Mentor feedback
          </p>
          <p className="mt-1 whitespace-pre-wrap">{submission.feedback}</p>
        </div>
      )}

      {canSubmit && (
        <button
          onClick={() => onSubmit(item)}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-brand-selected px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:brightness-90"
        >
          <FiEdit3 className="h-4 w-4" />
          {submission ? "Edit Submission" : "Submit Work"}
        </button>
      )}
    </div>
  );
}
