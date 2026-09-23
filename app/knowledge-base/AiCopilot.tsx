"use client";
import { useState } from "react";

type Source={title:string;path:string;type:string;url:string};
type Turn={role:"user"|"assistant";content:string};

const quickQuestions=["Máy tính không vào được WiFi phải xử lý thế nào?","Không có Internet nhưng WiFi vẫn kết nối, kiểm tra gì?","Máy in không in được, tôi cần kiểm tra những gì?"];

function draftCategory(text:string){
 const s=text.toLowerCase();
 if(/wifi|internet|mạng|dns|network/.test(s))return "Network";
 if(/printer|máy in|in ấn/.test(s))return "Printer";
 if(/email|outlook|mail/.test(s))return "Email";
 if(/mật khẩu|password|tài khoản|đăng nhập/.test(s))return "Account";
 if(/virus|malware|phishing|bảo mật/.test(s))return "Security";
 if(/máy tính|laptop|pc|màn hình|bàn phím|chuột/.test(s))return "Hardware";
 return "Other";
}

export default function AiCopilot(){
 const [question,setQuestion]=useState("");
 const [turns,setTurns]=useState<Turn[]>([]);
 const [sources,setSources]=useState<Source[]>([]);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState("");
 const [ticketMsg,setTicketMsg]=useState("");

 async function ask(q=question){
   const value=q.trim(); if(!value||loading)return;
   setLoading(true);setError("");setTicketMsg("");
   const next=[...turns,{role:"user" as const,content:value}];
   try{
     const r=await fetch("/api/ai/copilot",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:value,history:turns})});
     const j=await r.json(); if(!r.ok)throw new Error(j.error||"Không thể gọi AI");
     setTurns([...next,{role:"assistant",content:j.answer||""}]);
     setSources(j.sources||[]);
     setQuestion("");
   }catch(e){setError(e instanceof Error?e.message:"Có lỗi xảy ra");}
   finally{setLoading(false);}
 }
 async function createTicket(){
   const lastUser=[...turns].reverse().find(x=>x.role==="user")?.content||"Yêu cầu hỗ trợ IT";
   const lastAnswer=[...turns].reverse().find(x=>x.role==="assistant")?.content||"";
   setTicketMsg("Đang tạo Ticket...");
   try{
     const r=await fetch("/api/tickets",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
       title:lastUser.slice(0,255),
       description:"Câu hỏi nhân viên:\n"+lastUser+"\n\nHướng dẫn Copilot:\n"+lastAnswer,
       category:draftCategory(lastUser+" "+lastAnswer),
       priority:"Normal"
     })});
     const j=await r.json(); if(!r.ok)throw new Error(j.error||"Không thể tạo Ticket");
     setTicketMsg("Đã tạo "+j.ticket.ticket_no+" · Mở Ticket để IT tiếp tục xử lý.");
   }catch(e){setTicketMsg(e instanceof Error?e.message:"Không thể tạo Ticket");}
 }
 return <section className="ai-box kb-copilot">
   <div className="kb-copilot-head"><div><strong>🤖 AI Copilot · Trợ lý IT</strong><p>Hỏi sự cố, trao đổi tiếp theo từng bước và tạo Ticket khi cần. Copilot chỉ sử dụng Knowledge Base được phép truy cập.</p></div></div>
   {turns.length===0&&<div className="kb-quick">{quickQuestions.map(q=><button key={q} type="button" onClick={()=>ask(q)}>{q}</button>)}</div>}
   {turns.length>0&&<div className="kb-chat">{turns.map((t,i)=><div key={i} className={"kb-msg "+t.role}><div className="kb-msg-label">{t.role==="user"?"Bạn":"Copilot"}</div><div className="kb-msg-body">{t.content}</div></div>)}</div>}
   <div className="kb-question"><textarea value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();ask();}}} placeholder="Ví dụ: Máy tính không vào được WiFi phải xử lý thế nào?" aria-label="Câu hỏi cho AI Copilot"/><button type="button" onClick={()=>ask()} disabled={loading||!question.trim()}>{loading?"Đang xử lý...":"Hỏi AI"}</button></div>
   {error&&<div className="kb-ai-error">{error}</div>}
   {turns.length>0&&<div className="kb-actions"><button type="button" onClick={createTicket}>🎫 Tạo Ticket từ cuộc trao đổi</button><button type="button" className="kb-secondary" onClick={()=>{setTurns([]);setSources([]);setError("");setTicketMsg("");}}>Cuộc hội thoại mới</button></div>}
   {ticketMsg&&<div className="notice">{ticketMsg}</div>}
   {sources.length>0&&<div className="ai-sources"><strong>📚 Nguồn Knowledge Base được truy xuất</strong>{sources.map(s=><a key={s.path} href={"/knowledge-base/document?path="+encodeURIComponent(s.path)}>{s.title} · {s.type}</a>)}</div>}
 </section>;
}
