"use client";

import { useEffect, useMemo, useState } from "react";

type Ticket={ticket_no:string;title:string;unit:string;category:string;priority:string;status:string;assignee:string|null;sla_due_at:string|null};
const statuses=[["All","Tất cả"],["Open","Mở"],["Assigned","Đã phân công"],["In Progress","Đang xử lý"],["Resolved","Đã giải quyết"],["Closed","Đã đóng"]];
const priorities=[["All","Tất cả"],["Critical","Khẩn cấp"],["High","Cao"],["Normal","Bình thường"],["Low","Thấp"]];
const categories:Record<string,string>={Other:"Khác",Hardware:"Phần cứng",Software:"Phần mềm",Network:"Mạng",Printer:"Máy in",Account:"Tài khoản",Email:"Thư điện tử",Security:"An toàn thông tin"};
const priorityLabel=(x:string)=>priorities.find(p=>p[0]===x)?.[1]||x;
const statusLabel=(x:string)=>statuses.find(s=>s[0]===x)?.[1]||x;
const slug=(x:string)=>x.toLowerCase().replace(/\s+/g,"-");
function slaLabel(x:Ticket){if(!x.sla_due_at||x.status==="Resolved"||x.status==="Closed")return "Đã xử lý";const d=new Date(x.sla_due_at).getTime()-Date.now();return d<0?"Quá thời hạn":d<=3600000?"Sắp quá hạn":"Trong thời hạn"}

export default function Tickets(){
 const [rows,setRows]=useState<Ticket[]>([]),[q,setQ]=useState(""),[status,setStatus]=useState("All"),[priority,setPriority]=useState("All"),[sla,setSla]=useState("All"),[error,setError]=useState("");
 async function load(){const qs=new URLSearchParams();if(status!=="All")qs.set("status",status);if(priority!=="All")qs.set("priority",priority);if(sla!=="All")qs.set("sla",sla);const r=await fetch("/api/tickets?"+qs.toString());const j=await r.json();if(!r.ok){setError(j.error||"Không thể tải danh sách yêu cầu");return}setError("");setRows(j.tickets||[])}
 useEffect(()=>{load()},[status,priority,sla]);
 const filtered=useMemo(()=>rows.filter(x=>Object.values(x).join(" ").toLowerCase().includes(q.toLowerCase())),[rows,q]);
 const stats=useMemo(()=>({total:rows.length,open:rows.filter(x=>["Open","Assigned","In Progress"].includes(x.status)).length,overdue:rows.filter(x=>slaLabel(x)==="Quá thời hạn").length,done:rows.filter(x=>["Resolved","Closed"].includes(x.status)).length}),[rows]);
 return <main className="container tickets-page">
  <div className="page-heading-row"><div className="hero"><span className="eyebrow">Trung tâm hỗ trợ CNTT</span><h1>Yêu cầu hỗ trợ</h1><p>Theo dõi, phân loại và xử lý tập trung các yêu cầu CNTT.</p></div><a className="button page-primary-action" href="/tickets/new">+ Tạo yêu cầu mới</a></div>
  {error&&<div className="notice">{error}</div>}
  <section className="stats-grid" aria-label="Tổng quan yêu cầu"><div className="stat-card"><span>Tổng yêu cầu</span><strong>{stats.total}</strong><small>Trong danh sách hiện tại</small></div><div className="stat-card"><span>Đang xử lý</span><strong>{stats.open}</strong><small>Đang mở hoặc đã phân công</small></div><div className="stat-card stat-warning"><span>Quá thời hạn</span><strong>{stats.overdue}</strong><small>Cần ưu tiên xử lý</small></div><div className="stat-card stat-success"><span>Đã hoàn tất</span><strong>{stats.done}</strong><small>Đã giải quyết hoặc đóng</small></div></section>
  <section className="panel data-panel"><div className="panel-title-row"><div><h2>Danh sách yêu cầu</h2><p>{filtered.length} yêu cầu phù hợp</p></div></div><div className="toolbar ticket-filters"><div className="search-field"><span aria-hidden="true">⌕</span><input className="search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm mã yêu cầu, tiêu đề, đơn vị..."/></div><select aria-label="Trạng thái" value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select><select aria-label="Mức ưu tiên" value={priority} onChange={e=>setPriority(e.target.value)}>{priorities.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select><select aria-label="Thời hạn" value={sla} onChange={e=>setSla(e.target.value)}><option value="All">Tất cả thời hạn</option><option value="overdue">Quá thời hạn</option><option value="soon">Sắp quá hạn</option><option value="ontrack">Trong thời hạn</option></select></div>
  <div className="table-wrap modern-table"><table><thead><tr><th>Mã yêu cầu</th><th>Tiêu đề</th><th>Đơn vị</th><th>Loại</th><th>Ưu tiên</th><th>Trạng thái</th><th>Thời hạn</th><th>Phụ trách</th></tr></thead><tbody>{filtered.map(x=>{const s=slaLabel(x);return <tr key={x.ticket_no}><td><a className="ticket-link" href={"/tickets/"+encodeURIComponent(x.ticket_no)}>{x.ticket_no}</a></td><td><strong className="ticket-title">{x.title}</strong></td><td>{x.unit||"-"}</td><td>{categories[x.category]||x.category}</td><td><span className={"priority-badge priority-"+slug(x.priority)}>{priorityLabel(x.priority)}</span></td><td><span className={"status-badge status-"+slug(x.status)}>{statusLabel(x.status)}</span></td><td><span className={"sla-badge sla-"+(s==="Quá thời hạn"?"overdue":s==="Sắp quá hạn"?"soon":"ok")}>{s}</span></td><td>{x.assignee||<span className="muted">Chưa phân công</span>}</td></tr>})}{!filtered.length&&<tr><td className="empty-cell" colSpan={8}>Không có yêu cầu phù hợp với bộ lọc hiện tại.</td></tr>}</tbody></table></div></section>
 </main>;
}