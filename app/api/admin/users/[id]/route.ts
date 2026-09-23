import { NextRequest,NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";
import { randomBytes,scryptSync } from "node:crypto";
function hashPassword(p:string){const s=randomBytes(16);return s.toString("hex")+":"+scryptSync(p,s,64).toString("hex")}
export async function PATCH(req:NextRequest,ctx:{params:Promise<{id:string}>}){
 const u=await getSession();if(!u)return NextResponse.json({error:"Unauthorized"},{status:401});if(u.role!=="admin")return NextResponse.json({error:"Forbidden"},{status:403});
 const {id}=await ctx.params,b=await req.json(),p=getPool();
 const current=await p.query("SELECT * FROM users WHERE id=$1",[id]);if(!current.rowCount)return NextResponse.json({error:"User not found"},{status:404});
 const old=current.rows[0],name=b.name??old.name,role=b.role??old.role,active=b.active??old.active,password=String(b.password||"");
 if(!["user","it","admin"].includes(role))return NextResponse.json({error:"Invalid role"},{status:400});
 const r=password.length>=8?await p.query("UPDATE users SET name=$1,role=$2,active=$3,password_hash=$4,updated_at=NOW() WHERE id=$5 RETURNING id,email,name,role,active,updated_at",[name,role,active,hashPassword(password),id]):await p.query("UPDATE users SET name=$1,role=$2,active=$3,updated_at=NOW() WHERE id=$4 RETURNING id,email,name,role,active,updated_at",[name,role,active,id]);
 return NextResponse.json({user:r.rows[0]});
}
