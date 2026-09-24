import { NextRequest,NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";

function cleanJson(s:string){return s.replace(/^```json\s*/i,"").replace(/```$/i,"").trim()}
export async function POST(req:NextRequest){
 try{
  const u=await getSession();if(!u||!["it","admin"].includes(u.role))return NextResponse.json({error:"Không có quyền"},{status:403});
  const {ticketNo}=await req.json();if(!ticketNo)return NextResponse.json({error:"Thiếu mã yêu cầu"},{status:400});
  const p=getPool(),r=await p.query("SELECT * FROM tickets WHERE ticket_no=$1",[ticketNo]);if(!r.rowCount)return NextResponse.json({error:"Không tìm thấy yêu cầu"},{status:404});
  const t=r.rows[0];if(t.status!=="Closed")return NextResponse.json({error:"Chỉ tạo Case từ yêu cầu đã đóng"},{status:400});if(!String(t.resolution||"").trim())return NextResponse.json({error:"Yêu cầu cần có kết quả xử lý trước khi tạo Case"},{status:400});
  const existing=await p.query("SELECT * FROM knowledge_case_proposals WHERE ticket_id=$1",[t.id]);if(existing.rowCount)return NextResponse.json({proposal:existing.rows[0],existing:true});
  const comments=await p.query("SELECT author_name,body,created_at FROM ticket_comments WHERE ticket_id=$1 ORDER BY created_at",[t.id]);
  const key=process.env.AI_API_KEY;if(!key)return NextResponse.json({error:"AI_API_KEY chưa được cấu hình"},{status:503});
  const base=(process.env.AI_BASE_URL||"https://api.openai.com/v1").replace(/\/$/,""),model=process.env.AI_MODEL||"gpt-5.6-luna";
  const prompt=`Từ ticket Helpdesk đã xử lý thành công dưới đây, hãy tạo một Case kỹ thuật tái sử dụng cho Kho kiến thức Vinatex Đà Nẵng. Không đưa tên, email, dữ liệu cá nhân, mật khẩu, token, IP nhạy cảm hoặc thông tin không cần thiết vào Case. Không bịa nguyên nhân. Nếu ticket chưa chứng minh root cause, ghi "Chưa xác định chắc chắn". Chỉ trả JSON hợp lệ với các khóa: title,category,symptoms,root_cause,diagnosis,resolution,verification,escalation,keywords,markdown. Markdown phải có các mục: Tình huống, Triệu chứng, Nguyên nhân, Kiểm tra, Cách xử lý, Xác nhận khắc phục, Khi nào chuyển cấp, Từ khóa.\n\nTICKET=${JSON.stringify(t)}\nCOMMENTS=${JSON.stringify(comments.rows)}`;
  const ai=await fetch(base+"/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},body:JSON.stringify({model,messages:[{role:"system",content:"Bạn chuẩn hóa tri thức Helpdesk thành Case kỹ thuật. Nội dung phải có thể kiểm chứng và không chứa dữ liệu cá nhân."},{role:"user",content:prompt}],temperature:0.1,max_completion_tokens:1800})});
  const j=await ai.json();if(!ai.ok)return NextResponse.json({error:j?.error?.message||"OpenAI provider error"},{status:502});
  let d:any;try{d=JSON.parse(cleanJson(j?.choices?.[0]?.message?.content||""))}catch{return NextResponse.json({error:"OpenAI trả về Case không đúng định dạng JSON"},{status:502})}
  const ins=await p.query(`INSERT INTO knowledge_case_proposals(ticket_id,ticket_no,title,category,symptoms,root_cause,diagnosis,resolution,verification,escalation,keywords,markdown,generated_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,[t.id,t.ticket_no,String(d.title||t.title).slice(0,255),d.category||t.category||"Other",d.symptoms||"",d.root_cause||"",d.diagnosis||"",d.resolution||t.resolution,d.verification||"",d.escalation||"",d.keywords||"",d.markdown||"",u.email]);
  await p.query("INSERT INTO audit_logs(ticket_id,actor,action,details) VALUES($1,$2,'Knowledge case proposed',$3)",[t.id,u.email,JSON.stringify({proposal_id:ins.rows[0].id})]);
  return NextResponse.json({proposal:ins.rows[0]});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Không thể tạo Case đề xuất"},{status:500})}
}