"use client";
import {useEffect,useState} from "react";

type Props={ticketNo:string;status:string;hasResolution:boolean};
type User={role:"user"|"it"|"admin"};

export default function KnowledgeCaseButton({ticketNo,status,hasResolution}:Props){
 const [allowed,setAllowed]=useState(false),[loading,setLoading]=useState(false),[message,setMessage]=useState("");
 useEffect(()=>{fetch("/api/auth/me").then(r=>r.ok?r.json():null).then(d=>{const u=d?.user as User|undefined;setAllowed(!!u&&["it","admin"].includes(u.role))}).catch(()=>setAllowed(false))},[]);
 if(!allowed||status!=="Closed")return null;
 async function generate(){setLoading(true);setMessage("");try{const r=await fetch("/api/knowledge-case-proposals/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ticketNo})});const j=await r.json();if(!r.ok)throw new Error(j.error||"Không thể tạo Case");setMessage(j.existing?"Ticket này đã có Case đề xuất.":"OpenAI đã tạo Case và chuyển sang Chờ duyệt.")}catch(e){setMessage(e instanceof Error?e.message:"Không thể tạo Case")}finally{setLoading(false)}}
 return <div className="knowledge-case-ticket-action"><div><strong>Đưa vào Kho kiến thức</strong><p>OpenAI chuẩn hóa ticket đã đóng thành Case. Case phải được IT/Admin duyệt trước khi xuất bản.</p></div><button type="button" onClick={generate} disabled={loading||!hasResolution}>{loading?"OpenAI đang tạo...":"Tạo Case bằng OpenAI"}</button>{!hasResolution&&<small>Cần nhập và lưu Kết quả xử lý trước khi tạo Case.</small>}{message&&<div className="notice">{message} {message.includes("Case")&&<a href="/admin/knowledge-cases">Mở Case chờ duyệt →</a>}</div>}</div>;
}
