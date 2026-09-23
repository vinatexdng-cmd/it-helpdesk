import { cookies } from "next/headers";
import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { getPool } from "@/lib/db";

const scrypt = promisify(scryptCb);
const COOKIE = "vinatex_helpdesk_session";
const TTL = 60 * 60 * 8;

export type Role = "user" | "it" | "admin";
export type SessionUser = { id: string; email: string; name: string; role: Role };

function b64u(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}
function fromB64u(input: string) {
  return Buffer.from(input, "base64url");
}
async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
  return Buffer.from(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))).toString("base64url");
}
function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be at least 32 characters");
  return value;
}
export async function createSession(user: SessionUser) {
  const payload = b64u(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + TTL }));
  const token = payload + "." + await hmac(payload, secret());
  const store = await cookies();
  store.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: TTL });
}
export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}
export async function verifyToken(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = await hmac(payload, secret());
  if (expected !== signature) return null;
  try {
    const data = JSON.parse(fromB64u(payload).toString("utf8")) as SessionUser & { exp: number };
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    if (!data.id || !data.email || !data.role) return null;
    return { id: data.id, email: data.email, name: data.name, role: data.role };
  } catch { return null; }
}
export async function getSession() {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}
export async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}
export async function requireRole(roles: Role[]) {
  const session = await requireUser();
  if (!roles.includes(session.role)) throw new Error("FORBIDDEN");
  return session;
}
export async function hashPassword(password: string) {
  if (password.length < 8) throw new Error("Password must be at least 8 characters");
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64) as Buffer;
  return salt.toString("hex") + ":" + derived.toString("hex");
}
export async function verifyPassword(password: string, stored: string) {
  try {
    const [saltHex, hashHex] = stored.split(":");
    const derived = await scrypt(password, Buffer.from(saltHex, "hex"), 64) as Buffer;
    const expected = Buffer.from(hashHex, "hex");
    return expected.length === derived.length && timingSafeEqual(expected, derived);
  } catch { return false; }
}
export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
export async function authenticate(email: string, password: string) {
  const p = getPool();
  const r = await p.query("SELECT id,email,name,role,active,password_hash FROM users WHERE email=$1", [normalizeEmail(email)]);
  const user = r.rows[0];
  if (!user || !user.active || !await verifyPassword(password, user.password_hash)) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role as Role };
}
export const SESSION_COOKIE = COOKIE;
