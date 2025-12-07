// src/utils/buildDownloadUrl.ts

export function buildDownloadUrl(relativePath: unknown): string {
  // If it's null, undefined, false, 0, empty → return ""
  if (!relativePath) return "";

  // Safe string conversion
  const pathStr = String(relativePath || "").trim();

  // If after converting it's empty → return ""
  if (!pathStr) return "";

  // If already a full URL → return unchanged
  if (pathStr.startsWith("http://") || pathStr.startsWith("https://")) {
    return pathStr;
  }

  // Remove any leading slashes
  const clean = pathStr.replace(/^\/+/, "");

  const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "");
  const bucket = process.env.NEXT_PUBLIC_B2_BUCKET_NAME;

  if (!base || !bucket) {
    console.warn("⚠️ Missing env vars for download URL:", { base, bucket });
    return clean;
  }

  // Build final URL:
  //  http://host/api/s3/download/<bucket>/<clean>
  return `${base}/api/s3/download/${bucket}/${clean}`;
}
