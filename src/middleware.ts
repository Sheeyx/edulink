import { NextResponse } from "next/server";

// No NextAuth `withAuth` here. Let your pages/components handle auth.
export function middleware() {
  return NextResponse.next();
}

// If you had matchers before, keep them or remove completely.
// Here it's empty to avoid any auth redirects.
export const config = {
  matcher: [],
};
