"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Row={status?:string;priority?:string;count:number};
type Recent={ticket_no:string;title:string;status:string;priority:string;unit?:string;created_at:string};
type Stats={total:number;statuses:Row[];priorities:Row[];overdue:number;recent:Recent[]};

const statuses=["Open","Assigned","In Progress","Resolved","Closed"];
const priorities=["Critical","High","Normal","Low"];
const statusLabel=(s:string)=>s==="In Progress"?"Đang xử lý":s==="Assigned"?"Đã phân công":s==="Resolved"?"Đã xử lý":s==="Closed"?"Đã đóng":"Mở";
const priorityLabel=(s:string)=>s==="Critical"?"Khẩn cấp":s==="High"?"Cao":s==="Normal"?"Bình thường":"Thấp";

const portalCards=[
  ["🎫","Yêu cầu hỗ trợ","Tạo yêu cầu mới, mô tả sự cố và gửi trực tiếp đến bộ phận CNTT.","/tickets/new","Tạo yêu cầu"],
  ["🔎","Theo dõi yêu cầu","Tra cứu danh sách yêu cầu, trạng thái xử lý và lịch sử trao đổi.","/tickets","Theo dõi ngay"],
  ["📚","Kho kiến thức","Tra cứu hướng dẫn sử dụng, xử lý sự cố và các câu hỏi thường gặp.","/knowledge-base","Tra cứu kiến thức"],
  ["🛠","Công cụ CNTT","Truy cập các công cụ và tài nguyên hỗ trợ công việc CNTT.","/tools","Mở công cụ"],
];

