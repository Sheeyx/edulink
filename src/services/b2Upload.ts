// src/services/b2Upload.ts

/**
 * Upload one or multiple files to the backend GraphQL upload mutation.
 * Backend: filesUploader(files: [Upload!]!, target: String!): [String!]
 * 
 * IMPORTANT: Your backend Apollo Server MUST have csrfPrevention disabled:
 * 
 * const server = new ApolloServer({
 *   csrfPrevention: false,  // ← ADD THIS LINE TO YOUR BACKEND
 *   // ... rest of your config
 * });
 * 
 * Without this, file uploads will be blocked by CSRF protection.
 */
export async function uploadFilesToB2(
  files: File[],
  target: string,
  token: string
): Promise<string[]> {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendBase) throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");

  const url = backendBase.replace(/\/+$/, "") + "/graphql";

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
    map[String(i)] = [`variables.files.${i}`];  // ✅ Fixed: added array brackets
  });

  const formData = new FormData();
  formData.append("operations", JSON.stringify(operations));
  formData.append("map", JSON.stringify(map));
  files.forEach((file, i) => {
    formData.append(String(i), file);
  });

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Apollo Server's CSRF prevention blocks "simple" (non-preflighted)
        // requests like multipart/form-data uploads unless one of its documented
        // exemption headers is present. This one is allow-listed in the backend's
        // CORS config (main.ts) so it doesn't trigger a preflight failure.
        "apollo-require-preflight": "true",
      },
      body: formData,
      credentials: "include",
    });
  } catch (err) {
    console.error("Upload network error:", err);
    throw new Error("Failed to upload file");
  }

  const text = await res.text();

  if (!res.ok) {
    console.error("Upload HTTP error:", res.status, res.statusText, text);
    throw new Error(`Upload request failed: ${res.status} ${res.statusText}`);  // ✅ Fixed: template literal syntax
  }

  let json: { data?: { filesUploader?: string[] }; errors?: Array<{ message?: string }> };
  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error("Upload JSON parse error:", err, text);
    throw new Error("Invalid JSON response from server");
  }

  if (json.errors?.length) {
    console.error("Upload GraphQL errors:", json.errors);
    throw new Error(json.errors[0].message || "File upload failed");
  }

  return json.data?.filesUploader ?? [];
}

/**
 * Convert B2 key -> full public image URL.
 * If value is already a full URL, just return it.
 */
export function resolveB2ImageUrl(value?: string | null): string {
  if (!value) return "";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT;
  const bucket = process.env.NEXT_PUBLIC_B2_BUCKET_NAME;

  if (!endpoint || !bucket) return value;

  const base = endpoint.replace(/\/+$/, "");
  return `${base}/file/${bucket}/${value}`;
}