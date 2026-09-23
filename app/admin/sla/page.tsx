"use client";
import { useEffect, useState } from "react";
type Policy={priority:string;target_minutes:number;active:boolean;updated_at:string};
const order=["Critical","High","Normal","Low"];
function formatMinutes(n:number){const d=Math.floor(n/1440),h=Math.floor((n%1440)/60),m=n%60;return [d?d+" ngày":"",h?h+" giờ":"",m?m+" phút":"",(!d&&!h&&!m)?"0 phút":""].filter(Boolean).join(" ")}
export default function SlaAdmin(){
  const [rows,setRows]=useState<Policy[]>([]),[error,setError]=useState(""),[saving,setSaving]=useState("");
  async function load(){const r=await fetch("/api/admin/sla");const j=await r.json();if(!r.ok){setError(j.error||"Không thể tải SLA");return}setRows(j.policies||[])}
  useEffect(()=>{load()},[]);
  function change(priority:string,key:"target_minutes"|"active",value:number|boolean){setRows(x=>x.map(p=>p.priority===priority?{...p,[key]:value}:p))}
  async function save(p:Policy){setSaving(p.priority);setError("");const r=await fetch("/api/admin/sla",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({priority:p.priority,target_minutes:p.target_minutes,active:p.active})});const j=await r.json();if(!r.ok)setError(j.error||"Không thể lưu SLA");else setRows(x=>x.map(v=>v.priority===p.priority?j.policy:v));setSaving("")}
  return <main className="container"><div className="hero"><span className="eyebrow">Administration</span><h1>Quản trị SLA</h1><p>Cấu hình thời gian mục tiêu theo mức độ ưu tiên. SLA mới áp dụng cho Ticket được tạo sau khi lưu.</p><a className="button" href="/tickets">← Danh sách Ticket</a></div>
  {error&&<div className="notice">{error}</div>}
  <section className="panel"><div className="table-wrap"><table><thead><tr><th>Priority</th><th>Mục tiêu (phút)</th><th>Hiển thị</th><th>Thời gian</th><th></th></tr></thead><tbody>{order.map(k=>{const p=rows.find(x=>x.priority===k);if(!p)return <tr key={k}><td>{k}</td><td colSpan={4}>Chưa có cấu hình</td></tr>;return <tr key={k}><td><strong>{p.priority}</strong></td><td><input className="inline-input" type="number" min="1" max="525600" value={p.target_minutes} onChange={e=>change(k,"target_minutes",Number(e.target.value))}/></td><td><label className="check"><input type="checkbox" checked={p.active} onChange={e=>change(k,"active",e.target.checked)}/> Kích hoạt</label></td><td>{formatMinutes(p.target_minutes)}</td><td><button type="button" onClick={()=>save(p)} disabled={saving===p.priority}>{saving===p.priority?"Đang lưu...":"Lưu"}</button></td></tr>})}</tbody></table></div></section></main>
}
