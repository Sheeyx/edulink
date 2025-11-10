import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3003";
  const url = base + "/graphql";
  const body = await req.text();

  const r = await fetch(url, {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body,
  });

  const text = await r.text();
  const headers = new Headers(r.headers);
  headers.set("content-type", "application/json");
  return new Response(text, { status: r.status, headers });
}
