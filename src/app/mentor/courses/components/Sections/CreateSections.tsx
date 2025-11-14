"use client";

import * as React from "react";
import { FiX } from "react-icons/fi";
import { gqlFetchAuth } from "@/libs/graphql";

// you can move this to your graphql file later
const CREATE_SECTION = `
  mutation CreateSection($input: SectionInput!) {
    createSection(input: $input) {
      _id
      courseId
      moduleTitle
      moduleOrder
      totalLessons
      sectionStatus
      createdAt
      updatedAt
      lessons {
        _id
        sectionId
        lessonTitle
        lessonContentType
        lessonDuration
        createdAt
        updatedAt
      }
    }
  }
`;

type Props = {
  open: boolean;
  onClose: () => void;
  courseId: string;
  onCreated: () => void; // parent will reload course
};

export default function CreateSectionModal({
  open,
  onClose,
  courseId,
  onCreated,
}: Props) {
  const [title, setTitle] = React.useState("");
  const [order, setOrder] = React.useState<number | "">("");
  const [submitting, setSubmitting] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setTitle("");
      setOrder("");
      setErr(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const moduleOrder =
      typeof order === "number" ? order : parseInt(String(order || "0"), 10);

    if (!title.trim()) return setErr("Please enter a section title.");
    if (!Number.isFinite(moduleOrder) || moduleOrder < 1) {
      return setErr("Order must be 1 or greater.");
    }

    try {
      setSubmitting(true);
      await gqlFetchAuth(
        CREATE_SECTION,
        { input: { courseId, moduleTitle: title.trim(), moduleOrder } },
        undefined,
        { withCredentials: true }
      );
      onCreated();
      onClose();
    } catch (e: any) {
      setErr(e.message || "Failed to create section.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Add Section</h3>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-50">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Section title
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Introduction, Basics, Lesson 1…"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-600">Order</label>
            <input
              type="number"
              min={1}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500"
              value={order}
              onChange={(e) =>
                setOrder(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="1"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              This controls where the section appears in the list.
            </p>
          </div>

          {err && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {err}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
