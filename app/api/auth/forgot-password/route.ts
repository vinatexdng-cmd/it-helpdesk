import {NextRequest,NextResponse} from "next/server";
import {createHash,randomBytes} from "node:crypto";
import nodemailer from "nodemailer";
import {getPool} from "@/lib/db";

export const runtime="nodejs";

function smtpConfig(){
 const host=process.env.SMTP_HOST;
 const port=Number(process.env.SMTP_PORT||465);
 const user=process.env.SMTP_USER;
 const pass=process.env.SMTP_PASSWORD;
 if(!host||!user||!pass)throw new Error("SMTP chưa được cấu hình đầy đủ trên máy chủ.");
 return {host,port,user,pass,secure:String(process.env.SMTP_SECURE??"true").toLowerCase()==="true"};
}

export async function POST(req:NextRequest){
 try{
  const b=await req.json(),email=String(b.email||"").trim().toLowerCase();
  if(!email)return NextResponse.json({error:"Vui lòng nhập email."},{status:400});
  const p=getPool(),r=await p.query("SELECT id,email,name FROM users WHERE lower(email)=lower($1) AND active=TRUE",[email]);
  const generic={ok:true,message:"Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi đến email đó."};
  if(!r.rowCount)return NextResponse.json(generic);
  const user=r.rows[0],token=randomBytes(32).toString("hex"),hash=createHash("sha256").update(token).digest("hex");
  await p.query("DELETE FROM password_reset_tokens WHERE user_id=$1 OR expires_at<NOW()",[user.id]);
  await p.query("INSERT INTO password_reset_tokens(user_id,token_hash,expires_at) VALUES($1,$2,NOW()+INTERVAL '30 minutes')",[user.id,hash]);
  const origin=(process.env.NEXT_PUBLIC_APP_URL||new URL(req.url).origin).replace(/\/$/,"");
  const resetUrl=`${origin}/reset-password?token=${encodeURIComponent(token)}`;
  const smtp=smtpConfig(),transport=nodemailer.createTransport({host:smtp.host,port:smtp.port,secure:smtp.secure,auth:{user:smtp.user,pass:smtp.pass}});
  const fromAddress=process.env.MAIL_FROM||smtp.user;
  await transport.sendMail({
   from:`"Hệ thống hỗ trợ CNTT Vinatex Đà Nẵng" <${fromAddress}>`,to:user.email,
   subject:"[Vinatex Đà Nẵng] Đặt lại mật khẩu IT Helpdesk",
   text:`Xin chào ${user.name},\n\nHệ thống nhận được yêu cầu đặt lại mật khẩu IT Helpdesk.\n\nMở liên kết sau để tạo mật khẩu mới (hiệu lực 30 phút):\n${resetUrl}\n\nNếu bạn không yêu cầu thay đổi mật khẩu, hãy bỏ qua email này.\n\nHệ thống hỗ trợ CNTT Vinatex Đà Nẵng`,
   html:`<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#17324d"><h2 style="color:#005baa">Đặt lại mật khẩu IT Helpdesk</h2><p>Xin chào <strong>${String(user.name).replace(/[<>&"']/g,"")}</strong>,</p><p>Hệ thống nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p><p style="margin:28px 0"><a href="${resetUrl}" style="background:#0569b5;color:#fff;text-decoration:none;padding:12px 20px;border-radius:7px;font-weight:700">Đặt lại mật khẩu</a></p><p>Liên kết có hiệu lực trong <strong>30 phút</strong> và chỉ sử dụng được một lần.</p><p>Nếu bạn không yêu cầu thay đổi mật khẩu, hãy bỏ qua email này.</p><hr style="border:0;border-top:1px solid #d9e4ee;margin:24px 0"><small>Hệ thống hỗ trợ CNTT Vinatex Đà Nẵng</small></div>`
  });
  return NextResponse.json(generic);
 }catch(e){console.error("[forgot-password]",e);return NextResponse.json({error:"Không thể gửi email đặt lại mật khẩu. Vui lòng liên hệ IT hoặc thử lại sau."},{status:500})}
}
