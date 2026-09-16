"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/Modal";
import { ErrorAlert } from "@/components/ui/form/FormFields";
import { useEnrolledStudents } from "@/hooks/useEnrolledStudents";
import { useLessonAttendance } from "@/hooks/useLessonAttendance";
import { useSaveBulkAttendance } from "@/hooks/mutations/attendance/useSaveBulkAttendance";
import { ATTENDANCE_STATUS, type AttendanceStatus } from "@/libs/enums/attendance.enums";
import type { AttendanceRosterRow } from "@/libs/types/attendance/attendance";

const STATUS_STYLE: Record<AttendanceStatus, { active: string; idle: string; label: string }> = {
  PRESENT: { active: "bg-emerald-600 text-white", idle: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100", label: "P" },
  LATE: { active: "bg-amber-600 text-white", idle: "bg-amber-50 text-amber-700 hover:bg-amber-100", label: "L" },
  ABSENT: { active: "bg-rose-600 text-white", idle: "bg-rose-50 text-rose-700 hover:bg-rose-100", label: "A" },
  EXCUSED: { active: "bg-sky-600 text-white", idle: "bg-sky-50 text-sky-700 hover:bg-sky-100", label: "E" },
};

function todayLocalDate(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type Props = {
  open: boolean;
  onClose: () => void;
  courseId: string;
  sectionId: string;
  lessonId: string;
  lessonTitle: string;
  enrolledMemberIds: string[];
  onSuccess?: () => void;
};

export default function TakeAttendanceModal({
  open,
  onClose,
  courseId,
  sectionId,
  lessonId,
  lessonTitle,
  enrolledMemberIds,
  onSuccess,
}: Props) {
  const [date, setDate] = React.useState(todayLocalDate());
  const [roster, setRoster] = React.useState<AttendanceRosterRow[]>([]);

  const queryClient = useQueryClient();
  const { data: students = [], isLoading: studentsLoading } = useEnrolledStudents(
    open ? enrolledMemberIds : []
  );
  const { data: existing = [], isLoading: attendanceLoading } = useLessonAttendance(
    open ? lessonId : null,
    date
  );
  const { saveBulkAttendance, loading, error, setError } = useSaveBulkAttendance();

  const labelId = "take-attendance-title";
  const rosterLoading = studentsLoading || attendanceLoading;

  React.useEffect(() => {
    if (!open) return;
    const existingByStudent = new Map(existing.map((a) => [a.studentId, a]));

    setRoster(
      students.map((s) => {
        const match = existingByStudent.get(s._id);
        return {
          studentId: s._id,
          studentName: s.memberFullName || "Student",
          studentImage: s.memberImage,
          status: match?.status ?? "PRESENT",
          notes: match?.notes ?? "",
          existingAttendanceId: match?._id,
        };
      })
    );
    setError(null);
  }, [open, students, existing, setError]);

  if (!open) return null;

  const resetAndClose = () => {
    if (loading) return;
    onClose();
  };

  const setRowStatus = (studentId: string, status: AttendanceStatus) => {
    setRoster((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
  };

  const setRowNotes = (studentId: string, notes: string) => {
    setRoster((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, notes } : r))
    );
  };

  const handleSubmit = async () => {
    if (roster.length === 0) {
      setError("No enrolled students to mark attendance for.");
      return;
    }

    try {
      await saveBulkAttendance({
        lessonId,
        sectionId,
        courseId,
        attendanceDate: new Date(date).toISOString(),
        attendances: roster.map((r) => ({
          studentId: r.studentId,
          status: r.status,
          notes: r.notes.trim() || undefined,
        })),
      });

      await queryClient.invalidateQueries({ queryKey: ["lesson-attendance", lessonId] });
      await queryClient.invalidateQueries({ queryKey: ["attendance-stats", courseId] });

      onSuccess?.();
      resetAndClose();
    } catch {
      // error handled inside hook
    }
  };

  return (
    <Modal open={open} onClose={resetAndClose} labelledBy={labelId} className="max-w-2xl">
      <ModalHeader id={labelId} title={`Attendance — ${lessonTitle}`} onClose={resetAndClose} />

      <ModalBody>
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
          />
        </div>

        {rosterLoading ? (
          <div className="space-y-2">
            <div className="h-12 animate-pulse rounded-xl bg-slate-50" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-50" />
          </div>
        ) : roster.length === 0 ? (
          <div className="rounded-xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
            No students are enrolled in this course yet.
          </div>
        ) : (
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {roster.map((row) => (
              <div
                key={row.studentId}
                className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-100"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-medium text-slate-800">
                    {row.studentName}
                  </p>
                  <div className="flex shrink-0 gap-1">
                    {ATTENDANCE_STATUS.map((st) => (
                      <button
                        key={st}
                        type="button"
                        title={st}
                        onClick={() => setRowStatus(row.studentId, st)}
                        disabled={loading}
                        className={`h-7 w-7 rounded-lg text-xs font-bold transition ${
                          row.status === st ? STATUS_STYLE[st].active : STATUS_STYLE[st].idle
                        }`}
                      >
                        {STATUS_STYLE[st].label}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={row.notes}
                  onChange={(e) => setRowNotes(row.studentId, e.target.value)}
                  placeholder="Note (optional)"
                  disabled={loading}
                  className="mt-1.5 w-full rounded-lg border border-gray-100 bg-slate-50 px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-brand-primary/40"
                />
              </div>
            ))}
          </div>
        )}

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
          disabled={loading || rosterLoading}
        >
          {loading ? "Saving..." : "Save Attendance"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
