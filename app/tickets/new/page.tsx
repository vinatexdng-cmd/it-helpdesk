"use client";
import { useState } from "react";

const UNITS = ["VPCTY","Nhà máy May Phù Mỹ","Nhà máy May Nghĩa Hành","Nhà máy May An Đồn","Nhà máy May Dung Quất"];
const ASSETS = ["Máy tính để bàn","Máy tính xách tay","Máy in","Máy quét","Màn hình","Thiết bị chuyển mạch mạng","Thiết bị phát Wi-Fi","Camera và đầu ghi hình","Máy chủ","Điện thoại và điện thoại IP","Thiết bị khác"];
const CATEGORIES=[["Other","Khác"],["Hardware","Phần cứng"],["Software","Phần mềm"],["Network","Mạng"],["Printer","Máy in"],["Account","Tài khoản"],["Email","Thư điện tử"],["Security","An toàn thông tin"]];
const PRIORITIES=[["Low","Thấp"],["Normal","Bình thường"],["High","Cao"],["Critical","Khẩn cấp"]];

export default function NewTicket(){
 const [form,setForm]=useState({title:"",description:"",requester_name:"",requester_email:"",unit:"",asset:"",category:"Other",priority:"Normal"});
 const [msg,setMsg]=useState("");
 const set=(k:string,v:string)=>setForm({...form,[k]:v});
 async function submit(e:React.FormEvent){e.preventDefault();setMsg("Đang tạo yêu cầu...");const r=await fetch("/api/tickets",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const j=await r.json();setMsg(r.ok?"Đã tạo yêu cầu "+j.ticket.ticket_no:(j.error||"Không thể tạo yêu cầu"))}
 return <main className="container"><div className="hero"><span className="eyebrow">Hệ thống hỗ trợ CNTT</span><h1>Tạo yêu cầu hỗ trợ</h1><p>Nhập thông tin sự cố hoặc yêu cầu dịch vụ CNTT.</p></div>
 <form className="panel form" onSubmit={submit}>
 <label>Tiêu đề<input required value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Ví dụ: Không truy cập được thư mục dùng chung"/></label>
 <label>Mô tả<textarea value={form.description} onChange={e=>set("description",e.target.value)} rows={5} placeholder="Mô tả hiện tượng, thời điểm và thông báo lỗi..."/></label>
 <div className="form-grid">
 <label>Người yêu cầu<input list="requester-list" value={form.requester_name} onChange={e=>set("requester_name",e.target.value)} placeholder="Nhập tên hoặc chọn nhanh"/><datalist id="requester-list"><option value="Người dùng nội bộ"/><option value="Bộ phận CNTT"/></datalist></label>
 <label>Thư điện tử<input type="email" value={form.requester_email} onChange={e=>set("requester_email",e.target.value)} placeholder="ten@vinatexdn.com.vn"/></label>
 <label>Đơn vị/Nhà máy<select value={form.unit} onChange={e=>set("unit",e.target.value)}><option value="">-- Chọn đơn vị/nhà máy --</option>{UNITS.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
 <label>Thiết bị<select value={form.asset} onChange={e=>set("asset",e.target.value)}><option value="">-- Chọn thiết bị --</option>{ASSETS.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
 <label>Loại sự cố<select value={form.category} onChange={e=>set("category",e.target.value)}>{CATEGORIES.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
 <label>Mức độ ưu tiên<select value={form.priority} onChange={e=>set("priority",e.target.value)}>{PRIORITIES.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
 </div><button type="submit">Tạo yêu cầu</button>{msg&&<div className="notice">{msg}</div>}
 </form></main>
}