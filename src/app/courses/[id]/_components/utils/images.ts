import { buildDownloadUrl } from "@/libs/buildDownloadUrl";

export function normalizeImageSrc(src?: string | null) {
  const FALLBACK = "/images/courses/placeholder.jpg";

  if (!src) return FALLBACK;

  const s = String(src).trim();
  if (!s || s === "null" || s === "undefined") return FALLBACK;

  // If absolute URL → keep it
  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  // Otherwise treat as B2 / storage key
  const url = buildDownloadUrl(s);

  return url || FALLBACK;
}
