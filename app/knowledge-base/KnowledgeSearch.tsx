"use client";
import { useEffect, useMemo, useState } from "react";

type Doc = { path: string; title: string; type: "knowledge" | "case" | "script"; content?: string; snippet?: string; url?: string };
const filters = [["all","Tất cả"],["knowledge","Knowledge"],["case","Case xử lý"],["script","Script"]] as const;

function highlight(text: string, query: string) {
  if (!query) return text;
  const words = query.split(/\s+/).filter(Boolean).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!words.length) return text;
  const re = new RegExp("(" + words.join("|") + ")", "gi");
  return text.split(re).map((part, i) => re.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>);
}

export default function KnowledgeSearch() {
  const [q,setQ] = useState(""); const [docs,setDocs] = useState<Doc[]>([]);
  const [loading,setLoading] = useState(false); const [filter,setFilter] = useState<(typeof filters)[number][0]>("all");
  useEffect(() => { const t=setTimeout(async()=>{ setLoading(true); try { const x=await fetch("/api/knowledge/search?q="+encodeURIComponent(q)); const j=await x.json(); setDocs(j.documents??[]); } finally { setLoading(false); } },250); return()=>clearTimeout(t); },[q]);
  const visibleDocs = useMemo(() => filter==="all" ? docs : docs.filter(d=>d.type===filter), [docs,filter]);
  return <section className="panel">
    <div className="kb-search-wrap"><input className="search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm lỗi, thiết bị, hướng xử lý, script..." aria-label="Tìm kiếm knowledge base"/>{q && <button className="kb-clear" type="button" onClick={()=>setQ("")}>Xóa</button>}</div>
    <div className="kb-toolbar"><div className="kb-filters" role="tablist" aria-label="Lọc loại tài liệu">{filters.map(([value,label])=><button key={value} type="button" className={filter===value ? "kb-filter active" : "kb-filter"} onClick={()=>setFilter(value)}>{label}</button>)}</div><div className="result-meta">{loading ? "Đang tìm kiếm..." : visibleDocs.length+" kết quả"}</div></div>
    <div className="results">{visibleDocs.map(d=><article className="result" key={d.path}><div className="kb-result-body"><span className={"badge badge-"+d.type}>{d.type==="case" ? "case xử lý" : d.type}</span><h3>{highlight(d.title,q)}</h3><p>{highlight(d.snippet||d.content||d.path,q)}</p><small className="kb-path">{d.path}</small></div>{d.url&&<a className="kb-open" href={d.url} target="_blank" rel="noreferrer">Mở GitHub ↗</a>}</article>)}
      {!loading && visibleDocs.length===0 && <div className="kb-empty"><strong>{q ? "Không tìm thấy tài liệu phù hợp" : "Chưa có tài liệu"}</strong><p>{q ? "Thử từ khóa ngắn hơn, ví dụ: DNS, WiFi, printer, mạng." : "Knowledge Base sẽ hiển thị tài liệu kỹ thuật từ repository IT Helpdesk."}</p></div>}
    </div>
  </section>;
}