"use client";
import {useEffect,useState} from "react";
import {usePathname,useRouter} from "next/navigation";
type User={name:string;email:string;role:"user"|"it"|"admin"};
const roleLabel=(r:User["role"])=>r==="admin"?"Quản trị viên":r==="it"?"Nhân viên IT":"Người dùng";
export default function AppNav(){
 const [u,setU]=useState<User|null>(null),router=useRouter(),path=usePathname();
 useEffect(()=>{fetch("/api/auth/me").then(r=>r.ok?r.json():null).then(j=>setU(j?.user||null)).catch(()=>setU(null))},[path]);
 async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.replace("/login");router.refresh()}
 if(!u)return null;
 return <header className="app-nav"><div className="nav-inner"><a className="brand" href="/">Hệ thống hỗ trợ CNTT Vinatex</a><nav><a className={path.startsWith("/tickets")?"active":""} href="/tickets">Yêu cầu hỗ trợ</a><a className={path.startsWith("/knowledge-base")?"active":""} href="/knowledge-base">Kho kiến thức</a>{u.role==="admin"&&<><a className={path.startsWith("/admin/users")?"active":""} href="/admin/users">Người dùng</a><a className={path.startsWith("/admin/sla")?"active":""} href="/admin/sla">Thời hạn xử lý</a></>}</nav><div className="nav-user"><span>{u.name} · {roleLabel(u.role)}</span><button type="button" onClick={logout}>Đăng xuất</button></div></div></header>
}