import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";
import { getSlaDueAt } from "@/lib/sla";

const PRIORITIES = ["Low","Normal","High","Critical"];
const CATEGORIES = ["Other","Hardware","Software","Network","Printer","Account","Email","Security"];

export async function GET(req: NextRequest) {
  try {
    const u = await getSession();
    if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const sp = req.nextUrl.searchParams, status = sp.get("status"), priority = sp.get("priority"), sla = sp.get("sla");
    const p = getPool(), isUser = u.role === "user";
    const args: string[] = isUser ? [u.email] : [], clauses = isUser ? ["requester_email=$1"] : [];
    if (status && status !== "All") { args.push(status); clauses.push("status=$" + args.length); }
    if (priority && priority !== "All") { args.push(priority); clauses.push("priority=$" + args.length); }
    if (sla && sla !== "All") {
      if (sla === "overdue") clauses.push("sla_due_at IS NOT NULL AND sla_due_at < NOW() AND status NOT IN ('Resolved','Closed')");
      if (sla === "soon") clauses.push("sla_due_at IS NOT NULL AND sla_due_at >= NOW() AND sla_due_at <= NOW() + INTERVAL '60 minutes' AND status NOT IN ('Resolved','Closed')");
      if (sla === "ontrack") clauses.push("(sla_due_at IS NULL OR sla_due_at > NOW() + INTERVAL '60 minutes' OR status IN ('Resolved','Closed'))");
    }
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
    const priority = PRIORITIES.includes(b.priority) ? b.priority : "Normal";
    const category = CATEGORIES.includes(b.category) ? b.category : "Other";
    const slaDue = await getSlaDueAt(priority);
    const p = getPool(), client = await p.connect();
    try {
      await client.query("BEGIN");
      const year = new Date().getFullYear();
      const counter = await client.query("INSERT INTO ticket_counters(year,last_number) VALUES($1,1) ON CONFLICT(year) DO UPDATE SET last_number=ticket_counters.last_number+1 RETURNING last_number", [year]);
      const no = "HD-" + year + "-" + String(counter.rows[0].last_number).padStart(6, "0");
      const email = u.role === "user" ? u.email : (b.requester_email || u.email);
      const name = u.role === "user" ? u.name : (b.requester_name || u.name);
      const r = await client.query("INSERT INTO tickets(ticket_no,title,description,requester_name,requester_email,unit,asset,category,priority,status,assignee,sla_due_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,'Open',$10,$11) RETURNING *", [no,title,b.description||null,name,email,b.unit||null,b.asset||null,category,priority,b.assignee||null,slaDue]);
      const ticket = r.rows[0];
      await client.query("INSERT INTO audit_logs(ticket_id,actor,action,details) VALUES($1,$2,$3,$4)", [ticket.id,u.email,"Ticket created",JSON.stringify({role:u.role,sla_due_at:slaDue.toISOString()})]);

      // A new ticket is an operational event: notify every active IT/Admin account so it can be triaged and assigned.
      const priorityLabel: Record<string,string> = {Low:"Thấp",Normal:"Bình thường",High:"Cao",Critical:"Khẩn cấp"};
      const unitText = String(ticket.unit || "Chưa xác định đơn vị");
      const message = `${name} vừa gửi yêu cầu ${ticket.ticket_no}: “${ticket.title}”. Đơn vị: ${unitText}. Mức ưu tiên: ${priorityLabel[priority] || priority}. Vui lòng kiểm tra, phân loại và giao người phụ trách.`;
      await client.query(
        `INSERT INTO notifications(recipient_email,actor_email,type,title,message,link,ticket_id)
         SELECT staff.email,$1,'NEW_TICKET',$2,$3,$4,$5
         FROM users staff
         WHERE lower(staff.role) IN ('it','admin')
           AND staff.active=TRUE
           AND lower(staff.email)<>lower($1)`,
        [u.email,`Yêu cầu mới ${ticket.ticket_no}`,message,`/tickets/${encodeURIComponent(ticket.ticket_no)}`,ticket.id]
      );

      await client.query("COMMIT");
      return NextResponse.json({ ticket }, { status: 201 });
    } catch (e) { await client.query("ROLLBACK"); throw e; } finally { client.release(); }
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 }); }
}
