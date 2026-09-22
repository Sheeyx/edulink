// Backend now runs the entire Google OAuth handshake itself (passport-google-oauth20)
// and finishes with a redirect to `${FRONTEND_URL}/home`, so the frontend just needs
// to send the browser to the backend's entry point — no client-side OAuth here.
export function getGoogleAuthUrl(): string {
  const backend = (process.env.NEXT_PUBLIC_BACKEND_URL || "").trim().replace(/\/+$/, "");
  return `${backend}/auth/google`;
}
