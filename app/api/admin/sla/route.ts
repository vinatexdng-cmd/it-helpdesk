import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";

const PRIORITIES = ["Critical","High","Normal","Low"];

export async function GET() {
  try {
    const u = await getSession();
    if (!u || u.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const r = await getPool().query("SELECT priority,target_minutes,active,updated_at FROM sla_policies ORDER BY CASE priority WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 WHEN 'Normal' THEN 3 WHEN 'Low' THEN 4 ELSE 5 END");
    return NextResponse.json({ policies: r.rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const u = await getSession();
    if (!u || u.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const b = await req.json();
    const priority = String(b.priority || "");
    const target = Number(b.target_minutes);
    const active = b.active !== false;
    if (!PRIORITIES.includes(priority)) return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    if (!Number.isInteger(target) || target < 1 || target > 525600) return NextResponse.json({ error: "target_minutes must be an integer from 1 to 525600" }, { status: 400 });
    const r = await getPool().query("UPDATE sla_policies SET target_minutes=$1,active=$2,updated_at=NOW() WHERE priority=$3 RETURNING priority,target_minutes,active,updated_at",[target,active,priority]);
    if (!r.rowCount) return NextResponse.json({ error: "SLA policy not found" }, { status: 404 });
    return NextResponse.json({ policy: r.rows[0] });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Database error" }, { status: 500 });
  }
}
