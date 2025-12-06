// src/services/multiUpload.ts

/**
 * Multi-file upload service for Next.js (browser, client-side).
 *
 * Uses GraphQL multipart request:
 *   mutation FilesUploader($files: [Upload!]!, $target: String!) {
 *     filesUploader(files: $files, target: $target)
 *   }
 *
 * Returns: array of strings (keys/paths) from your backend.
 */

export type UploadProgressCallback = (progress: number) => void; // 0.0 - 1.0

type UploadFilesOptions = {
  files: File[];
  target: string;
  token?: string; // accessToken
  onProgress?: UploadProgressCallback;
};

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Upload multiple files
 */
export function uploadFiles({
  files,
  target,
  token,
  onProgress,
}: UploadFilesOptions): Promise<string[]> {
  if (!BACKEND_BASE) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_BACKEND_URL is not set in environment")
    );
  }

  const url = BACKEND_BASE.replace(/\/+$/, "") + "/graphql";

  // --- Build operations + map (apollo-upload spec) -------------------------
  const operations = {
    query: `
      mutation FilesUploader($files: [Upload!]!, $target: String!) {
        filesUploader(files: $files, target: $target)
      }
    `,
    variables: {
      files: new Array(files.length).fill(null),
      target,
    },
  };

  const map: Record<string, string[]> = {};
  files.forEach((_, i) => {
    map[String(i)] = [`variables.files.${i}`];
  });

  const formData = new FormData();
  formData.append("operations", JSON.stringify(operations));
  formData.append("map", JSON.stringify(map));

  files.forEach((file, i) => {
    // You can customize filename here (uuid, timestamp, etc.)
    formData.append(String(i), file, file.name);
  });

  // --- Use XMLHttpRequest so we can track upload progress ------------------
  return new Promise<string[]>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);

    // headers
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    // Required by Apollo CSRF prevention (and allowed by backend CORS)
    xhr.setRequestHeader("x-apollo-operation-name", "FilesUploader");

    // progress callback
    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = event.loaded / event.total;
          onProgress(progress);
        }
      };
    }

    xhr.onerror = () => {
      reject(new Error("Network error while uploading files"));
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;

      const status = xhr.status;
      const text = xhr.responseText || "";

      if (status !== 200) {
        console.error("Upload HTTP error:", status, text);
        reject(new Error(`Upload failed: ${status}`));
        return;
      }

      let json: any;
      try {
        json = JSON.parse(text);
      } catch (err) {
        console.error("Upload JSON parse error:", err, text);
        reject(new Error("Invalid JSON from server"));
        return;
      }

      if (json.errors?.length) {
        const msg = json.errors[0]?.message || "File upload failed";
        console.error("Upload GraphQL errors:", json.errors);
        reject(new Error(msg));
        return;
      }

      try {
        const urls: string[] = json.data?.filesUploader ?? [];
        resolve(urls);
      } catch (err) {
        reject(new Error("Unexpected response shape from filesUploader"));
      }
    };

    xhr.withCredentials = true; // if backend uses cookies

    xhr.send(formData);
  });
}

/**
 * Upload a single file and get just one key/string back.
 */
export async function uploadFile(options: {
  file: File;
  target: string;
  token?: string;
  onProgress?: UploadProgressCallback;
}): Promise<string> {
  const urls = await uploadFiles({
    files: [options.file],
    target: options.target,
    token: options.token,
    onProgress: options.onProgress,
  });
  return urls[0];
}
