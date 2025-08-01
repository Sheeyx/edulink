// /src/app/api/auth/telegram-login/route.ts

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const body = await req.json();

  const token = jwt.sign(body, process.env.NEXTAUTH_SECRET!, {
    expiresIn: "1d",
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set("tg-auth-token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
