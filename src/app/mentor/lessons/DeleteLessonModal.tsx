"use client";

import * as React from "react";
import { FiAlertTriangle } from "react-icons/fi";

type DeleteLessonModalProps = {
  open: boolean;
  title: string;
  loading?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteLessonModal({
  open,
  title,
  loading = false,
  error,
  onCancel,
  onConfirm,
}: DeleteLessonModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-3 flex items-center gap-2 text-rose-600">
          <FiAlertTriangle className="h-5 w-5" />
          <h2 className="text-base font-semibold">Delete lesson</h2>
        </div>

        <p className="text-sm text-slate-700">
          Are you sure you want to delete{" "}
          <span className="font-semibold">&quot;{title}&quot;</span>? This action
          cannot be undone.
        </p>

        {error && (
          <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={onConfirm}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
