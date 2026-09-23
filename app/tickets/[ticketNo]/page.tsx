"use client";
import { useEffect, useState } from "react";
import AICopilot from "./AICopilot";
type Ticket=Record<string,any>;
type Comment={id:string;author_name:string;body:string;created_at:string};
type Audit={id:string;actor:string;action:string;details:any;created_at:string};

function auditTitle(action:string){
 if(action==="Ticket created") return "Tạo Ticket";
 if(action==="Ticket updated") return "Cập nhật Ticket";
 if(action==="Comment added") return "Thêm trao đổi";
 return action;
}
function auditIcon(action:string){
 if(action==="Ticket created") return "＋";
 if(action==="Ticket updated") return "↻";
 if(action==="Comment added") return "💬";
 return "•";
}
function auditDetails(a:Audit){
 const d=a.details||{};
 if(a.action==="Ticket created") return <span>Ticket được tạo và bắt đầu tiếp nhận xử lý.</span>;
 if(a.action==="Comment added") return <span>Đã thêm một nội dung trao đổi vào Ticket.</span>;
 const parts:string[]=[];
 if(d.status) parts.push(`Trạng thái: ${d.status.from||"-"} → ${d.status.to||"-"}`);
 if(d.assignee) parts.push(`Phụ trách: ${d.assignee.from||"Chưa phân công"} → ${d.assignee.to||"Chưa phân công"}`);
 if(d.priority) parts.push(`Ưu tiên: ${d.priority.from||"-"} → ${d.priority.to||"-"}`);
 if(d.resolution) parts.push(`Kết quả xử lý: ${d.resolution.to||"-"}`);
 return parts.length ? <ul>{parts.map((x,i)=><li key={i}>{x}</li>)}</ul> : <span>Có thay đổi thông tin Ticket.</span>;
}

