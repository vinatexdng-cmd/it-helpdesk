"use client";
import { useEffect, useState } from "react";
type Doc={path:string;title:string;type:string;content?:string;url?:string};
export default function KnowledgeSearch(){
 const [q,setQ]=useState(""); const [docs,setDocs]=useState<Doc[]>([]); const [loading,setLoading]=useState(false);
 useEffect(()=>{const t=setTimeout(async()=>{setLoading(true);try{const x=await fetch("/api/knowledge/search?q="+encodeURIComponent(q));const j=await x.json();setDocs(j.documents??[])}finally{setLoading(false)}},250);return()=>clearTimeout(t)},[q]);
 return <section className="panel"><input className="search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm lỗi, thiết bị, hướng xử lý, script..." aria-label="Tìm kiếm knowledge base"/><div className="result-meta">{loading?"Đang tìm kiếm...":docs.length+" kết quả"}</div><div className="results">{docs.map(d=><article className="result" key={d.path}><div><span className="badge">{d.type}</span><h3>{d.title}</h3><p>{d.content||d.path}</p></div>{d.url&&<a href={d.url} target="_blank" rel="noreferrer">Mở GitHub ↗</a>}</article>)}</div></section>
}