"use client";
import {useEffect,useState} from "react";
import {usePathname,useRouter} from "next/navigation";
type User={name:string;email:string;role:"user"|"it"|"admin"};
export default function AppNav(){
 const [u,setU]=useState<User|null>(null),router=useRouter(),path=usePathname();
 useEffect(()=>{fetch("/api/auth/me").then(r=>r.ok?r.json():null).then(j=>setU(j?.user||null)).catch(()=>setU(null))},[path]);
 async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.replace("/login");router.refresh()}
 if(!u)return null;
 return <header className="app-nav"><div className="nav-inner"><a className="brand" href="/">Vinatex IT Helpdesk</a><nav><a className={path.startsWith("/tickets")?"active":""} href="/tickets">Ticket</a><a className={path.startsWith("/knowledge-base")?"active":""} href="/knowledge-base">Knowledge Base</a>{u.role==="admin"&&<><a className={path.startsWith("/admin/users")?"active":""} href="/admin/users">Người dùng</a><a className={path.startsWith("/admin/sla")?"active":""} href="/admin/sla">SLA</a></>}</nav><div className="nav-user"><span>{u.name} · {u.role.toUpperCase()}</span><button type="button" onClick={logout}>Đăng xuất</button></div></div></header>
}
