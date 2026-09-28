import {NextRequest,NextResponse} from "next/server";
import {getSession} from "@/lib/session";
import {getPool} from "@/lib/db";
import {randomBytes,scryptSync} from "node:crypto";
function hashPassword(password:string){const salt=randomBytes(16);return salt.toString("hex")+":"+scryptSync(password,salt,64).toString("hex")}
export async function POST(req:NextRequest){
 const admin=await getSession();if(!admin)return NextResponse.json({error:"Unauthorized"},{status:401});if(admin.role!=="admin")return NextResponse.json({error:"Chỉ Admin được đặt lại mật khẩu."},{status:403});
 const b=await req.json(),userId=String(b.userId||""),password=String(b.newPassword||"");if(!userId||password.length<8)return NextResponse.json({error:"Tài khoản và mật khẩu mới tối thiểu 8 ký tự là bắt buộc."},{status:400});
 const r=await getPool().query("UPDATE users SET password_hash=$1,updated_at=NOW() WHERE id=$2 RETURNING id,email,name,role",[hashPassword(password),userId]);if(!r.rowCount)return NextResponse.json({error:"Không tìm thấy tài khoản."},{status:404});return NextResponse.json({ok:true,user:r.rows[0]});
}
