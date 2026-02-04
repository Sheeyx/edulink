export function buildDownloadUrl(relativePath: unknown): string {
  if (!relativePath) return "";

  const pathStr = String(relativePath).trim();
  if (!pathStr) return "";

  const bucket = process.env.NEXT_PUBLIC_B2_BUCKET_NAME;
  if (!bucket) return "";

  // ✅ 1) If it's a full backend URL, convert it to proxy path
  // Example:
  //  http://localhost:3003/api/s3/download/edu-storage/members-images/x.webp
  // -> /api/s3/download/edu-storage/members-images/x.webp
  if (pathStr.startsWith("http://") || pathStr.startsWith("https://")) {
    // find "/api/s3/download/" inside
    const marker = "/api/s3/download/";
    const idx = pathStr.indexOf(marker);

    if (idx !== -1) {
      const after = pathStr.slice(idx + marker.length); // edu-storage/...
      return `/api/s3/download/${after}`;
    }

    // external (ui-avatars, google, etc.) return as is
    return pathStr;
  }

  // ✅ 2) Relative key -> proxy
  const clean = pathStr.replace(/^\/+/, "");
  return `/api/s3/download/${bucket}/${clean}`;
}
