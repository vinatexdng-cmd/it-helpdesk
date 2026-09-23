import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";

export async function POST(req: NextRequest, ctx: { params: Promise<{ ticketNo: string }> }) {
  try {
    const u = await getSession();
    if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { ticketNo } = await ctx.params;
    const b = await req.json();
    if (!b.body?.trim()) return NextResponse.json({ error: "Comment body is required" }, { status: 400 });
    const p = getPool();
    const t = await p.query(u.role === "user" ? "SELECT id FROM tickets WHERE ticket_no=$1 AND requester_email=$2" : "SELECT id FROM tickets WHERE ticket_no=$1", u.role === "user" ? [ticketNo, u.email] : [ticketNo]);
    if (!t.rowCount) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    const c = await p.query("INSERT INTO ticket_comments(ticket_id,author_name,body) VALUES($1,$2,$3) RETURNING *", [t.rows[0].id, u.name, b.body.trim()]);
    await p.query("INSERT INTO audit_logs(ticket_id,actor,action,details) VALUES($1,$2,$3,$4)", [t.rows[0].id, u.email, "Comment added", JSON.stringify({ comment_id: c.rows[0].id })]);
    return NextResponse.json({ comment: c.rows[0] }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 }); }
}
