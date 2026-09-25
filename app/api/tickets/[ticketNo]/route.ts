import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";

export async function GET(_: NextRequest, ctx: { params: Promise<{ ticketNo: string }> }) {
  try {
    const u = await getSession();
    if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { ticketNo } = await ctx.params;
    const p = getPool();
    const t = await p.query(u.role === "user" ? "SELECT * FROM tickets WHERE ticket_no=$1 AND requester_email=$2" : "SELECT * FROM tickets WHERE ticket_no=$1", u.role === "user" ? [ticketNo, u.email] : [ticketNo]);
    if (!t.rowCount) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    const [comments, audit] = await Promise.all([p.query("SELECT * FROM ticket_comments WHERE ticket_id=$1 ORDER BY created_at ASC", [t.rows[0].id]),p.query("SELECT * FROM audit_logs WHERE ticket_id=$1 ORDER BY created_at DESC", [t.rows[0].id])]);
    return NextResponse.json({ ticket: t.rows[0], comments: comments.rows, audit: audit.rows });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 }); }
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ ticketNo: string }> }) {
  try {
    const u = await getSession();
    if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (u.role === "user") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { ticketNo } = await ctx.params;
    const b = await req.json();
    const p = getPool(), client = await p.connect();
    try {
      await client.query("BEGIN");
      const current = await client.query("SELECT * FROM tickets WHERE ticket_no=$1 FOR UPDATE", [ticketNo]);
      if (!current.rowCount) { await client.query("ROLLBACK"); return NextResponse.json({ error: "Ticket not found" }, { status: 404 }); }
      const old = current.rows[0];
      const status = b.status ?? old.status, assignee = b.assignee ?? old.assignee;
      const resolution = b.resolution ?? old.resolution, priority = b.priority ?? old.priority;
      const r = await client.query("UPDATE tickets SET status=$1,assignee=$2,resolution=$3,priority=$4,updated_at=NOW() WHERE ticket_no=$5 RETURNING *", [status, assignee || null, resolution || null, priority, ticketNo]);
      const ticket = r.rows[0];
      const changes: Record<string, { from: unknown; to: unknown }> = {};
      for (const k of ["status","assignee","resolution","priority"]) if (old[k] !== ticket[k]) changes[k] = { from: old[k], to: ticket[k] };
      if (Object.keys(changes).length) await client.query("INSERT INTO audit_logs(ticket_id,actor,action,details) VALUES($1,$2,$3,$4::jsonb)", [ticket.id, u.email, "Ticket updated", JSON.stringify(changes)]);

      // Assignment notification: assignee can be stored as email or display name. Resolve against users.
      if (ticket.assignee && ticket.assignee !== old.assignee) {
        await client.query(`INSERT INTO notifications(recipient_email,actor_email,type,title,message,link,ticket_id)
          SELECT staff.email,$1::varchar,'TICKET_ASSIGNED'::varchar,$2::varchar,$3::text,$4::text,$5::uuid
          FROM users staff
          WHERE staff.active=TRUE AND lower(staff.role)='it'
            AND (lower(staff.email)=lower($6::varchar) OR lower(staff.name)=lower($6::varchar))
            AND lower(staff.email)<>lower($1::varchar)`,
          [u.email,`Bạn được giao xử lý ${ticket.ticket_no}`,`Ticket “${ticket.title}” đã được ${u.name||u.email} giao cho bạn xử lý. Mức ưu tiên: ${ticket.priority}.`,`/tickets/${encodeURIComponent(ticket.ticket_no)}`,ticket.id,String(ticket.assignee)]);
      }

      // Notify requester whenever IT finishes/resolves/closes the ticket.
      const completed = ["Resolved","Closed"].includes(ticket.status) && ticket.status !== old.status;
      if (completed && ticket.requester_email && ticket.requester_email.toLowerCase() !== u.email.toLowerCase()) {
        const doneText = ticket.status === "Closed" ? "đã được đóng" : "đã được xử lý";
        const resolutionText = String(ticket.resolution || "").trim();
        await client.query(`INSERT INTO notifications(recipient_email,actor_email,type,title,message,link,ticket_id)
          VALUES($1::varchar,$2::varchar,'TICKET_COMPLETED'::varchar,$3::varchar,$4::text,$5::text,$6::uuid)`,
          [ticket.requester_email,u.email,`${ticket.ticket_no} ${doneText}`,`Yêu cầu “${ticket.title}” ${doneText}.${resolutionText?` Kết quả xử lý: ${resolutionText}`:""}`,`/tickets/${encodeURIComponent(ticket.ticket_no)}`,ticket.id]);
      }

      await client.query("COMMIT");
      return NextResponse.json({ ticket });
    } catch(e){ await client.query("ROLLBACK"); throw e; } finally { client.release(); }
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 }); }
}
