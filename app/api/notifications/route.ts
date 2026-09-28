import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const pool = getPool();
    const result = await pool.query(
      `SELECT id,type,title,message,link,is_read,created_at,actor_email
       FROM notifications
       WHERE lower(recipient_email)=lower($1)
       ORDER BY created_at DESC
       LIMIT 30`,
      [user.email]
    );
    const unread = result.rows.filter((row) => !row.is_read).length;
    return NextResponse.json({ notifications: result.rows, unread });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể tải thông báo" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const pool = getPool();
    if (body.all) {
      await pool.query(
        `UPDATE notifications SET is_read=TRUE,read_at=COALESCE(read_at,NOW())
         WHERE lower(recipient_email)=lower($1) AND is_read=FALSE`,
        [user.email]
      );
    } else if (body.id) {
      await pool.query(
        `UPDATE notifications SET is_read=TRUE,read_at=COALESCE(read_at,NOW())
         WHERE id=$1 AND lower(recipient_email)=lower($2)`,
        [body.id, user.email]
      );
    } else {
      return NextResponse.json({ error: "Thiếu ID thông báo" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể cập nhật thông báo" }, { status: 500 });
  }
}
