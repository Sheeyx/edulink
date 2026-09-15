"use client";

import * as React from "react";
import { gqlFetchAuth } from "@/libs/graphql";
import { useUploadFilesToB2 } from "@/hooks/useUploadFilesToB2";
import { CREATE_RESOURCE } from "@/graphql/query/courses/courses";
import type { ResourceType } from "@/libs/enums/course.enums";
import type { CreateResourceResp, ResourceFromApi } from "@/libs/types/course/types";

export type CreateResourceValues = {
  courseId: string;
  resourceTitle: string;
  resourceType: ResourceType;
  file: File;
  isPublic: boolean;
};

export function useCreateResource() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { upload, uploading, uploadError, setUploadError } =
    useUploadFilesToB2({ folder: "course/resources" });

  const createResource = React.useCallback(
    async (values: CreateResourceValues): Promise<ResourceFromApi> => {
      const { courseId, resourceTitle, resourceType, file, isPublic } = values;

      try {
        setLoading(true);
        setError(null);
        setUploadError(null);

        const [resourceUrl] = await upload([file]);

        const input = {
          courseId,
          resourceTitle: resourceTitle.trim(),
          resourceType,
          resourceUrl,
          resourceSize: file.size,
          isPublic,
        };

        const res = await gqlFetchAuth<CreateResourceResp>(CREATE_RESOURCE, { input });
        return res.createResource;
      } catch (err) {
        console.error("Create resource error:", err);
        const msg = err instanceof Error ? err.message : "Failed to create resource";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [upload, setUploadError]
  );

  return {
    createResource,
    loading: loading || uploading,
    error: error ?? uploadError,
    setError,
  };
}
