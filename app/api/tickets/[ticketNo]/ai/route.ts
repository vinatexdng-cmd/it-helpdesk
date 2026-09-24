import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getPool } from "@/lib/db";
import { listHelpdeskDocuments, loadMarkdown } from "@/lib/github";

type Doc=Awaited<ReturnType<typeof listHelpdeskDocuments>>[number];
const STOP=new Set(["toi","em","anh","chi","la","bi","va","voi","cua","cho","duoc","khong","mot","nhung","nay","can","ho tro"]);
function normalize(s:string){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9./\\-]+/g," ").replace(/\s+/g," ").trim()}
function terms(input:string){return [...new Set(normalize(input).split(" ").filter(x=>x.length>=2&&!STOP.has(x)))]}
function rank(d:Doc,words:string[],category:string){const title=normalize(d.title),path=normalize(d.path);let n=0;for(const w of words){if(title.includes(w))n+=10;if(path.includes(w))n+=6;}if(path.includes("troubleshooting-cases"))n+=8;if(category&&path.includes(normalize(category)))n+=10;return n}
function priorityHint(ticket:any){const q=normalize([ticket.title,ticket.description,ticket.category].filter(Boolean).join(" "));if(/ransomware|ma hoa file|toan bo|ca nha may|ca don vi|he thong dung/.test(q))return "Critical";if(/ca phong|nhieu nguoi|mat mang|khong lam viec duoc/.test(q))return "High";return ticket.priority||"Normal"}

export async function POST(req:NextRequest){
 try{
  const u=await getSession();if(!u)return NextResponse.json({error:"Unauthorized"},{status:401});
  const {ticketNo}=await req.json();if(!ticketNo)return NextResponse.json({error:"ticketNo is required"},{status:400});
  const apiKey=process.env.AI_API_KEY;if(!apiKey)return NextResponse.json({error:"OpenAI chưa được cấu hình. Hãy khai báo AI_API_KEY trên Vercel."},{status:503});
  const p=getPool();
  const t=await p.query(u.role==="user"?"SELECT * FROM tickets WHERE ticket_no=$1 AND requester_email=$2":"SELECT * FROM tickets WHERE ticket_no=$1",u.role==="user"?[ticketNo,u.email]:[ticketNo]);
  if(!t.rowCount)return NextResponse.json({error:"Không tìm thấy yêu cầu"},{status:404});
  const ticket=t.rows[0];
  const comments=await p.query("SELECT author,body,created_at FROM ticket_comments WHERE ticket_id=$1 ORDER BY created_at ASC",[ticket.id]).catch(()=>({rows:[]}));
  const audits=await p.query("SELECT actor,action,details,created_at FROM audit_logs WHERE ticket_id=$1 ORDER BY created_at ASC",[ticket.id]).catch(()=>({rows:[]}));
  const query=[ticket.title,ticket.description,ticket.category,ticket.asset,ticket.unit,...comments.rows.map((x:any)=>x.body)].filter(Boolean).join(" "),words=terms(query);
  const docs=await listHelpdeskDocuments();
  const candidates=docs.map(d=>({...d,score:rank(d,words,ticket.category||"")})).filter(d=>d.score>0).sort((a,b)=>b.score-a.score).slice(0,6);
  const sources:any[]=[];for(const d of candidates){try{const content=await loadMarkdown(d.path);sources.push({...d,content:content.slice(0,6500)})}catch{}}
  const context=sources.map((d,i)=>`SOURCE ${i+1}\nTitle: ${d.title}\nPath: ${d.path}\nType: ${d.type}\nRelevance: ${d.score}\nContent:\n${d.content}`).join("\n\n---\n\n");
  const base=(process.env.AI_BASE_URL||"https://api.openai.com/v1").replace(/\/$/,""),model=process.env.AI_MODEL||"gpt-5.6-luna",hint=priorityHint(ticket);
  const prompt=`Bạn là Trợ lý kỹ thuật IT Helpdesk Vinatex Đà Nẵng vận hành bởi OpenAI, hỗ trợ nhân viên IT xử lý ticket. Không tự động chạy lệnh, thay đổi cấu hình, đóng ticket hoặc khẳng định nguyên nhân khi chưa đủ bằng chứng. Ưu tiên SOURCE và lịch sử ticket. Nếu đề xuất lệnh kiểm tra, chỉ đưa lệnh chẩn đoán/an toàn có căn cứ; lệnh có rủi ro phải cảnh báo rõ.\n\nHãy trả lời tiếng Việt theo đúng cấu trúc:\n1. TÓM TẮT SỰ CỐ - 2 đến 3 câu.\n2. ĐÁNH GIÁ MỨC ĐỘ - mức hiện tại ${ticket.priority||"Normal"}; gợi ý theo phạm vi ảnh hưởng ${hint}; giải thích ngắn, đây chỉ là đề xuất.\n3. NGUYÊN NHÂN CÓ THỂ - tối đa 4 giả thuyết, sắp theo bằng chứng hiện có; ghi rõ điều cần xác minh.\n4. CHECKLIST CHẨN ĐOÁN - các bước tuần tự, ưu tiên thao tác ít rủi ro.\n5. HƯỚNG XỬ LÝ - gắn từng hướng với kết quả kiểm tra tương ứng.\n6. ĐIỀU KIỆN CHUYỂN CẤP - khi nào cần L2/L3, quản trị mạng, hệ thống hoặc bảo mật.\n7. GỢI Ý PHẢN HỒI NGƯỜI DÙNG - một đoạn ngắn, lịch sự, có thể sao chép gửi người dùng; không tuyên bố đã sửa xong nếu chưa có bằng chứng.\n8. NGUỒN THAM KHẢO - SOURCE thực sự đã dùng.\n\nTICKET:\n${JSON.stringify(ticket)}\n\nBÌNH LUẬN/LỊCH SỬ TRAO ĐỔI:\n${JSON.stringify(comments.rows)}\n\nNHẬT KÝ XỬ LÝ:\n${JSON.stringify(audits.rows)}\n\nKNOWLEDGE BASE:\n${context||"Không tìm thấy tài liệu phù hợp. Hãy nêu rõ giới hạn này."}`;
  const r=await fetch(base+"/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+apiKey},body:JSON.stringify({model,messages:[{role:"system",content:"Bạn là trợ lý kỹ thuật Helpdesk. Đưa ra chẩn đoán có kiểm chứng, ưu tiên an toàn và khả năng truy vết."},{role:"user",content:prompt}],max_completion_tokens:2200})});
  const j=await r.json();if(!r.ok)return NextResponse.json({error:j?.error?.message||"OpenAI provider error"},{status:502});
  const answer=j?.choices?.[0]?.message?.content||"OpenAI không trả về nội dung.";
  return NextResponse.json({answer,priorityHint:hint,sources:sources.map(s=>({title:s.title,path:s.path,type:s.type,url:s.url,relevance:s.score}))});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"OpenAI analysis failed"},{status:500})}
}