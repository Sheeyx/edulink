"use client";

import * as React from "react";
import { FiPlus, FiX } from "react-icons/fi";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/Modal";
import { ErrorAlert } from "@/components/ui/form/FormFields";
import {
  COURSE_SCHEDULE_STATUS,
  type CourseScheduleStatus,
} from "@/libs/enums/course.enums";
import { useUpdateSchedule } from "@/hooks/mutations/schedules/useUpdateSchedule";
import type { ScheduleUI } from "@/libs/types/course/types";
import type { LessonOption } from "./CreateScheduleModal";

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

type Props = {
  open: boolean;
  onClose: () => void;
  schedule: ScheduleUI | null;
  lessonOptions?: LessonOption[];
  onSuccess?: () => void;
};

export default function EditScheduleModal({
  open,
  onClose,
  schedule,
  lessonOptions = [],
  onSuccess,
}: Props) {
  const [lessonId, setLessonId] = React.useState("");
  const [startAt, setStartAt] = React.useState<string[]>([""]);
  const [status, setStatus] = React.useState<CourseScheduleStatus>("SCHEDULED");
  const [meetLinks, setMeetLinks] = React.useState<string[]>([""]);

  const { updateSchedule, loading, error, setError } = useUpdateSchedule();

  const labelId = "edit-schedule-title";

  React.useEffect(() => {
    if (!schedule) return;
    setLessonId(schedule.lessonId || "");
    setStartAt(
      schedule.startAt.length > 0
        ? schedule.startAt.map(toDatetimeLocal)
        : [""]
    );
    setStatus(schedule.status);
    setMeetLinks(schedule.meetLinks.length > 0 ? schedule.meetLinks : [""]);
    setError(null);
  }, [schedule, setError]);

  if (!open || !schedule) return null;

  const resetAndClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = async () => {
    const times = startAt.map((t) => t.trim()).filter(Boolean);
    if (times.length === 0) {
      setError("At least one class date/time is required.");
      return;
    }

    const isoTimes: string[] = [];
    for (const t of times) {
      const d = new Date(t);
      if (Number.isNaN(d.getTime())) {
        setError("One of the class times is invalid.");
        return;
      }
      isoTimes.push(d.toISOString());
    }

    try {
      await updateSchedule({
        _id: schedule.id,
        lessonId: lessonId || null,
        startAt: isoTimes,
        status,
        meetLinks: meetLinks.map((l) => l.trim()).filter(Boolean),
      });
      onSuccess?.();
      resetAndClose();
    } catch {
      // error handled inside hook
    }
  };

  return (
    <Modal open={open} onClose={resetAndClose} labelledBy={labelId}>
      <ModalHeader id={labelId} title="Edit Class" onClose={resetAndClose} />

      <ModalBody>
        {lessonOptions.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Lesson (optional)
            </label>
            <select
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
            >
              <option value="">No specific lesson</option>
              {lessonOptions.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Class Date &amp; Time <span className="text-red-500">*</span>
          </label>
          {startAt.map((value, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="datetime-local"
                value={value}
                onChange={(e) =>
                  setStartAt((prev) =>
                    prev.map((v, idx) => (idx === i ? e.target.value : v))
                  )
                }
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
              />
              {startAt.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setStartAt((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  disabled={loading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-rose-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setStartAt((prev) => [...prev, ""])}
            disabled={loading}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-selected hover:text-brand-selected"
          >
            <FiPlus className="h-3.5 w-3.5" />
            Add another time
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CourseScheduleStatus)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
          >
            {COURSE_SCHEDULE_STATUS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Meet Links (optional)
          </label>
          {meetLinks.map((value, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="url"
                placeholder="https://meet.google.com/..."
                value={value}
                onChange={(e) =>
                  setMeetLinks((prev) =>
                    prev.map((v, idx) => (idx === i ? e.target.value : v))
                  )
                }
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/15"
              />
              {meetLinks.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setMeetLinks((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  disabled={loading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-rose-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setMeetLinks((prev) => [...prev, ""])}
            disabled={loading}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-selected hover:text-brand-selected"
          >
            <FiPlus className="h-3.5 w-3.5" />
            Add another link
          </button>
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
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
