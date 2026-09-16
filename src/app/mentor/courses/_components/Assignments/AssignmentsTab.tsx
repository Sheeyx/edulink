"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FiEdit2, FiTrash2, FiUsers, FiClock, FiPlus, FiDownload } from "react-icons/fi";
import { gqlFetchAuth } from "@/libs/graphql";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";
import { useCourseAssignmentsList } from "@/hooks/useCourseAssignmentsList";
import { toAssignmentUI, type AssignmentUI } from "@/libs/types/assignments/assignment";
import { DELETE_ASSIGNMENT_MUTATION } from "@/graphql/mutation/assignments/deleteAssignment";
import UpdateAssignmentModal from "@/app/mentor/assignments/UpdateAssignmentModal";
import SubmissionsModal, { type SubmissionsModalTarget } from "./SubmissionsModal";

const STATUS_CLASS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  ACTIVE: "bg-emerald-50 text-emerald-700",
  ARCHIVED: "bg-amber-50 text-amber-700",
  DELETED: "bg-rose-50 text-rose-600",
};

function formatDueDate(iso?: string | null): string {
  if (!iso) return "No due date";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "No due date";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  courseId: string;
  onAddAssignment: () => void;
};

export default function AssignmentsTab({ courseId, onAddAssignment }: Props) {
  const queryClient = useQueryClient();
  const { data: assignmentsRaw = [], isLoading, isError } = useCourseAssignmentsList(courseId);

  const assignments: AssignmentUI[] = React.useMemo(
    () => assignmentsRaw.map(toAssignmentUI),
    [assignmentsRaw]
  );

  const [editingAssignment, setEditingAssignment] = React.useState<AssignmentUI | null>(null);
  const [viewingSubmissionsFor, setViewingSubmissionsFor] =
    React.useState<SubmissionsModalTarget | null>(null);
  const [assignmentToDelete, setAssignmentToDelete] = React.useState<AssignmentUI | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");

  const invalidateAssignments = () =>
    queryClient.invalidateQueries({ queryKey: ["course-assignments", courseId] });

  const confirmDelete = async () => {
    if (!assignmentToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");

    try {
      await gqlFetchAuth(DELETE_ASSIGNMENT_MUTATION, { input: assignmentToDelete.id });
      await invalidateAssignments();
      setAssignmentToDelete(null);
    } catch (err) {
      console.error("Failed to delete assignment", err);
      setDeleteError(err instanceof Error ? err.message : "Failed to delete assignment");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_24px_rgba(251,133,0,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-black text-gray-900 lg:text-lg">Assignments</h3>
        <button
          onClick={onAddAssignment}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-selected px-3 py-1.5 text-xs font-bold text-white hover:brightness-90"
        >
          <FiPlus className="h-3.5 w-3.5" />
          Add Assignment
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-16 animate-pulse rounded-xl bg-slate-50" />
          <div className="h-16 animate-pulse rounded-xl bg-slate-50" />
        </div>
      ) : isError ? (
        <div className="rounded-xl bg-rose-50 px-4 py-6 text-sm text-rose-600">
          Failed to load assignments.
        </div>
      ) : assignments.length === 0 ? (
        <div className="rounded-2xl bg-brand-primary/10 border border-brand-primary/15 px-4 py-6 text-sm text-gray-600">
          No assignments yet. Use{" "}
          <span className="font-bold text-brand-selected">Add Assignment</span> to
          give students work to submit.
        </div>
      ) : (
        <ul className="space-y-2">
          {assignments.map((a) => (
            <li
              key={a.id}
              className="rounded-xl bg-white px-3.5 py-3 ring-1 ring-slate-100"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-slate-800">{a.title}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                        STATUS_CLASS[a.status || "ACTIVE"] ?? STATUS_CLASS.ACTIVE
                      }`}
                    >
                      {a.status ?? "ACTIVE"}
                    </span>
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                    <FiClock className="h-3 w-3" />
                    Due {formatDueDate(a.dueDate)}
                    {a.sectionId ? (
                      <span className="text-slate-300">
                        • {a.lessonId ? "Linked to a lesson" : "Section-level"}
                      </span>
                    ) : (
                      <span className="text-slate-300">• Course-level</span>
                    )}
                  </p>

                  {a.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs text-slate-600">{a.description}</p>
                  )}

                  {a.attachments.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {a.attachments.map((file, idx) => {
                        const url = buildDownloadUrl(file);
                        if (!url) return null;
                        const fileName = file.split("/").pop() || `File ${idx + 1}`;
                        return (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={fileName}
                            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 hover:bg-slate-200"
                          >
                            <FiDownload className="h-3 w-3" />
                            <span className="max-w-[120px] truncate">{fileName}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setViewingSubmissionsFor({ _id: a.id, title: a.title })}
                    className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700 hover:bg-sky-100"
                  >
                    <FiUsers className="h-3 w-3" />
                    {a.submissionCount} submission{a.submissionCount === 1 ? "" : "s"}
                  </button>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingAssignment(a)}
                      className="inline-flex items-center gap-1 rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-brand-selected hover:bg-brand-primary/15"
                    >
                      <FiEdit2 className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssignmentToDelete(a)}
                      className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-medium text-rose-700 hover:bg-rose-100"
                    >
                      <FiTrash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingAssignment && (
        <UpdateAssignmentModal
          open={!!editingAssignment}
          onClose={() => setEditingAssignment(null)}
          assignment={{
            _id: editingAssignment.id,
            title: editingAssignment.title,
            description: editingAssignment.description,
            courseId,
            sectionId: editingAssignment.sectionId,
            lessonId: editingAssignment.lessonId,
            mentorId: editingAssignment.mentorId,
            dueDate: editingAssignment.dueDate,
            attachments: editingAssignment.attachments,
            status: editingAssignment.status,
          }}
          courseId={courseId}
        />
      )}

      <SubmissionsModal
        open={!!viewingSubmissionsFor}
        onClose={() => setViewingSubmissionsFor(null)}
        assignment={viewingSubmissionsFor}
      />

      {assignmentToDelete && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <FiTrash2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Delete assignment?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div className="rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">
                <span className="font-semibold">Assignment:</span>{" "}
                <span>{assignmentToDelete.title}</span>
              </div>

              {deleteError && (
                <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-600">
                  {deleteError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => {
                    if (deleteLoading) return;
                    setAssignmentToDelete(null);
                    setDeleteError("");
                  }}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  No, keep it
                </button>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={confirmDelete}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-60"
                >
                  {deleteLoading ? "Deleting…" : "Yes, delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
