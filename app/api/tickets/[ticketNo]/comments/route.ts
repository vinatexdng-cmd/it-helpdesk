import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function POST(req: NextRequest, ctx: { params: Promise<{ ticketNo: string }> }) {
  try {
    const { ticketNo } = await ctx.params;
    const b = await req.json();
    if (!b.body?.trim()) return NextResponse.json({ error: "Comment body is required" }, { status: 400 });
    const p = getPool();
    const t = await p.query("SELECT id FROM tickets WHERE ticket_no=$1", [ticketNo]);
    if (!t.rowCount) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    const c = await p.query("INSERT INTO ticket_comments(ticket_id,author_name,body) VALUES($1,$2,$3) RETURNING *",
      [t.rows[0].id, b.author_name || "IT Helpdesk", b.body.trim()]);
    await p.query("INSERT INTO audit_logs(ticket_id,actor,action,details) VALUES($1,$2,$3,$4)",
      [t.rows[0].id, b.author_name || "IT Helpdesk", "Comment added", JSON.stringify({ comment_id: c.rows[0].id })]);
    return NextResponse.json({ comment: c.rows[0] }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 });
  }
}
