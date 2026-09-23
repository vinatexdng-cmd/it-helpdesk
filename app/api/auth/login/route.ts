import { NextRequest, NextResponse } from "next/server";
import { authenticate, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email và mật khẩu là bắt buộc" }, { status: 400 });
    const user = await authenticate(String(email), String(password));
    if (!user) return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
    await createSession(user);
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Login error" }, { status: 500 });
  }
}
