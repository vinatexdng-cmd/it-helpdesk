import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(_: NextRequest, ctx: { params: Promise<{ ticketNo: string }> }) {
  try {
    const { ticketNo } = await ctx.params;
    const p = getPool();
    const t = await p.query("SELECT * FROM tickets WHERE ticket_no=$1", [ticketNo]);
    if (!t.rowCount) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    const [comments, audit] = await Promise.all([
      p.query("SELECT * FROM ticket_comments WHERE ticket_id=$1 ORDER BY created_at ASC", [t.rows[0].id]),
      p.query("SELECT * FROM audit_logs WHERE ticket_id=$1 ORDER BY created_at DESC", [t.rows[0].id])
    ]);
    return NextResponse.json({ ticket: t.rows[0], comments: comments.rows, audit: audit.rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ ticketNo: string }> }) {
  try {
    const { ticketNo } = await ctx.params;
    const b = await req.json();
    const p = getPool();
    const current = await p.query("SELECT * FROM tickets WHERE ticket_no=$1", [ticketNo]);
    if (!current.rowCount) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    const old = current.rows[0];
    const status = b.status ?? old.status, assignee = b.assignee ?? old.assignee;
    const resolution = b.resolution ?? old.resolution, priority = b.priority ?? old.priority;
    const r = await p.query("UPDATE tickets SET status=$1,assignee=$2,resolution=$3,priority=$4,updated_at=NOW() WHERE ticket_no=$5 RETURNING *",
      [status, assignee || null, resolution || null, priority, ticketNo]);
    const changes: Record<string, { from: unknown; to: unknown }> = {};
    for (const k of ["status","assignee","resolution","priority"]) if (old[k] !== r.rows[0][k]) changes[k] = { from: old[k], to: r.rows[0][k] };
    if (Object.keys(changes).length) await p.query("INSERT INTO audit_logs(ticket_id,actor,action,details) VALUES($1,$2,$3,$4)",
      [r.rows[0].id, b.actor || "IT Helpdesk", "Ticket updated", JSON.stringify(changes)]);
    return NextResponse.json({ ticket: r.rows[0] });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 });
  }
}
