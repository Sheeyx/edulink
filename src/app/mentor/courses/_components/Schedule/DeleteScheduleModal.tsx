"use client";

import { FiTrash2 } from "react-icons/fi";

export default function DeleteScheduleModal({
  open,
  title,
  loading,
  error,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  loading: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <FiTrash2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Cancel this class?
            </h2>
            <p className="text-xs text-slate-500">
              This action cannot be undone. Students will no longer see this
              class on the schedule.
            </p>
          </div>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <span className="font-semibold">Class:</span>{" "}
            <span>{title || "Untitled class"}</span>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-600">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              No, keep it
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-60"
            >
              {loading ? "Deleting…" : "Yes, delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
