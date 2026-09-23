import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const u = await getSession();
    if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const status = req.nextUrl.searchParams.get("status");
    const p = getPool();
    const isUser = u.role === "user";
    const args: string[] = isUser ? [u.email] : [];
    const clauses = isUser ? ["requester_email=$1"] : [];
    if (status && status !== "All") { args.push(status); clauses.push("status=$" + args.length); }
    const sql = "SELECT * FROM tickets" + (clauses.length ? " WHERE " + clauses.join(" AND ") : "") + " ORDER BY created_at DESC";
    const r = await p.query(sql, args);
    return NextResponse.json({ tickets: r.rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const u = await getSession();
    if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const b = await req.json();
    if (!String(b.title || "").trim()) return NextResponse.json({ error: "title is required" }, { status: 400 });
    const p = getPool();
    const client = await p.connect();
    try {
      await client.query("BEGIN");
      const year = new Date().getFullYear();
      const counter = await client.query("INSERT INTO ticket_counters(year,last_number) VALUES($1,1) ON CONFLICT(year) DO UPDATE SET last_number=ticket_counters.last_number+1 RETURNING last_number", [year]);
      const no = "HD-" + year + "-" + String(counter.rows[0].last_number).padStart(6, "0");
      const email = u.role === "user" ? u.email : (b.requester_email || u.email);
      const name = u.role === "user" ? u.name : (b.requester_name || u.name);
      const r = await client.query("INSERT INTO tickets(ticket_no,title,description,requester_name,requester_email,unit,asset,category,priority,status,assignee,sla_due_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,'Open',$10,$11,$12) RETURNING *", [no, String(b.title).trim(), b.description || null, name, email, b.unit || null, b.asset || null, b.category || "Other", b.priority || "Normal", b.assignee || null, b.sla_due_at || null]);
      await client.query("INSERT INTO audit_logs(ticket_id,actor,action,details) VALUES($1,$2,$3,$4)", [r.rows[0].id, u.email, "Ticket created", JSON.stringify({ role: u.role })]);
      await client.query("COMMIT");
      return NextResponse.json({ ticket: r.rows[0] }, { status: 201 });
    } catch (e) { await client.query("ROLLBACK"); throw e; } finally { client.release(); }
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 });
  }
}