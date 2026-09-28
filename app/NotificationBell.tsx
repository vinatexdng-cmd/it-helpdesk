"use client";
import {useEffect,useRef,useState} from "react";
import {useRouter} from "next/navigation";
import styles from "./NotificationBell.module.css";

type Notification={id:string;title:string;message:string;link?:string|null;is_read:boolean;created_at:string};
export default function NotificationBell(){
 const[items,setItems]=useState<Notification[]>([]),[unread,setUnread]=useState(0),[open,setOpen]=useState(false);const ref=useRef<HTMLDivElement>(null),router=useRouter();
 async function load(){try{const r=await fetch("/api/notifications",{cache:"no-store"});if(!r.ok)return;const j=await r.json();setItems(j.notifications||[]);setUnread(j.unread||0)}catch{}}
 useEffect(()=>{load();const id=setInterval(load,30000);return()=>clearInterval(id)},[]);
 useEffect(()=>{const close=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setOpen(false)};document.addEventListener("mousedown",close);return()=>document.removeEventListener("mousedown",close)},[]);
 async function read(n:Notification){if(!n.is_read){await fetch("/api/notifications",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:n.id})});setItems(v=>v.map(x=>x.id===n.id?{...x,is_read:true}:x));setUnread(v=>Math.max(0,v-1))}setOpen(false);if(n.link)router.push(n.link)}
 async function readAll(){await fetch("/api/notifications",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({all:true})});setItems(v=>v.map(x=>({...x,is_read:true})));setUnread(0)}
 const time=(s:string)=>new Intl.DateTimeFormat("vi-VN",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}).format(new Date(s));
 return <div className={styles.center} ref={ref}><button type="button" className={styles.bell} aria-label="Thông báo" onClick={()=>setOpen(v=>!v)}><span aria-hidden="true">🔔</span>{unread>0&&<span className={styles.count}>{unread>99?"99+":unread}</span>}</button>{open&&<div className={styles.dropdown}><div className={styles.head}><div><strong>Thông báo</strong><small>{unread?`${unread} thông báo chưa đọc`:"Không có thông báo mới"}</small></div>{unread>0&&<button type="button" onClick={readAll}>Đánh dấu đã đọc</button>}</div><div className={styles.list}>{items.length===0?<div className={styles.empty}>Chưa có thông báo.</div>:items.slice(0,10).map(n=><button type="button" key={n.id} className={`${styles.item} ${n.is_read?"":styles.unread}`} onClick={()=>read(n)}><span className={styles.dot}/><span className={styles.body}><strong>{n.title}</strong><span>{n.message}</span><small>{time(n.created_at)}</small></span></button>)}</div></div>}</div>
}
