"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Doc = { title:string; path:string; type:"knowledge"|"case"|"script"; content:string };

function renderMarkdown(md:string) {
  const lines=md.replace(/\r\n/g,"\n").split("\n"); const out:React.ReactNode[]=[]; let code=false; let buf:string[]=[];
  const flush=()=>{ if(buf.length){ out.push(<pre className="kb-code" key={"code-"+out.length}><code>{buf.join("\n")}</code></pre>); buf=[]; } };
  lines.forEach((line,i)=>{
    if(line.trim().startsWith("```")) { if(code) flush(); code=!code; return; }
    if(code){ buf.push(line); return; }
    if(/^###\s+/.test(line)) out.push(<h3 key={i}>{line.replace(/^###\s+/,"")}</h3>);
    else if(/^##\s+/.test(line)) out.push(<h2 key={i}>{line.replace(/^##\s+/,"")}</h2>);
    else if(/^#\s+/.test(line)) out.push(<h1 key={i}>{line.replace(/^#\s+/,"")}</h1>);
    else if(/^[-*]\s+/.test(line)) out.push(<li key={i}>{line.replace(/^[-*]\s+/,"")}</li>);
    else if(/^\d+\.\s+/.test(line)) out.push(<li key={i}>{line.replace(/^\d+\.\s+/,"")}</li>);
    else if(/^>\s?/.test(line)) out.push(<blockquote key={i}>{line.replace(/^>\s?/,"")}</blockquote>);
    else if(line.trim()) out.push(<p key={i}>{line}</p>);
  });
  if(code) flush(); return out;
}

export default function KnowledgeDocument({ path }:{path:string}) {
  const [doc,setDoc]=useState<Doc|null>(null); const [error,setError]=useState("");
  useEffect(()=>{fetch("/api/knowledge/document?path="+encodeURIComponent(path)).then(async r=>{const j=await r.json(); if(!r.ok) throw new Error(j.error||"Không thể tải tài liệu"); return j.document}).then(setDoc).catch(e=>setError(e.message));},[path]);
  if(error) return <main className="container"><div className="panel kb-empty"><strong>{error}</strong><p><Link href="/knowledge-base">← Quay lại Knowledge Base</Link></p></div></main>;
  if(!doc) return <main className="container"><div className="panel kb-loading">Đang tải tài liệu...</div></main>;
  return <main className="container"><div className="kb-detail-top"><Link href="/knowledge-base">← Knowledge Base</Link><a href={"https://github.com/"+(process.env.NEXT_PUBLIC_GITHUB_REPOSITORY||"vinatexdng-cmd/it-helpdesk")+"/blob/main/"+doc.path} target="_blank" rel="noreferrer">Mở GitHub ↗</a></div><div className="hero"><span className={"badge badge-"+doc.type}>{doc.type==="case"?"case xử lý":doc.type}</span><h1>{doc.title}</h1><p>{doc.path}</p></div><article className="panel kb-document">{renderMarkdown(doc.content)}</article></main>;
}