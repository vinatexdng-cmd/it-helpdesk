import { randomBytes,scrypt as scryptCb,timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { getPool } from "@/lib/db";
import { getSession,clearSession,setSession,Role,SessionUser } from "@/lib/session";
const scrypt=promisify(scryptCb);
export {getSession,clearSession,setSession};
export type {Role,SessionUser};
export async function hashPassword(password:string){if(password.length<8)throw new Error("Password must be at least 8 characters");const salt=randomBytes(16);const derived=await scrypt(password,salt,64) as Buffer;return salt.toString("hex")+":"+derived.toString("hex")}
export async function verifyPassword(password:string,stored:string){try{const [saltHex,hashHex]=stored.split(":");const d=await scrypt(password,Buffer.from(saltHex,"hex"),64) as Buffer;const e=Buffer.from(hashHex,"hex");return e.length===d.length&&timingSafeEqual(e,d)}catch{return false}}
export function normalizeEmail(email:string){return email.trim().toLowerCase()}
export async function authenticate(email:string,password:string):Promise<SessionUser|null>{const r=await getPool().query("SELECT id,email,name,role,active,password_hash FROM users WHERE email=$1",[normalizeEmail(email)]);const u=r.rows[0];if(!u||!u.active||!await verifyPassword(password,u.password_hash))return null;return {id:u.id,email:u.email,name:u.name,role:u.role as Role}}
