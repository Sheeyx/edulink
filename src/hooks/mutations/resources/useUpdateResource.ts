"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import { useUploadFilesToB2 } from "@/hooks/useUploadFilesToB2";
import { UPDATE_RESOURCE } from "@/graphql/query/courses/courses";
import type { ResourceType } from "@/libs/enums/course.enums";
import type { UpdateResourceResp, ResourceFromApi } from "@/libs/types/course/types";

export type UpdateResourceValues = {
  _id: string;
  resourceTitle: string;
  resourceType: ResourceType;
  isPublic: boolean;
  newFile?: File | null; // only when replacing the file
};

export function useUpdateResource() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { upload, uploading, uploadError, setUploadError } =
    useUploadFilesToB2({ folder: "course/resources" });

  const updateResource = React.useCallback(
    async (values: UpdateResourceValues): Promise<ResourceFromApi> => {
      const { _id, resourceTitle, resourceType, isPublic, newFile } = values;

      try {
        setLoading(true);
        setError(null);
        setUploadError(null);

        const input: Record<string, unknown> = {
          _id,
          resourceTitle: resourceTitle.trim(),
          resourceType,
          isPublic,
        };

        if (newFile) {
          const [resourceUrl] = await upload([newFile]);
          input.resourceUrl = resourceUrl;
          input.resourceSize = newFile.size;
        }

        const res = await gqlFetchAuth<UpdateResourceResp>(UPDATE_RESOURCE, { input });
        return res.updateResource;
      } catch (err) {
        console.error("Update resource error:", err);
        const msg = err instanceof Error ? err.message : "Failed to update resource";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [upload, setUploadError]
  );

  return {
    updateResource,
    loading: loading || uploading,
    error: error ?? uploadError,
    setError,
  };
}
