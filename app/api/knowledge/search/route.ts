import { NextRequest, NextResponse } from "next/server";
import { listHelpdeskDocuments } from "@/lib/github";

export const revalidate = 60;

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
}

function snippet(content: string, words: string[]) {
  const text = content.replace(/[#*_>-]/g, " ").replace(/\\s+/g, " ").trim();
  if (!text) return "";
  const lower = normalize(text);
  const positions = words.map(normalize).map(w => lower.indexOf(w)).filter(i => i >= 0);
  const index = positions.length ? Math.min(...positions) : 0;
  const start = Math.max(0, index - 90);
  return (start > 0 ? "… " : "") + text.slice(start, start + 260) + (start + 260 < text.length ? " …" : "");
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  const docs = await listHelpdeskDocuments();
  if (!q) return NextResponse.json({ documents: docs.slice(0, 50), count: docs.length });
  const words = q.split(/\\s+/).filter(Boolean);
  const documents = docs.map(d => {
    const title = normalize(d.title);
    const path = normalize(d.path);
    const content = normalize(d.content || "");
    let score = 0;
    for (const word of words) {
      const w = normalize(word);
      if (title.includes(w)) score += 8;
      if (path.includes(w)) score += 4;
      if (content.includes(w)) score += 2;
    }
    return { ...d, snippet: snippet(d.content || "", words), score };
  }).filter(d => d.score > 0).sort((a, b) => b.score - a.score).slice(0, 50).map(({ score, ...d }) => d);
  return NextResponse.json({ documents, count: documents.length });
}