export default function TicketDetail({params}:{params:Promise<{ticketNo:string}>}){
 const [ticketNo,setTicketNo]=useState(""),[ticket,setTicket]=useState<Ticket|null>(null),[comments,setComments]=useState<Comment[]>([]),[audit,setAudit]=useState<Audit[]>([]);
 const [status,setStatus]=useState(""),[assignee,setAssignee]=useState(""),[priority,setPriority]=useState(""),[resolution,setResolution]=useState(""),[comment,setComment]=useState(""),[message,setMessage]=useState(""),[saving,setSaving]=useState(false);
 useEffect(()=>{params.then(p=>setTicketNo(p.ticketNo))},[params]);
 const refresh=async()=>{const r=await fetch("/api/tickets/"+encodeURIComponent(ticketNo));const j=await r.json();if(r.ok){setTicket(j.ticket);setComments(j.comments||[]);setAudit(j.audit||[])}else throw new Error(j.error||"Không tìm thấy Ticket")};
 useEffect(()=>{if(!ticketNo)return;refresh().catch(e=>setMessage(e instanceof Error?e.message:"Lỗi tải Ticket"))},[ticketNo]);
 useEffect(()=>{if(ticket){setStatus(ticket.status);setAssignee(ticket.assignee||"");setPriority(ticket.priority);setResolution(ticket.resolution||"")}},[ticket]);
 async function save(){setSaving(true);setMessage("");try{const r=await fetch("/api/tickets/"+encodeURIComponent(ticketNo),{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status,assignee,priority,resolution,actor:"IT Helpdesk"})});const j=await r.json();if(!r.ok)throw new Error(j.error||"Lỗi cập nhật");setMessage("Đã cập nhật Ticket.");await refresh()}catch(e){setMessage(e instanceof Error?e.message:"Lỗi cập nhật")}finally{setSaving(false)}}
 async function addComment(e:React.FormEvent){e.preventDefault();if(!comment.trim())return;const r=await fetch("/api/tickets/"+encodeURIComponent(ticketNo)+"/comments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({body:comment,author_name:"IT Helpdesk"})});const j=await r.json();if(!r.ok){setMessage(j.error||"Lỗi thêm ghi chú");return}setComment("");setMessage("Đã thêm ghi chú.");await refresh()}
 if(!ticket)return <main className="container"><a href="/tickets">← Danh sách Ticket</a><div className="panel"><p>{message||"Đang tải..."}</p></div></main>;
 return <main className="container"><div className="hero"><a href="/tickets">← Danh sách Ticket</a><h1>{ticket.ticket_no}</h1><p>{ticket.title}</p></div>
 <AICopilot ticketNo={ticketNo} onResolution={setResolution}/>
 <div className="detail-grid"><section className="panel"><h2>Thông tin yêu cầu</h2><dl className="detail-list"><dt>Mô tả</dt><dd>{ticket.description||"-"}</dd><dt>Người yêu cầu</dt><dd>{ticket.requester_name||"-"} {ticket.requester_email?"("+ticket.requester_email+")":""}</dd><dt>Đơn vị</dt><dd>{ticket.unit||"-"}</dd><dt>Thiết bị</dt><dd>{ticket.asset||"-"}</dd><dt>Loại</dt><dd>{ticket.category}</dd><dt>Tạo lúc</dt><dd>{new Date(ticket.created_at).toLocaleString("vi-VN")}</dd><dt>SLA</dt><dd>{ticket.sla_due_at?new Date(ticket.sla_due_at).toLocaleString("vi-VN"):"-"}</dd></dl></section>
 <section className="panel form"><h2>Xử lý Ticket</h2><label>Trạng thái<select value={status} onChange={e=>setStatus(e.target.value)}><option>Open</option><option>Assigned</option><option>In Progress</option><option>Resolved</option><option>Closed</option></select></label><label>Phụ trách<input value={assignee} onChange={e=>setAssignee(e.target.value)} placeholder="Tên nhân sự IT"/></label><label>Ưu tiên<select value={priority} onChange={e=>setPriority(e.target.value)}><option>Low</option><option>Normal</option><option>High</option><option>Critical</option></select></label><label>Phương án xử lý / Kết quả<textarea rows={7} value={resolution} onChange={e=>setResolution(e.target.value)} placeholder="Ghi nhận nguyên nhân và cách xử lý..."/></label><button onClick={save} disabled={saving}>{saving?"Đang lưu...":"Lưu cập nhật"}</button>{message&&<div className="notice">{message}</div>}</section></div>
 <div className="detail-grid"><section className="panel"><h2>Trao đổi / Ghi chú</h2><form onSubmit={addComment}><textarea rows={4} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Nhập nội dung trao đổi..."/><br/><button>+ Thêm ghi chú</button></form><div className="timeline">{comments.map(c=><article key={c.id}><strong>{c.author_name}</strong><small>{new Date(c.created_at).toLocaleString("vi-VN")}</small><p>{c.body}</p></article>)}{!comments.length&&<p>Chưa có ghi chú.</p>}</div></section>
 <section className="panel"><div className="history-head"><div><h2>Lịch sử xử lý</h2><p>Toàn bộ các thay đổi và trao đổi của Ticket</p></div><span className="history-count">{audit.length} sự kiện</span></div><div className="audit-timeline">{audit.map(a=><article key={a.id} className="audit-item"><div className="audit-marker">{auditIcon(a.action)}</div><div className="audit-card"><div className="audit-top"><strong>{auditTitle(a.action)}</strong><time>{new Date(a.created_at).toLocaleString("vi-VN")}</time></div><div className="audit-actor">👤 {a.actor}</div><div className="audit-details">{auditDetails(a)}</div></div></article>)}{!audit.length&&<div className="audit-empty"><strong>Chưa có lịch sử xử lý</strong><span>Các thao tác trên Ticket sẽ được ghi nhận tại đây.</span></div>}</div></section></div></main>;
}