import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// No NextAuth `withAuth` here. Let your pages/components handle auth.
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

// If you had matchers before, keep them or remove completely.
// Here it's empty to avoid any auth redirects.
export const config = {
  matcher: [],
};
