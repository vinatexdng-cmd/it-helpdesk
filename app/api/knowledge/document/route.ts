import { NextRequest, NextResponse } from "next/server";
import { loadMarkdown, classify } from "@/lib/github";

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  if (!path || !/^(knowledge-base|troubleshooting-cases|scripts)\//.test(path)) {
    return NextResponse.json({ error: "Tài liệu không hợp lệ" }, { status: 400 });
  }
  try {
    const content = await loadMarkdown(path);
    const name = path.split("/").pop() || path;
    return NextResponse.json({
      document: { title: name.replace(/\.[^.]+$/, ""), path, type: classify(path), content },
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Không thể tải tài liệu" }, { status: 404 });
  }
}