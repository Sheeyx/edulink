// src/app/mentor/lessons/edit/EditLessonDialog.tsx
"use client";

import { EditLessonFormValues } from "@/libs/types/lessons/types";
import * as React from "react";
import { FiX, FiVideo, FiTrash2, FiUpload } from "react-icons/fi";

type Props = {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  values: EditLessonFormValues;
  onChange: <K extends keyof EditLessonFormValues>(
    field: K,
    value: EditLessonFormValues[K]
  ) => void;
  onSubmit: () => void;
  initialVideoUrl?: string;
};

export function EditLessonDialog({
  open,
  onClose,
  loading,
  error,
  values,
  onChange,
  onSubmit,
  initialVideoUrl,
}: Props) {
  if (!open) return null;

  const selectedName = values.newVideoFile?.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Edit Lesson</h2>
            <p className="mt-1 text-xs text-slate-500">
              Update lesson details and manage video.
            </p>
          </div>

          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100">
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-600">Lesson title</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={values.title}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="E.g. Live Korean Speaking"
            />
          </div>

          {/* Content type */}
          <div>
            <label className="block text-xs font-medium text-slate-600">Content type</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={values.contentType}
              onChange={(e) => onChange("contentType", e.target.value)}
            >
              <option value="TEXT">Text</option>
              <option value="VIDEO">Video</option>
              <option value="AUDIO">Audio</option>
              <option value="QUIZ">Quiz</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-medium text-slate-600">
              Duration <span className="text-slate-400">(minutes)</span>
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              value={values.duration}
              onChange={(e) => onChange("duration", e.target.value)}
              placeholder="30"
              inputMode="numeric"
            />
          </div>

          {/* Current video info */}
          {initialVideoUrl ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                  <FiVideo className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-slate-700">Current video</p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500">
                    {initialVideoUrl}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <a
                  href={initialVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white hover:bg-slate-800"
                >
                  Open
                </a>

                <button
                  type="button"
                  onClick={() => onChange("removeVideo", !values.removeVideo)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium border flex items-center gap-1 ${
                    values.removeVideo
                      ? "bg-rose-600 text-white border-rose-600"
                      : "bg-white text-rose-700 border-rose-200 hover:bg-rose-50"
                  }`}
                >
                  <FiTrash2 className="h-3 w-3" />
                  {values.removeVideo ? "Will remove" : "Remove"}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
              No current video.
            </div>
          )}

          {/* Replace video upload */}
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-700 flex items-center gap-2">
                <FiUpload className="h-4 w-4" />
                Replace video (optional)
              </p>
              {selectedName && (
                <span className="text-[11px] text-slate-500 truncate max-w-[220px]">
                  {selectedName}
                </span>
              )}
            </div>

            <input
              type="file"
              accept="video/*"
              className="mt-2 block w-full text-xs"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                onChange("newVideoFile", file);
                if (file) onChange("removeVideo", false); // replace -> don't remove
              }}
            />

            <p className="mt-2 text-[11px] text-slate-500">
              If you upload a new file, it will replace the old one.
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
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
