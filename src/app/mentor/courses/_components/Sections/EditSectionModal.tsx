"use client";

import * as React from "react";
import { FiX } from "react-icons/fi";
import { gqlFetchAuth } from "@/libs/graphql";

const UPDATE_SECTION = `
  mutation UpdateSection($input: SectionUpdate!) {
    updateSection(input: $input) {
      _id
      moduleTitle
      moduleOrder
      updatedAt
    }
  }
`;

type Props = {
  open: boolean;
  onClose: () => void;
  courseId: string; // not used in update, but kept for reload usage
  sectionId: string | null;
  initialTitle: string;
  initialOrder: number;
  onUpdated: () => void;
};

export default function EditSectionModal({
  open,
  onClose,
  courseId,
  sectionId,
  initialTitle,
  initialOrder,
  onUpdated,
}: Props) {
  const [title, setTitle] = React.useState(initialTitle);
  const [order, setOrder] = React.useState<number | "">(initialOrder);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setOrder(initialOrder);
      setErr(null);
      setLoading(false);
    }
  }, [open, initialTitle, initialOrder]);

  if (!open || !sectionId) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!title.trim()) return setErr("Section title is required.");

    const moduleOrder =
      typeof order === "number" ? order : parseInt(String(order || "0"));

    if (!Number.isFinite(moduleOrder) || moduleOrder < 1) {
      return setErr("Order must be ≥ 1.");
    }

    try {
      setLoading(true);

      // Build minimal input based on what changed
      const input: any = {
        _id: sectionId,
        moduleTitle: title.trim(),
      };

      // If order changed, include it
      if (moduleOrder !== initialOrder) {
        input.moduleOrder = moduleOrder;
      }

      await gqlFetchAuth(
        UPDATE_SECTION,
        { input },
        undefined,
        { withCredentials: true }
      );

      onUpdated();
      onClose();
    } catch (e: any) {
      setErr(e.message || "Failed to update section.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Edit Section
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-50">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Section Title
            </label>
            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New title…"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Order</label>
            <input
              type="number"
              min={1}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              value={order}
              onChange={(e) =>
                setOrder(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>

          {err && (
            <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {err}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-60"
            >
              {loading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
