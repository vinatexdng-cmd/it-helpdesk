"use client";

import {useEffect,useState} from "react";
import {usePathname,useRouter} from "next/navigation";

type User={name:string;email:string;role:"user"|"it"|"admin"};
const roleLabel=(r:User["role"])=>r==="admin"?"Quản trị viên":r==="it"?"Nhân viên CNTT":"Người dùng";

type IconName="ticket"|"book"|"users"|"clock"|"plus";
function NavIcon({name}:{name:IconName}){
 const common={width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round" as const,strokeLinejoin:"round" as const,"aria-hidden":true};
 if(name==="ticket")return <svg {...common}><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5V9a2 2 0 0 0 0 4v4.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5V13a2 2 0 0 0 0-4Z"/><path d="M9 8h6M9 12h4"/></svg>;
 if(name==="book")return <svg {...common}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a2 2 0 0 1 2 2v15a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17a2 2 0 0 1 2-2h2.5a2.5 2.5 0 0 1 2.5 2.5Z"/></svg>;
 if(name==="users")return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
 if(name==="clock")return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
 return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
}

export default function AppNav(){
 const [u,setU]=useState<User|null>(null);
 const router=useRouter();
 const path=usePathname();
 useEffect(()=>{fetch("/api/auth/me").then(r=>r.ok?r.json():null).then(j=>setU(j?.user||null)).catch(()=>setU(null));},[path]);
 async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.replace("/login");router.refresh();}
 if(!u)return null;
 const links:[string,string,IconName][]=[["/tickets","Yêu cầu hỗ trợ","ticket"],["/knowledge-base","Kho kiến thức","book"],...(u.role==="admin"?[["/admin/users","Người dùng","users"],["/admin/sla","Thời hạn xử lý","clock"]] as [string,string,IconName][]):[]];
 return <header className="app-nav"><div className="nav-top"><div className="nav-inner"><a className="brand" href="/" aria-label="Trang chủ Vinatex Đà Nẵng"><span className="brand-logo-wrap"><img className="brand-logo" src="/brand/vinatex-da-nang.png" alt="Vinatex Đà Nẵng"/></span><span className="brand-copy"><strong>VINATEX</strong><small>ĐÀ NẴNG</small></span></a><div className="nav-user"><div className="user-profile"><span className="user-avatar">{u.name?.trim()?.charAt(0)?.toUpperCase()||"U"}</span><span className="user-copy"><strong>{u.name}</strong><small>{roleLabel(u.role)}</small></span></div><button className="logout-button" type="button" onClick={logout}>Đăng xuất</button></div></div></div><div className="nav-menu"><div className="nav-menu-inner"><nav aria-label="Điều hướng chính">{links.map(([href,label,icon])=><a key={href} className={path.startsWith(href)?"active":""} href={href}><span className="nav-icon"><NavIcon name={icon}/></span><span>{label}</span></a>)}</nav><a className="nav-home-action" href="/tickets/new"><NavIcon name="plus"/> <span>Tạo yêu cầu hỗ trợ</span></a></div></div></header>;
}
