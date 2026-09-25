import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";

const REVIEW_STATUSES = ["Pending", "Approved", "Rejected"] as const;

export async function GET() {
  try {
    const user = await getSession();
    if (!user || !["it", "admin"].includes(user.role)) return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
    const pool = getPool();
    const result = await pool.query(`SELECT * FROM knowledge_case_proposals ORDER BY CASE status WHEN 'Pending' THEN 0 WHEN 'Approved' THEN 1 WHEN 'Rejected' THEN 2 ELSE 3 END, created_at DESC LIMIT 200`);
    return NextResponse.json({ proposals: result.rows });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể tải Case đề xuất" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user || !["it", "admin"].includes(user.role)) return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });
    const status = String(body.status || "Pending");
    if (!REVIEW_STATUSES.includes(status as (typeof REVIEW_STATUSES)[number])) return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });

    const pool = getPool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const beforeResult = await client.query(`SELECT status FROM knowledge_case_proposals WHERE id=$1 FOR UPDATE`,[body.id]);
      if (!beforeResult.rowCount) { await client.query("ROLLBACK"); return NextResponse.json({ error: "Không tìm thấy Case" }, { status: 404 }); }
      const previousStatus = String(beforeResult.rows[0].status);

      const result = await client.query(
        `UPDATE knowledge_case_proposals SET title=$2,category=$3,symptoms=$4,root_cause=$5,diagnosis=$6,resolution=$7,verification=$8,escalation=$9,keywords=$10,markdown=$11,status=$12::varchar,reviewed_by=$13,review_note=$14,reviewed_at=CASE WHEN $12::varchar='Approved' OR $12::varchar='Rejected' THEN NOW() ELSE NULL END WHERE id=$1 AND status<>'Published' RETURNING *`,
        [body.id,String(body.title||"").slice(0,255),body.category||"Other",body.symptoms||"",body.root_cause||"",body.diagnosis||"",body.resolution||"",body.verification||"",body.escalation||"",body.keywords||"",body.markdown||"",status,user.email,body.review_note||""]
      );
      if (!result.rowCount) { await client.query("ROLLBACK"); return NextResponse.json({ error: "Case đã được xuất bản" }, { status: 409 }); }
      const proposal = result.rows[0];
      await client.query(`INSERT INTO audit_logs(ticket_id,actor,action,details) VALUES($1,$2,$3,$4::jsonb)`,[proposal.ticket_id,user.email,status==="Approved"?"KNOWLEDGE_CASE_APPROVED":status==="Rejected"?"KNOWLEDGE_CASE_REJECTED":"KNOWLEDGE_CASE_UPDATED",JSON.stringify({proposal_id:proposal.id,ticket_no:proposal.ticket_no,status,previous_status:previousStatus,review_note:body.review_note||""})]);

      if (user.role === "it" && status === "Approved" && previousStatus !== "Approved") {
        await client.query(
          `INSERT INTO notifications(recipient_email,actor_email,type,title,message,link,ticket_id,proposal_id)
           SELECT u.email,$1,'KNOWLEDGE_CASE_WAITING_ADMIN', $2,$3,$4,$5,$6
           FROM users u
           WHERE u.role='admin' AND u.active=TRUE AND lower(u.email)<>lower($1)`,
          [user.email,`Case ${proposal.ticket_no} chờ Admin xem xét`,`Nhân viên CNTT ${user.name || user.email} đã duyệt Case “${proposal.title}”. Vui lòng xem xét duyệt/từ chối và xuất bản vào Kho kiến thức.`,`/admin/knowledge-cases?case=${proposal.id}`,proposal.ticket_id,proposal.id]
        );
      }

      if (user.role === "admin" && (status === "Approved" || status === "Rejected") && proposal.generated_by && proposal.generated_by.toLowerCase() !== user.email.toLowerCase()) {
        const approved = status === "Approved";
        const note = String(body.review_note || "").trim();
        await client.query(
          `INSERT INTO notifications(recipient_email,actor_email,type,title,message,link,ticket_id,proposal_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
          [proposal.generated_by,user.email,approved?"KNOWLEDGE_CASE_APPROVED":"KNOWLEDGE_CASE_REJECTED",approved?`Case ${proposal.ticket_no} đã được Admin duyệt`:`Case ${proposal.ticket_no} đã bị Admin từ chối`,approved?`Case “${proposal.title}” đã được Admin duyệt và có thể xuất bản vào Kho kiến thức.`:`Case “${proposal.title}” đã bị Admin từ chối.${note ? ` Lý do: ${note}` : ""}`,`/admin/knowledge-cases?case=${proposal.id}`,proposal.ticket_id,proposal.id]
        );
      }

      await client.query("COMMIT");
      return NextResponse.json({ proposal });
    } catch (error) { await client.query("ROLLBACK"); throw error; }
    finally { client.release(); }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể cập nhật Case" }, { status: 500 });
  }
}
