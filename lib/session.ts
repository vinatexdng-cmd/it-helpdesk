import { cookies } from "next/headers";
export type Role="user"|"it"|"admin";
export type SessionUser={id:string;email:string;name:string;role:Role};
export const SESSION_COOKIE="vinatex_helpdesk_session";
const TTL=60*60*8;
function b64u(v:string){return btoa(unescape(encodeURIComponent(v))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function decode(v:string){return decodeURIComponent(escape(atob(v.replace(/-/g,"+").replace(/_/g,"/"))))}
async function hmac(value:string,secret:string){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return b64u(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(value)))));}
function secret(){const s=process.env.AUTH_SECRET;if(!s||s.length<32)throw new Error("AUTH_SECRET must be at least 32 characters");return s}
export async function createToken(user:SessionUser){const payload=b64u(JSON.stringify({...user,exp:Math.floor(Date.now()/1000)+TTL}));return payload+"."+await hmac(payload,secret())}
export async function verifyToken(token:string|undefined):Promise<SessionUser|null>{if(!token)return null;const [p,s]=token.split(".");if(!p||!s)return null;try{if(await hmac(p,secret())!==s)return null;const d=JSON.parse(decode(p)) as SessionUser&{exp:number};if(d.exp<Date.now()/1000)return null;return {id:d.id,email:d.email,name:d.name,role:d.role}}catch{return null}}
export async function getSession(){const c=await cookies();return verifyToken(c.get(SESSION_COOKIE)?.value)}
export async function setSession(user:SessionUser){const c=await cookies();c.set(SESSION_COOKIE,await createToken(user),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:TTL})}
export async function clearSession(){const c=await cookies();c.set(SESSION_COOKIE,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0})}
