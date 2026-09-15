"use client";

import * as React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/Modal";
import { TextInput, FileInput, ErrorAlert } from "@/components/ui/form/FormFields";
import { RESOURCE_TYPE, type ResourceType } from "@/libs/enums/course.enums";
import { useUpdateResource } from "@/hooks/mutations/resources/useUpdateResource";
import { guessResourceType } from "./resourceTypeGuess";
import type { ResourceUI } from "@/libs/types/course/types";

type Props = {
  open: boolean;
  onClose: () => void;
  resource: ResourceUI | null;
  onSuccess?: () => void;
};

export default function EditResourceModal({
  open,
  onClose,
  resource,
  onSuccess,
}: Props) {
  const [resourceTitle, setResourceTitle] = React.useState("");
  const [resourceType, setResourceType] = React.useState<ResourceType>("PDF");
  const [isPublic, setIsPublic] = React.useState(false);
  const [newFile, setNewFile] = React.useState<File | null>(null);

  const { updateResource, loading, error, setError } = useUpdateResource();

  const labelId = "edit-resource-title";

  React.useEffect(() => {
    if (!resource) return;
    setResourceTitle(resource.title);
    setResourceType(resource.type);
    setIsPublic(resource.isPublic);
    setNewFile(null);
    setError(null);
  }, [resource, setError]);

  if (!open || !resource) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    setNewFile(picked);
    if (picked) setResourceType(guessResourceType(picked));
  };

  const resetAndClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!resourceTitle.trim()) {
      setError("Resource title is required.");
      return;
    }

    try {
      await updateResource({
        _id: resource.id,
        resourceTitle,
        resourceType,
        isPublic,
        newFile,
      });
      onSuccess?.();
      resetAndClose();
    } catch {
      // error handled inside hook
    }
  };

  return (
    <Modal open={open} onClose={resetAndClose} labelledBy={labelId}>
      <ModalHeader id={labelId} title="Edit Resource" onClose={resetAndClose} />

      <ModalBody>
        <TextInput
          id="edit-resource-title"
          label="Resource Title"
          required
          value={resourceTitle}
          onChange={(e) => setResourceTitle(e.target.value)}
          disabled={loading}
        />

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Type
          </label>
          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value as ResourceType)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          >
            {RESOURCE_TYPE.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <FileInput
            id="edit-resource-file"
            label="Replace File (optional)"
            onChange={handleFileChange}
            disabled={loading}
          />
          {newFile ? (
            <p className="text-xs text-gray-500">
              {newFile.name} · {(newFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          ) : (
            <p className="text-xs text-gray-400">Leave empty to keep the current file.</p>
          )}
        </div>

        <label className="flex items-center gap-2.5 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 rounded border-gray-300 text-purple-700 focus:ring-purple-500"
          />
          Visible to everyone (not just enrolled students)
        </label>

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
          className="px-4 py-2 rounded-xl bg-purple-700 font-semibold text-white hover:bg-purple-800 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
