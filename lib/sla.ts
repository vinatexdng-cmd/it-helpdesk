import { getPool } from "@/lib/db";

export async function getSlaDueAt(priority: string, from = new Date()) {
  const r = await getPool().query(
    "SELECT target_minutes FROM sla_policies WHERE priority=$1 AND active=TRUE",
    [priority]
  );
  const minutes = Number(r.rows[0]?.target_minutes ?? 480);
  return new Date(from.getTime() + minutes * 60_000);
}
