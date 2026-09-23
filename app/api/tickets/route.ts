import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";
import { getSlaDueAt } from "@/lib/sla";

export async function GET(req: NextRequest) {
  try {
    const u = await getSession();
    if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const status = req.nextUrl.searchParams.get("status");
    const p = getPool(), isUser = u.role === "user";
    const args: string[] = isUser ? [u.email] : [], clauses = isUser ? ["requester_email=$1"] : [];
    if (status && status !== "All") { args.push(status); clauses.push("status=$" + args.length); }
    const r = await p.query("SELECT * FROM tickets" + (clauses.length ? " WHERE " + clauses.join(" AND ") : "") + " ORDER BY created_at DESC", args);
    return NextResponse.json({ tickets: r.rows });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const u = await getSession();
    if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const b = await req.json(), title = String(b.title || "").trim();
    if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });
    if (title.length > 255) return NextResponse.json({ error: "title is too long" }, { status: 400 });
    const priority = ["Low","Normal","High","Critical"].includes(b.priority) ? b.priority : "Normal";
    const slaDue = b.sla_due_at ? new Date(b.sla_due_at) : await getSlaDueAt(priority);
    if (Number.isNaN(slaDue.getTime())) return NextResponse.json({ error: "Invalid sla_due_at" }, { status: 400 });
    const p = getPool(), client = await p.connect();
    try {
      await client.query("BEGIN");
      const year = new Date().getFullYear();
      const counter = await client.query("INSERT INTO ticket_counters(year,last_number) VALUES($1,1) ON CONFLICT(year) DO UPDATE SET last_number=ticket_counters.last_number+1 RETURNING last_number", [year]);
      const no = "HD-" + year + "-" + String(counter.rows[0].last_number).padStart(6, "0");
      const email = u.role === "user" ? u.email : (b.requester_email || u.email);
      const name = u.role === "user" ? u.name : (b.requester_name || u.name);
      const r = await client.query("INSERT INTO tickets(ticket_no,title,description,requester_name,requester_email,unit,asset,category,priority,status,assignee,sla_due_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,'Open',$10,$11,$12) RETURNING *", [no,title,b.description||null,name,email,b.unit||null,b.asset||null,b.category||"Other",priority,b.assignee||null,slaDue]);
      await client.query("INSERT INTO audit_logs(ticket_id,actor,action,details) VALUES($1,$2,$3,$4)", [r.rows[0].id,u.email,"Ticket created",JSON.stringify({role:u.role,sla_due_at:slaDue.toISOString()})]);
      await client.query("COMMIT");
      return NextResponse.json({ ticket: r.rows[0] }, { status: 201 });
    } catch (e) { await client.query("ROLLBACK"); throw e; } finally { client.release(); }
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 }); }
}
