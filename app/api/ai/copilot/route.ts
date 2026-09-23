import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listHelpdeskDocuments } from "@/lib/github";

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const question = String(body.question || "").trim();
    if (!question) return NextResponse.json({ error: "Vui lòng nhập câu hỏi" }, { status: 400 });
    if (question.length > 1000) return NextResponse.json({ error: "Câu hỏi tối đa 1000 ký tự" }, { status: 400 });

    const apiKey = process.env.AI_API_KEY;
    const baseUrl = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    const model = process.env.AI_MODEL || "gpt-4o-mini";
    if (!apiKey) return NextResponse.json({ error: "AI_API_KEY chưa được cấu hình trên server" }, { status: 503 });

    const docs = await listHelpdeskDocuments();
    const normalize = (s:string) => s.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
    const words = normalize(question).split(/\s+/).filter(w => w.length > 1);
    const matches = docs.map(d => {
      const hay = normalize(d.title+" "+d.path+" "+(d.content||""));
      let score=0; for(const w of words){ if(normalize(d.title).includes(w)) score+=8; if(normalize(d.path).includes(w)) score+=4; if(hay.includes(w)) score+=2; }
      return {...d,score};
    }).filter(d=>d.score>0).sort((a,b)=>b.score-a.score).slice(0,6);

    const context = matches.map((d,i) => `SOURCE ${i+1}\nTitle: ${d.title}\nPath: ${d.path}\nType: ${d.type}\nContent:\n${(d.content||"").slice(0,12000)}`).join("\n\n---\n\n");
    const prompt = `Bạn là Vinatex IT Helpdesk Copilot. Trả lời bằng tiếng Việt, ngắn gọn nhưng đủ bước để nhân viên IT xử lý sự cố. Chỉ dùng thông tin trong các SOURCE được cung cấp. Nếu nguồn không đủ, nói rõ "Knowledge Base chưa có đủ thông tin" và không tự bịa. Khi đưa hướng dẫn, ưu tiên checklist/bước xử lý. Cuối câu trả lời ghi "Nguồn tham khảo: SOURCE 1, ..." tương ứng các nguồn đã dùng.\n\nCÂU HỎI: ${question}\n\n${context || "Không tìm thấy SOURCE phù hợp."}`;
    const response = await fetch(baseUrl + "/chat/completions", {
      method:"POST", headers:{"Content-Type":"application/json","Authorization":"Bearer "+apiKey},
      body:JSON.stringify({model,messages:[{role:"system",content:"Bạn là trợ lý IT nội bộ của Vinatex."},{role:"user",content:prompt}],temperature:0.2,max_tokens:1200})
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({error:data?.error?.message || `AI provider HTTP ${response.status}`},{status:502});
    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) return NextResponse.json({error:"AI không trả về nội dung"},{status:502});
    return NextResponse.json({answer,sources:matches.map(d=>({title:d.title,path:d.path,type:d.type,url:d.url}))});
  } catch(e) { return NextResponse.json({error:e instanceof Error?e.message:"AI Copilot error"},{status:500}); }
}