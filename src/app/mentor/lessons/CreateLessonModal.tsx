// app/mentor/courses/[id]/components/Lessons/CreateLessonModal.tsx
"use client";

import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { gqlFetchAuth } from "@/libs/graphql";

const CREATE_LESSON = `
  mutation CreateLesson($input: LessonInput!) {
    createLesson(input: $input) {
      _id
      sectionId
      lessonTitle
      lessonContentType
      lessonDuration
      createdAt
      updatedAt
    }
  }
`;

type Props = {
  open: boolean;
  onClose: () => void;
  sectionId: string;
  onSuccess?: () => void;
};

export default function CreateLessonModal({ open, onClose, sectionId, onSuccess }: Props) {
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContentType, setLessonContentType] = useState("TEXT");
  const [lessonDuration, setLessonDuration] = useState<number>(0);
  const [lessonUrl, setLessonUrl] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
  try {
    setLoading(true);

    await gqlFetchAuth<{ createLesson: any }>(
      CREATE_LESSON,
      {
        input: {
          sectionId,
          lessonTitle,
          lessonContentType,
          lessonDuration,
          lessonUrl,
        },
      }
    );

    if (onSuccess) onSuccess();
    onClose();
  } catch (err) {
    console.error("Create lesson error:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Lesson</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="font-medium">Lesson Title</label>
            <input
              type="text"
              className="w-full mt-1 rounded-lg border px-3 py-2"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium">Content Type</label>
            <select
              className="w-full mt-1 border rounded-lg px-3 py-2"
              value={lessonContentType}
              onChange={(e) => setLessonContentType(e.target.value)}
            >
              <option value="TEXT">TEXT</option>
              <option value="VIDEO">VIDEO</option>
              <option value="AUDIO">AUDIO</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Duration (minutes)</label>
            <input
              type="number"
              className="w-full mt-1 rounded-lg border px-3 py-2"
              value={lessonDuration}
              onChange={(e) => setLessonDuration(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="font-medium">Lesson URL (optional)</label>
            <input
              type="text"
              className="w-full mt-1 rounded-lg border px-3 py-2"
              value={lessonUrl}
              onChange={(e) => setLessonUrl(e.target.value)}
              placeholder="https://zoom.us/j/123456789"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}
