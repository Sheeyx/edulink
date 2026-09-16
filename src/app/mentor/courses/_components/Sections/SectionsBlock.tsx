// app/mentor/courses/components/Sections/SectionsBlock.tsx
"use client";

import * as React from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiChevronDown,
  FiMove,
  FiPlay, // ▶️ for video preview
  FiCheckSquare, // 📋 for attendance
} from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";

import { gqlFetchAuth } from "@/libs/graphql";
import type { SectionUI, LessonUI } from "@/libs/types/course/types";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";
import UpdateAssignmentModal from "@/app/mentor/assignments/UpdateAssignmentModal";
import CreateAssignmentModal from "@/app/mentor/assignments/CreateAssignmentModal";
import TakeAttendanceModal from "../Attendance/TakeAttendanceModal";
import { useCourseAssignmentsList } from "@/hooks/useCourseAssignmentsList";
import { toAssignmentUI, type AssignmentUI } from "@/libs/types/assignments/assignment";
import { DELETE_ASSIGNMENT_MUTATION } from "@/graphql/mutation/assignments/deleteAssignment";

/* ─────────────────── Utils ─────────────────── */

const formatDueDate = (iso?: string | null): string => {
  if (!iso) return "No due date";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "No due date";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

/* ─────────────────── Props ─────────────────── */

type Props = {
  courseId: string;
  sections: SectionUI[];
  enrolledMemberIds?: string[];
  onAddLesson: (sectionId: string) => void;
  onEditSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;

  onEditLesson: (sectionId: string, lessonId: string) => void;
  onDeleteLesson: (sectionId: string, lessonId: string) => void;
  onReorderLessons: (sectionId: string, lessons: LessonUI[]) => void;

  onCreateAssignmentForSection?: (sectionId: string) => void;
  onCreateAssignmentForLesson?: (sectionId: string, lessonId: string) => void;
  onCreateGeneralAssignment?: () => void; // 🔹 NEW: for course-level assignments
  onViewSubmissions?: (assignment: { _id: string; title: string }) => void;

  // 🔹 NEW: video preview callback
  onPreviewLesson?: (sectionId: string, lessonId: string) => void;
};

/* ─────────────────── Main component ─────────────────── */

export default function SectionsBlock({
  courseId,
  sections,
  enrolledMemberIds = [],
  onAddLesson,
  onEditSection,
  onDeleteSection,
  onEditLesson,
  onDeleteLesson,
  onReorderLessons,
  onCreateAssignmentForSection,
  onCreateAssignmentForLesson,
  onCreateGeneralAssignment,
  onViewSubmissions,
  onPreviewLesson,
}: Props) {
  const activeSections = sections.filter(
    (s) => !s.status || s.status === "ACTIVE"
  );

  const [openSectionId, setOpenSectionId] = React.useState<string | null>(null);
  const toggleSection = (id: string) => {
    setOpenSectionId((prev) => (prev === id ? null : id));
  };

  // Fetch assignments for the whole course (shared with the Assignments tab)
  const {
    data: assignments = [],
    isLoading: assignmentsLoading,
    isError: assignmentsError,
  } = useCourseAssignmentsList(courseId);

  // Group assignments by sectionId
  const assignmentsBySection = React.useMemo(() => {
    const map: Record<string, AssignmentUI[]> = {};
    assignments.forEach((a) => {
      if (!a.sectionId) return;
      const key = a.sectionId;
      if (!map[key]) map[key] = [];
      map[key].push(toAssignmentUI(a));
    });
    return map;
  }, [assignments]);

  return (
    <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_24px_rgba(99,99,160,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-black text-gray-900 lg:text-lg">
            Sections
          </h3>
          {assignmentsLoading && (
            <span className="text-xs text-gray-400">
              Loading assignments…
            </span>
          )}
          {assignmentsError && (
            <span className="text-xs text-rose-500">
              Failed to load assignments.
            </span>
          )}
        </div>

        <span className="text-xs text-gray-500">
          {activeSections.length} active sections
        </span>
      </div>

      {activeSections.length === 0 ? (
        <div className="rounded-2xl bg-brand-primary/10 border border-brand-primary/15 px-4 py-6 text-sm text-gray-600">
          No active sections yet. Use{" "}
          <span className="font-bold text-brand-selected">Add Section</span> to
          create the first module.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activeSections.map((section) => (
            <SectionRow
              key={section.id}
              courseId={courseId}
              section={section}
              enrolledMemberIds={enrolledMemberIds}
              isOpen={openSectionId === section.id}
              onToggle={() => toggleSection(section.id)}
              onAddLesson={onAddLesson}
              onEditSection={onEditSection}
              onDeleteSection={onDeleteSection}
              onEditLesson={onEditLesson}
              onDeleteLesson={onDeleteLesson}
              onReorderLessons={onReorderLessons}
              onCreateAssignmentForSection={onCreateAssignmentForSection}
              onCreateAssignmentForLesson={onCreateAssignmentForLesson}
              onViewSubmissions={onViewSubmissions}
              onPreviewLesson={onPreviewLesson} // 🔹 pass down
              assignments={assignmentsBySection[section.id] ?? []}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─────────────────── SectionRow ─────────────────── */

function SectionRow({
  courseId,
  section,
  enrolledMemberIds = [],
  isOpen,
  onToggle,
  onAddLesson,
  onEditSection,
  onDeleteSection,
  onEditLesson,
  onDeleteLesson,
  onReorderLessons,
  onCreateAssignmentForSection,
  onCreateAssignmentForLesson,
  onViewSubmissions,
  onPreviewLesson,
  assignments,
}: {
  courseId: string;
  section: SectionUI;
  enrolledMemberIds?: string[];
  isOpen: boolean;
  onToggle: () => void;
  onAddLesson: (sectionId: string) => void;
  onEditSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onEditLesson: (sectionId: string, lessonId: string) => void;
  onDeleteLesson: (sectionId: string, lessonId: string) => void;
  onReorderLessons: (sectionId: string, lessons: LessonUI[]) => void;
  onCreateAssignmentForSection?: (sectionId: string) => void;
  onCreateAssignmentForLesson?: (sectionId: string, lessonId: string) => void;
  onViewSubmissions?: (assignment: { _id: string; title: string }) => void;
  onPreviewLesson?: (sectionId: string, lessonId: string) => void;
  assignments?: AssignmentUI[];
}) {
  const queryClient = useQueryClient();

  const [localLessons, setLocalLessons] = React.useState<LessonUI[]>(
    section.lessons ?? []
  );
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [editingAssignment, setEditingAssignment] =
    React.useState<AssignmentUI | null>(null);
  const [creatingAssignmentFor, setCreatingAssignmentFor] = React.useState<{
    sectionId: string;
    lessonId?: string;
  } | null>(null);
  const [takingAttendanceFor, setTakingAttendanceFor] = React.useState<{
    lessonId: string;
    lessonTitle: string;
  } | null>(null);

  const invalidateAssignments = () =>
    queryClient.invalidateQueries({ queryKey: ["course-assignments", courseId] });

  // custom delete modal state
  const [assignmentToDelete, setAssignmentToDelete] =
    React.useState<AssignmentUI | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");

  React.useEffect(() => {
    setLocalLessons(section.lessons ?? []);
  }, [section.lessons]);

  const handleDragStart = (id: string) => (e: React.DragEvent) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (id: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (id: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedId || draggedId === id) return;

    setLocalLessons((prev) => {
      const currentIndex = prev.findIndex((l) => l.id === draggedId);
      const targetIndex = prev.findIndex((l) => l.id === id);
      if (currentIndex === -1 || targetIndex === -1) return prev;

      const updated = [...prev];
      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, moved);

      onReorderLessons(section.id, updated);
      return updated;
    });

    setDraggedId(null);
  };

  const confirmDeleteAssignment = async () => {
    if (!assignmentToDelete) return;
    setDeleteLoading(true);
    setDeleteError("");

    try {
      await gqlFetchAuth(DELETE_ASSIGNMENT_MUTATION, {
        input: assignmentToDelete.id,
      });

      await queryClient.invalidateQueries({
        queryKey: ["course-assignments", courseId],
      });

      setAssignmentToDelete(null);
    } catch (err: any) {
      console.error("Failed to delete assignment", err);
      setDeleteError(err?.message || "Failed to delete assignment");
    } finally {
      setDeleteLoading(false);
      }
  };

  const lessons = localLessons;
  const sectionAssignments = assignments ?? [];
  console.log("logsson", lessons)

  return (
    <>
      <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-900 border border-gray-100">
        {/* Header row (accordion trigger) */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={onToggle}
            className="flex flex-1 items-start gap-2 text-left"
          >
            <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-gray-200">
              <FiChevronDown
                className={`h-3 w-3 text-gray-500 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </span>

            <div>
              <h4 className="font-extrabold text-gray-900">{section.title}</h4>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="rounded-full bg-white px-3 py-1 border border-gray-200">
                  Order: {section.order}
                </span>
                <span className="rounded-full bg-white px-3 py-1 border border-gray-200">
                  {section.lessonsCount} Lessons
                </span>
                {sectionAssignments.length > 0 && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 border border-emerald-100">
                    {sectionAssignments.length} Assignments
                  </span>
                )}
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Add Lesson */}
            <button
              title="Add lesson"
              onClick={(e) => {
                e.stopPropagation();
                onAddLesson(section.id);
              }}
              className="flex h-9 items-center gap-1 rounded-xl bg-sky-50 px-3 text-xs font-bold text-sky-700 hover:bg-sky-100"
            >
              <FiPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Lesson</span>
            </button>

            {/* Add Assignment for section */}
            <button
              title="Add assignment for this section"
              onClick={(e) => {
                e.stopPropagation();
                setCreatingAssignmentFor({ sectionId: section.id });
              }}
              className="flex h-9 items-center gap-1 rounded-xl bg-emerald-50 px-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
            >
              <FiPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Assignment</span>
            </button>

            <button
              title="Edit section"
              onClick={(e) => {
                e.stopPropagation();
                onEditSection(section.id);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-selected hover:bg-brand-primary/15"
            >
              <FiEdit2 className="h-4 w-4" />
            </button>

            <button
              title="Delete section"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSection(section.id);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Accordion content: lessons + assignments */}
        {isOpen && (
          <div className="mt-3 space-y-4 border-t border-gray-200 pt-3">
            {/* Lessons */}
            <div>
              {lessons.length === 0 ? (
                <p className="text-xs italic text-slate-500">
                  No lessons yet. Use the "Lesson" button to add one.
                </p>
              ) : (
                <ul className="space-y-2">
                  {lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      draggable
                      onDragStart={handleDragStart(lesson.id)}
                      onDragOver={handleDragOver(lesson.id)}
                      onDrop={handleDrop(lesson.id)}
                      className={`flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs border border-gray-100 ${
                        draggedId === lesson.id ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                          <FiMove className="h-3 w-3" />
                        </span>
                        <div>
                          <p className="font-bold text-gray-800">
                            {lesson.title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-gray-500">
                            {lesson.contentType ?? "CONTENT"} •{" "}
                            {lesson.duration ?? "-"} min
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* ▶️ Preview video (only for VIDEO lessons) */}
                        {onPreviewLesson &&
                          lesson.contentType === "VIDEO" && (
                            <button
                              title="Preview video"
                              onClick={() =>
                                onPreviewLesson(section.id, lesson.id)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100"
                            >
                              <FiPlay className="h-3 w-3" />
                            </button>
                          )}

                        {/* Create assignment for this lesson */}
                        <button
                          title="Add assignment for this lesson"
                          onClick={() =>
                            setCreatingAssignmentFor({
                              sectionId: section.id,
                              lessonId: lesson.id,
                            })
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          <FiPlus className="h-3 w-3" />
                        </button>

                        {/* Take attendance for this lesson */}
                        <button
                          title="Take attendance"
                          onClick={() =>
                            setTakingAttendanceFor({
                              lessonId: lesson.id,
                              lessonTitle: lesson.title,
                            })
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        >
                          <FiCheckSquare className="h-3 w-3" />
                        </button>

                        <button
                          title="Edit lesson"
                          onClick={() => onEditLesson(section.id, lesson.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-selected hover:bg-brand-primary/15"
                        >
                          <FiEdit2 className="h-3 w-3" />
                        </button>
                        <button
                          title="Delete lesson"
                          onClick={() =>
                            onDeleteLesson(section.id, lesson.id)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Assignments (all for this section) */}
            {sectionAssignments.length > 0 && (
              <div className="rounded-xl bg-emerald-50/40 px-3 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                    Assignments
                  </p>
                  <span className="text-[11px] text-emerald-700">
                    {sectionAssignments.length} total
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {sectionAssignments.map((a, idxA) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between rounded-lg bg-white/80 px-3 py-2 text-xs ring-1 ring-emerald-100 transition hover:bg-emerald-50/60"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 line-clamp-1">
                          {a.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {a.lessonId
                            ? "Linked to a lesson"
                            : "Section-level assignment"}
                          {" • "}
                          {formatDueDate(a.dueDate)}
                        </p>

                        {/* Attachments */}
                        {a.attachments.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {a.attachments.map((file, idx) => {
                              const url = buildDownloadUrl(file);
                              if (!url) return null;

                              const fileName =
                                file?.toString().split("/").pop() ||
                                `File ${idx + 1}`;

                              return (
                                <a
                                  key={`${a.id}-${idx}-${idxA}`}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 hover:bg-emerald-100 max-w-[160px]"
                                  title={fileName}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span className="mr-1">📎</span>
                                  <span className="truncate">{fileName}</span>
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                          {a.submissionCount} submissions
                        </span>

                        <div className="flex gap-1">
                          {onViewSubmissions && (
                            <button
                              type="button"
                              onClick={() =>
                                onViewSubmissions({ _id: a.id, title: a.title })
                              }
                              className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-medium text-sky-700 hover:bg-sky-100"
                            >
                              Submissions
                            </button>
                          )}

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
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {creatingAssignmentFor && (
        <CreateAssignmentModal
          open={!!creatingAssignmentFor}
          onClose={() => setCreatingAssignmentFor(null)}
          courseId={courseId}
          sectionId={creatingAssignmentFor.sectionId}
          lessonId={creatingAssignmentFor.lessonId}
          onSuccess={() => {
            setCreatingAssignmentFor(null);
            invalidateAssignments();
          }}
        />
      )}

      {/* Update Assignment Modal */}
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

      {/* Delete Assignment Modal */}
      {assignmentToDelete && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <FiTrash2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Delete assignment?
                </h3>
                <p className="text-xs text-gray-500">
                  This action cannot be undone.
                </p>
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
                  onClick={confirmDeleteAssignment}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-60"
                >
                  {deleteLoading ? "Deleting…" : "Yes, delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Take Attendance Modal */}
      {takingAttendanceFor && (
        <TakeAttendanceModal
          open={!!takingAttendanceFor}
          onClose={() => setTakingAttendanceFor(null)}
          courseId={courseId}
          sectionId={section.id}
          lessonId={takingAttendanceFor.lessonId}
          lessonTitle={takingAttendanceFor.lessonTitle}
          enrolledMemberIds={enrolledMemberIds}
        />
      )}
    </>
  );
}