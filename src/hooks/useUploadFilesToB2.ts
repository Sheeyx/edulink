// src/hooks/useUploadFilesToB2.ts
"use client";

import * as React from "react";
import { uploadFilesToB2 } from "@/services/b2Upload";

type UseUploadFilesToB2Options = {
  folder: string;
};

export function useUploadFilesToB2({ folder }: UseUploadFilesToB2Options) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const upload = React.useCallback(
    async (files: File[]): Promise<string[]> => {
      if (!files.length) return [];

      setUploading(true);
      setError(null);

      try {
        const urls = await uploadFilesToB2(files, folder);
        return urls;
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : "File upload failed.";
        setError(message);
        throw new Error(message);
      } finally {
        setUploading(false);
      }
    },
    [folder]
  );

  return {
    upload,
    uploading,
    uploadError: error,
    setUploadError: setError,
  };
}
