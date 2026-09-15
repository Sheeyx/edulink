import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "");
    if (!BACKEND) {
      return NextResponse.json(
        { message: "NEXT_PUBLIC_BACKEND_URL is missing" },
        { status: 500 }
      );
    }

    const { path } = await params;

    const filePath = (path || []).join("/"); // edu-storage/members-images/x.webp
    if (!filePath) {
      return NextResponse.json({ message: "Missing path" }, { status: 400 });
    }

    const targetUrl = `${BACKEND}/api/s3/download/${filePath}`;

    // ✅ DEBUG (server console)
    console.log("➡️ Proxy download:");
    console.log("   req.url:", req.url);
    console.log("   filePath:", filePath);
    console.log("   targetUrl:", targetUrl);

    const range = req.headers.get("range") || undefined;

    const upstream = await fetch(targetUrl, {
      headers: {
        ...(range ? { Range: range } : {}),
      },
      // ✅ Important: do not cache on server fetch; let browser cache response
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "";

    // ✅ If backend returned error JSON/text, return it for debugging
    if (!upstream.ok) {
      const text = await upstream.text();
      console.log("❌ Upstream failed:", upstream.status, contentType);
      console.log("❌ Upstream body:", text);
      return new NextResponse(text, {
        status: upstream.status,
        headers: {
          "content-type": contentType || "text/plain; charset=utf-8",
        },
      });
    }

    const headers = new Headers(upstream.headers);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    // keep range headers if present
    if (range) headers.set("Accept-Ranges", "bytes");

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (err: any) {
    console.error("🔥 Proxy route error:", err);
    return NextResponse.json(
      { message: "Proxy error", details: String(err?.message || err) },
      { status: 500 }
    );
  }
}
