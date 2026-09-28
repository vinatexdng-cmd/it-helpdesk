import {NextRequest,NextResponse} from "next/server";
import {getPool} from "@/lib/db";
import {setSession} from "@/lib/session";
import {scryptSync,timingSafeEqual} from "node:crypto";
function verify(password:string,stored:string){try{const [a,b]=stored.split(":");const salt=Buffer.from(a,"hex"),hash=Buffer.from(b,"hex"),check=scryptSync(password,salt,64);return check.length===hash.length&&timingSafeEqual(check,hash)}catch{return false}}
export async function POST(req:NextRequest){
 const {email,password}=await req.json();if(!email||!password)return NextResponse.json({error:"Email và mật khẩu là bắt buộc"},{status:400});
 const r=await getPool().query("SELECT id,email,name,role,active,password_hash FROM users WHERE email=$1",[String(email).trim().toLowerCase()]);
 const u=r.rows[0];if(!u||!u.active||!verify(String(password),u.password_hash))return NextResponse.json({error:"Email hoặc mật khẩu không đúng"},{status:401});
 await setSession({id:u.id,email:u.email,name:u.name,role:u.role});return NextResponse.json({user:{id:u.id,email:u.email,name:u.name,role:u.role}});
}
