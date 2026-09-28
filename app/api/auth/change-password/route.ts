import {NextRequest,NextResponse} from "next/server";
import {getSession} from "@/lib/session";
import {getPool} from "@/lib/db";
import {randomBytes,scryptSync,timingSafeEqual} from "node:crypto";

function verify(password:string,stored:string){try{const [a,b]=stored.split(":");const salt=Buffer.from(a,"hex"),hash=Buffer.from(b,"hex"),check=scryptSync(password,salt,64);return check.length===hash.length&&timingSafeEqual(check,hash)}catch{return false}}
function hashPassword(password:string){const salt=randomBytes(16);return salt.toString("hex")+":"+scryptSync(password,salt,64).toString("hex")}

export async function POST(req:NextRequest){
 const u=await getSession();if(!u)return NextResponse.json({error:"Unauthorized"},{status:401});
 const b=await req.json(),current=String(b.currentPassword||""),next=String(b.newPassword||""),confirm=String(b.confirmPassword||"");
 if(!current||next.length<8)return NextResponse.json({error:"Mật khẩu mới phải có ít nhất 8 ký tự."},{status:400});
 if(next!==confirm)return NextResponse.json({error:"Xác nhận mật khẩu mới không khớp."},{status:400});
 if(current===next)return NextResponse.json({error:"Mật khẩu mới phải khác mật khẩu hiện tại."},{status:400});
 const p=getPool(),r=await p.query("SELECT password_hash FROM users WHERE id=$1 AND active=TRUE",[u.id]);
 if(!r.rowCount||!verify(current,r.rows[0].password_hash))return NextResponse.json({error:"Mật khẩu hiện tại không đúng."},{status:400});
 await p.query("UPDATE users SET password_hash=$1,updated_at=NOW() WHERE id=$2",[hashPassword(next),u.id]);
 return NextResponse.json({ok:true,message:"Đổi mật khẩu thành công."});
}