export default function Home(){
  const [stats,setStats]=useState<Stats|null>(null);
  const [error,setError]=useState("");

  useEffect(()=>{
    fetch("/api/tickets/stats")
      .then(async r=>{const j=await r.json();if(!r.ok)throw new Error(j.error||"Không thể tải số liệu");return j})
      .then(setStats)
      .catch(e=>setError(e instanceof Error?e.message:"Không thể tải số liệu"));
  },[]);

  const sm=useMemo(()=>new Map((stats?.statuses||[]).map(x=>[x.status,x.count])),[stats]);
  const pm=useMemo(()=>new Map((stats?.priorities||[]).map(x=>[x.priority,x.count])),[stats]);
  const ms=Math.max(1,...(stats?.statuses||[]).map(x=>x.count));
  const mp=Math.max(1,...(stats?.priorities||[]).map(x=>x.count));

  return <main className="portal-container">
    <section className="portal-hero">
      <div className="portal-hero-content">
        <div className="vinatex-logo" aria-label="VINATEX">
          <div className="vinatex-logo-mark"><span>VT</span></div>
          <div className="vinatex-logo-word">VINATEX</div>
        </div>
        <div className="portal-kicker">CÔNG TY CỔ PHẦN VINATEX ĐÀ NẴNG</div>
        <h1>CỔNG THÔNG TIN HỖ TRỢ CNTT</h1>
        <p>Một đầu mối tiếp nhận, tra cứu và theo dõi các yêu cầu hỗ trợ công nghệ thông tin dành cho VPCTY và các đơn vị, nhà máy.</p>
        <div className="portal-hero-actions">
          <Link href="/tickets/new" className="portal-primary">＋ Tạo yêu cầu hỗ trợ</Link>
          <Link href="/tickets" className="portal-secondary">Theo dõi yêu cầu →</Link>
        </div>
      </div>
      <div className="portal-hero-side">
        <div className="hero-side-card">
          <span>HỖ TRỢ CNTT</span>
          <strong>Vinatex Đà Nẵng</strong>
          <p>Tiếp nhận và xử lý tập trung các sự cố, yêu cầu dịch vụ CNTT.</p>
          <div className="hero-side-line"/>
          <small>VPCTY • Phù Mỹ • Nghĩa Hành • An Đồn • Dung Quất</small>
        </div>
      </div>
    </section>

    {error&&<div className="notice">Chưa kết nối được cơ sở dữ liệu: {error}</div>}

    <section className="portal-section">
      <div className="portal-section-heading">
        <div><span className="portal-section-kicker">DỊCH VỤ TRỰC TUYẾN</span><h2>Trung tâm hỗ trợ CNTT</h2></div>
        <p>Chọn chức năng bạn cần để bắt đầu.</p>
      </div>
      <div className="portal-function-grid">
        {portalCards.map(([icon,title,desc,href,action])=>
          <Link className="portal-function-card" href={href} key={href}>
            <div className="portal-function-icon">{icon}</div>
            <div className="portal-function-body"><h3>{title}</h3><p>{desc}</p><span>{action} →</span></div>
          </Link>
        )}
      </div>
    </section>

    <section className="portal-dashboard">
      <div className="portal-dashboard-main">
        <div className="portal-section-heading compact">
          <div><span className="portal-section-kicker">TỔNG QUAN</span><h2>Tình hình yêu cầu hỗ trợ</h2></div>
          <Link href="/tickets">Xem tất cả →</Link>
        </div>
        <div className="portal-metrics">
          <div><span>Tổng yêu cầu</span><strong>{stats?.total??"—"}</strong><small>Tất cả yêu cầu hỗ trợ</small></div>
          <div><span>Đang xử lý</span><strong>{(sm.get("Assigned")??0)+(sm.get("In Progress")??0)}</strong><small>Đã phân công và đang xử lý</small></div>
          <div><span>Quá thời hạn</span><strong>{stats?.overdue??0}</strong><small>Chưa giải quyết hoặc đóng</small></div>
          <div><span>Khẩn cấp</span><strong>{pm.get("Critical")??0}</strong><small>Mức độ ưu tiên cao nhất</small></div>
        </div>
        <div className="portal-bars">
          <div className="portal-bar-panel">
            <div className="section-heading"><h3>Trạng thái</h3></div>
            <div className="bar-list">{statuses.map(s=>{const n=sm.get(s)??0;return <div className="bar-row" key={s}><div className="bar-label"><span>{statusLabel(s)}</span><strong>{n}</strong></div><div className="bar-track"><div className="bar-fill" style={{width:(n/ms)*100+"%"}}/></div></div>})}</div>
          </div>
          <div className="portal-bar-panel">
            <div className="section-heading"><h3>Mức độ ưu tiên</h3></div>
            <div className="bar-list">{priorities.map(s=>{const n=pm.get(s)??0;return <div className="bar-row" key={s}><div className="bar-label"><span>{priorityLabel(s)}</span><strong>{n}</strong></div><div className="bar-track"><div className="bar-fill" style={{width:(n/mp)*100+"%"}}/></div></div>})}</div>
          </div>
        </div>
      </div>
    </section>

    <section className="portal-section portal-recent">
      <div className="portal-section-heading compact">
        <div><span className="portal-section-kicker">CẬP NHẬT</span><h2>Yêu cầu mới nhất</h2></div>
        <Link href="/tickets/new" className="portal-outline-button">＋ Tạo yêu cầu</Link>
      </div>
      {stats?.recent?.length?<div className="table-wrap"><table><thead><tr><th>Mã yêu cầu</th><th>Tiêu đề</th><th>Đơn vị</th><th>Trạng thái</th><th>Ưu tiên</th><th>Ngày tạo</th></tr></thead><tbody>{stats.recent.map(t=><tr key={t.ticket_no}><td><Link href={"/tickets/"+encodeURIComponent(t.ticket_no)}>{t.ticket_no}</Link></td><td>{t.title}</td><td>{t.unit||"-"}</td><td>{statusLabel(t.status)}</td><td>{priorityLabel(t.priority)}</td><td>{new Date(t.created_at).toLocaleString("vi-VN")}</td></tr>)}</tbody></table></div>:<p className="muted">Chưa có yêu cầu.</p>}
    </section>

    <footer className="portal-footer">
      <div><strong>HỆ THỐNG HỖ TRỢ CNTT VINATEX ĐÀ NẴNG</strong><span>Cổng hỗ trợ nội bộ • VPCTY và các đơn vị, nhà máy</span></div>
      <Link href="/knowledge-base">Kho kiến thức CNTT →</Link>
    </footer>
  </main>;
}
