// src/app/mentor/lessons/EditLessonModal.tsx
"use client";

import * as React from "react";
import { FiX } from "react-icons/fi";

type EditLessonModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    contentType: string;
    duration: string;
  }) => Promise<void> | void;
  initialTitle: string;
  initialContentType?: string;
  initialDuration?: string | number | null;
};

export default function EditLessonModal({
  open,
  onClose,
  onSave,
  initialTitle,
  initialContentType = "TEXT",
  initialDuration = "",
}: EditLessonModalProps) {
  const [title, setTitle] = React.useState(initialTitle);
  const [contentType, setContentType] =
    React.useState<string>(initialContentType);
  const [duration, setDuration] = React.useState<string>(
    String(initialDuration ?? "")
  );
  const [loading, setLoading] = React.useState(false);

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setContentType(initialContentType);
      setDuration(String(initialDuration ?? ""));
    }
  }, [open, initialTitle, initialContentType, initialDuration]);

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await onSave({
        title: title.trim(),
        contentType,
        // 👇 always convert to string first; prevents "trim is not a function"
        duration: String(duration ?? "").trim(),
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit lesson</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium text-slate-600">
              Lesson title
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Live Korean Speaking"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">
              Content type
            </label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              <option value="TEXT">Text</option>
              <option value="VIDEO">Video</option>
              <option value="AUDIO">Audio</option>
              <option value="QUIZ">Quiz</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">
              Duration (minutes)
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30"
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
