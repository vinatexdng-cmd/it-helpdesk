"use client";

import {useEffect,useState} from "react";
import {usePathname,useRouter} from "next/navigation";

type User={name:string;email:string;role:"user"|"it"|"admin"};
const roleLabel=(r:User["role"])=>r==="admin"?"Quản trị viên":r==="it"?"Nhân viên CNTT":"Người dùng";

export default function AppNav(){
 const [u,setU]=useState<User|null>(null);
 const router=useRouter();
 const path=usePathname();
 useEffect(()=>{fetch("/api/auth/me").then(r=>r.ok?r.json():null).then(j=>setU(j?.user||null)).catch(()=>setU(null));},[path]);
 async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.replace("/login");router.refresh();}
 if(!u)return null;
 const links=[{href:"/tickets",label:"Yêu cầu hỗ trợ",icon:"🎫"},{href:"/knowledge-base",label:"Kho kiến thức",icon:"📚"},...(u.role==="admin"?[{href:"/admin/users",label:"Người dùng",icon:"👥"},{href:"/admin/sla",label:"Thời hạn xử lý",icon:"⏱"}]:[])];
 return <header className="app-nav"><div className="nav-top"><div className="nav-inner"><a className="brand" href="/" aria-label="Trang chủ Vinatex Đà Nẵng"><span className="brand-logo-wrap"><img className="brand-logo" src="/brand/vinatex-da-nang.png" alt="Vinatex Đà Nẵng"/></span><span className="brand-copy"><strong>VINATEX</strong><small>ĐÀ NẴNG</small></span></a><div className="nav-user"><div className="user-profile"><span className="user-avatar">{u.name?.trim()?.charAt(0)?.toUpperCase()||"U"}</span><span className="user-copy"><strong>{u.name}</strong><small>{roleLabel(u.role)}</small></span></div><button className="logout-button" type="button" onClick={logout}>Đăng xuất</button></div></div></div><div className="nav-menu"><div className="nav-menu-inner"><nav aria-label="Điều hướng chính">{links.map(x=><a key={x.href} className={path.startsWith(x.href)?"active":""} href={x.href}><span className="nav-icon" aria-hidden="true">{x.icon}</span><span>{x.label}</span></a>)}</nav><a className="nav-home-action" href="/tickets/new">＋ Tạo yêu cầu hỗ trợ</a></div></div></header>;
}
