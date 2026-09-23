import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";
import { listHelpdeskDocuments, loadMarkdown } from "@/lib/github";

function terms(input:string){return input.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(x=>x.length>=3)}
function score(text:string, words:string[]){const s=text.toLowerCase();return words.reduce((n,w)=>n+(s.includes(w)?1:0),0)}

export async function POST(req:NextRequest){
 try{
  const u=await getSession();
  if(!u)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {ticketNo}=await req.json();
  if(!ticketNo)return NextResponse.json({error:"ticketNo is required"},{status:400});
  const apiKey=process.env.AI_API_KEY;
  if(!apiKey)return NextResponse.json({error:"AI chưa được cấu hình. Hãy khai báo AI_API_KEY trên Vercel."},{status:503});
  const p=getPool();
  const t=await p.query(u.role==="user"?"SELECT * FROM tickets WHERE ticket_no=$1 AND requester_email=$2":"SELECT * FROM tickets WHERE ticket_no=$1",u.role==="user"?[ticketNo,u.email]:[ticketNo]);
  if(!t.rowCount)return NextResponse.json({error:"Ticket not found"},{status:404});
  const ticket=t.rows[0],query=[ticket.title,ticket.description,ticket.category,ticket.asset,ticket.unit].filter(Boolean).join(" "),words=terms(query);
  const docs=await listHelpdeskDocuments();
  const candidates=docs.map(d=>({...d,score:score(d.title+" "+d.path,words)})).sort((a,b)=>b.score-a.score).slice(0,8);
  const sources=[];
  for(const d of candidates){try{const content=await loadMarkdown(d.path);sources.push({...d,content:content.slice(0,7000)})}catch{}}
  const context=sources.map((d,i)=>"SOURCE "+(i+1)+"\nPath: "+d.path+"\nType: "+d.type+"\nContent:\n"+d.content).join("\n\n");
  const base=(process.env.AI_BASE_URL||"https://api.openai.com/v1").replace(/\/$/,""),model=process.env.AI_MODEL||"gpt-4o-mini";
  const prompt="Bạn là AI trợ lý IT Helpdesk nội bộ. Phân tích ticket dựa trên dữ liệu ticket và Knowledge Base được cung cấp. Không khẳng định chắc chắn khi thiếu bằng chứng. Không tự động chạy script. Đề xuất các bước kiểm tra an toàn, hướng xử lý, và nguồn KB liên quan. Trả lời bằng tiếng Việt, có các mục: Nhận định, Nguyên nhân có thể, Các bước kiểm tra, Đề xuất xử lý, Nguồn tham khảo.\nTICKET:\n"+JSON.stringify(ticket)+"\nKNOWLEDGE BASE:\n"+(context||"Không tìm thấy tài liệu phù hợp.");
  const r=await fetch(base+"/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+apiKey},body:JSON.stringify({model,messages:[{role:"system",content:"Bạn là AI Helpdesk. Chỉ sử dụng thông tin được cung cấp và kiến thức chung; ưu tiên tài liệu KB."},{role:"user",content:prompt}],temperature:0.2})});
  const j=await r.json();
  if(!r.ok)return NextResponse.json({error:j?.error?.message||"AI provider error"},{status:502});
  const answer=j?.choices?.[0]?.message?.content||"AI không trả về nội dung.";
  return NextResponse.json({answer,sources:sources.map(s=>({title:s.title,path:s.path,type:s.type,url:s.url}))});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"AI analysis failed"},{status:500})}
}