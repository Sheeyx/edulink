// Revokes the refresh token and clears the httpOnly auth cookies. The
// backend reads the tokens from cookies, so credentials must be included.
export async function logoutRequest(): Promise<void> {
  const backend = (process.env.NEXT_PUBLIC_BACKEND_URL || "").trim().replace(/\/+$/, "");
  const res = await fetch(`${backend}/auth/logout`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Logout failed: HTTP ${res.status}`);
}
