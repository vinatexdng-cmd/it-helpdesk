"use client";
import { useState } from "react";

export default function AICopilot({ticketNo,onResolution}:{ticketNo:string;onResolution:(v:string)=>void}){
 const [answer,setAnswer]=useState(""),[sources,setSources]=useState<any[]>([]),[loading,setLoading]=useState(false),[error,setError]=useState("");
 async function run(){
  setLoading(true);setError("");
  try{const r=await fetch("/api/tickets/"+encodeURIComponent(ticketNo)+"/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ticketNo})});const j=await r.json();if(!r.ok)throw new Error(j.error||"AI error");setAnswer(j.answer||"");setSources(j.sources||[])}
  catch(e){setError(e instanceof Error?e.message:"AI error")}finally{setLoading(false)}
 }
 return <section className="panel ai-copilot"><h2>🤖 AI Copilot</h2><p>Phân tích Ticket, tìm KB liên quan và đề xuất hướng xử lý.</p><div className="ai-actions"><button type="button" onClick={run} disabled={loading}>{loading?"Đang phân tích...":"Phân tích Ticket"}</button>{answer&&<><button type="button" onClick={()=>onResolution(answer)}>Dùng kết quả làm Resolution</button><button type="button" onClick={()=>navigator.clipboard?.writeText(answer)}>Sao chép</button></>}</div>{error&&<div className="notice">{error}</div>}{answer&&<div className="ai-answer">{answer}</div>}{sources.length>0&&<div className="ai-sources"><strong>Knowledge Base liên quan</strong>{sources.map(s=><a key={s.path} href={s.url} target="_blank" rel="noreferrer">{s.title} — {s.path}</a>)}</div>}</section>
}