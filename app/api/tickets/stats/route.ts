import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const u = await getSession();
    if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const p = getPool();
    const where = u.role === "user" ? " WHERE requester_email=$1" : "";
    const args = u.role === "user" ? [u.email] : [];
    const [total, statuses, priorities, overdue, recent] = await Promise.all([
      p.query("SELECT COUNT(*)::int AS count FROM tickets" + where, args),
      p.query("SELECT status, COUNT(*)::int AS count FROM tickets" + where + " GROUP BY status ORDER BY count DESC", args),
      p.query("SELECT priority, COUNT(*)::int AS count FROM tickets" + where + " GROUP BY priority ORDER BY CASE priority WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 WHEN 'Normal' THEN 3 WHEN 'Low' THEN 4 ELSE 5 END", args),
      p.query("SELECT COUNT(*)::int AS count FROM tickets" + where + (where ? " AND" : " WHERE") + " sla_due_at IS NOT NULL AND sla_due_at < NOW() AND status NOT IN ('Resolved','Closed')", args),
      p.query("SELECT ticket_no, title, status, priority, unit, created_at, sla_due_at FROM tickets" + where + " ORDER BY created_at DESC LIMIT 8", args),
    ]);
    return NextResponse.json({ total: total.rows[0]?.count ?? 0, statuses: statuses.rows, priorities: priorities.rows, overdue: overdue.rows[0]?.count ?? 0, recent: recent.rows });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 }); }
}
