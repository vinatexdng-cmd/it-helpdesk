"use client";

import {useState, type FormEvent} from "react";
import {useRouter} from "next/navigation";

export default function Login(){
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),router=useRouter();

 async function submit(e:FormEvent){
   e.preventDefault();
   setError("");
   const r=await fetch("/api/auth/login",{
     method:"POST",
     headers:{"Content-Type":"application/json"},
     body:JSON.stringify({email,password})
   });
   const j=await r.json();
   if(!r.ok){setError(j.error||"Đăng nhập thất bại");return}
   router.replace("/");
 }

 return (
   <main className="login-page">
     <section className="login-card">
       <div className="login-brand">
         <img src="/brand/vinatex-da-nang.png" alt="Vinatex Đà Nẵng"/>
       </div>
       <span className="eyebrow">Hệ thống hỗ trợ CNTT</span>
       <h1>Đăng nhập</h1>
       <p className="login-subtitle">Sử dụng tài khoản IT Helpdesk được cấp.</p>
       <form className="form" onSubmit={submit}>
         <label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="ten@vinatexdn.com.vn"/></label>
         <label>Mật khẩu<input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Nhập mật khẩu"/></label>
         <button type="submit">Đăng nhập</button>
         {error&&<div className="notice">{error}</div>}
       </form>
       <small className="login-footer">CỔNG THÔNG TIN HỖ TRỢ CNTT VINATEX ĐÀ NẴNG</small>
     </section>
   </main>
 );
}
