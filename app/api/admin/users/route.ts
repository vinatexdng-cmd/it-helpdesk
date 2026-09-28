import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";
import { randomBytes, scryptSync } from "node:crypto";

function hashPassword(password:string){const salt=randomBytes(16);return salt.toString("hex")+":"+scryptSync(password,salt,64).toString("hex")}

export async function GET(){
 const u=await getSession(); if(!u)return NextResponse.json({error:"Unauthorized"},{status:401}); if(u.role!=="admin")return NextResponse.json({error:"Forbidden"},{status:403});
 const r=await getPool().query("SELECT id,email,name,role,active,created_at,updated_at FROM users ORDER BY name,email");
 return NextResponse.json({users:r.rows});
}
export async function POST(req:NextRequest){
 const u=await getSession(); if(!u)return NextResponse.json({error:"Unauthorized"},{status:401}); if(u.role!=="admin")return NextResponse.json({error:"Forbidden"},{status:403});
 const b=await req.json(),email=String(b.email||"").trim().toLowerCase(),name=String(b.name||"").trim(),password=String(b.password||""),role=b.role;
 if(!email||!name||password.length<8||!["user","it","admin"].includes(role))return NextResponse.json({error:"email, name, password >= 8 ký tự và role hợp lệ là bắt buộc"},{status:400});
 const r=await getPool().query("INSERT INTO users(email,name,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id,email,name,role,active,created_at", [email,name,hashPassword(password),role]);
 return NextResponse.json({user:r.rows[0]},{status:201});
}
