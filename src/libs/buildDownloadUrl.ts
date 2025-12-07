// src/utils/buildDownloadUrl.ts
export function buildDownloadUrl(relativePath: string): string {
  if (!relativePath) return "";

  // If already a full URL → return as is
  if (
    relativePath.startsWith("http://") ||
    relativePath.startsWith("https://")
  ) {
    return relativePath;
  }

  // remove leading slash
  const clean = relativePath.replace(/^\/+/, "");

  const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "");
  const bucket = process.env.NEXT_PUBLIC_B2_BUCKET_NAME;

  if (!base || !bucket) return relativePath;

  // Final required format:
  // http://localhost:3003/api/s3/download/edu-storage/members/<fileName>
  return `${base}/api/s3/download/${bucket}/${clean}`;
}
