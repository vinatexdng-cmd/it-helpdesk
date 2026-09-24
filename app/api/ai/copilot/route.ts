import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listHelpdeskDocuments } from "@/lib/github";

type Turn={role:"user"|"assistant";content:string};
type IntentRule={id:string;phrases:string[];boosts:string[];category?:string};

const STOP_WORDS=new Set(["toi","em","anh","chi","la","bi","va","voi","cua","cho","duoc","khong","co","mot","nhung","thi","nay","do","lam","gi","the","nao","giup","can","muon"]);
const INTENT_RULES:IntentRule[]=[
  {id:"printer",phrases:["may in","khong in","in khong duoc","offline","ket giay","load letter","kho giay"],boosts:["may-in","printer","print","offline","paper","spooler"],category:"Printer"},
  {id:"network",phrases:["mat mang","khong vao mang","khong co internet","mang cham","wifi","wi-fi","169.254","trung ip","dhcp"],boosts:["mang-internet","wifi","dhcp","dns","gateway","packet","ip-conflict"],category:"Network"},
  {id:"vpn",phrases:["vpn","l2tp","ipsec","ket noi tu xa"],boosts:["vpn-lam-viec-tu-xa","vpn","l2tp","ipsec","route","split tunnel"],category:"Network"},
  {id:"file-server",phrases:["o mang","o z","file server","shared folder","access denied","network path"],boosts:["file-server-o-mang","mapped drive","access denied","network path","share","smb"],category:"Network"},
  {id:"outlook",phrases:["outlook","khong gui mail","khong nhan mail","outbox","pst","ost","tim email"],boosts:["email-outlook","outlook","outbox","pst","ost","mail"],category:"Email"},
  {id:"office",phrases:["excel","word","office","cong thuc","unlicensed","activation"],boosts:["office","excel","word","formula","license","activation"],category:"Software"},
  {id:"account",phrases:["quen mat khau","khoa tai khoan","dang nhap","mfa","otp","authenticator"],boosts:["tai-khoan-mat-khau","account","password","mfa","otp","dang nhap"],category:"Account"},
  {id:"security",phrases:["phishing","email gia mao","virus","malware","ransomware","bam link la"],boosts:["bao-mat-an-toan-thong-tin","phishing","malware","ransomware","bao mat"],category:"Security"},
  {id:"teams",phrases:["teams","cuoc hop","microphone","camera"],boosts:["microsoft-365","teams","meeting","microphone","camera"],category:"Software"},
  {id:"onedrive",phrases:["onedrive","khong dong bo","sync pending"],boosts:["microsoft-365","onedrive","sync","dong bo"],category:"Software"},
  {id:"windows",phrases:["windows","may cham","khoi dong cham","man hinh","usb","bitlocker","trust relationship"],boosts:["windows-may-tinh","windows","bitlocker","domain","trust","startup"],category:"Hardware"}
];

function normalize(s:string){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9./\\-]+/g," ").replace(/\s+/g," ").trim();}
function terms(s:string){return [...new Set(normalize(s).split(" ").filter(w=>w.length>1&&!STOP_WORDS.has(w)))];}
function detectedIntents(question:string){const q=normalize(question);return INTENT_RULES.filter(rule=>rule.phrases.some(p=>q.includes(normalize(p))));}
function ticketPriority(text:string){const q=normalize(text);if(/ransomware|ma hoa file|phishing.*(mat khau|mfa)|toan bo|ca nha may|ca don vi|he thong dung/.test(q))return "Critical";if(/ca phong|nhieu nguoi|khong lam viec duoc|mat mang|server.*khong|khong truy cap.*server/.test(q))return "High";return "Normal";}
function ticketTitle(question:string,intents:IntentRule[]){const clean=question.replace(/\s+/g," ").trim();if(clean.length<=120)return clean;const prefix=intents[0]?.id?`Sự cố ${intents[0].id}: `:"Yêu cầu hỗ trợ: ";return (prefix+clean).slice(0,120);}

function relevantContext(question:string,docs:Awaited<ReturnType<typeof listHelpdeskDocuments>>,role:string){
  const q=normalize(question),words=terms(question),intents=detectedIntents(question),broadImpact=/\b(ca phong|nhieu nguoi|tat ca|toan bo|ca nha may|ca don vi)\b/.test(q);
  return docs.filter(d=>role!=="user"||d.type!=="script").map(d=>{const title=normalize(d.title),path=normalize(d.path),content=normalize(d.content||""),hay=`${title} ${path} ${content}`;let score=0;if(q.length>=5&&title.includes(q))score+=80;if(q.length>=5&&hay.includes(q))score+=35;for(const w of words){if(title.includes(w))score+=12;if(path.includes(w))score+=7;if(content.includes(w))score+=2;}for(const intent of intents){for(const boost of intent.boosts){const b=normalize(boost);if(title.includes(b))score+=14;if(path.includes(b))score+=12;else if(content.includes(b))score+=3;}}if(path.includes("troubleshooting-cases")&&intents.length>0)score+=10;if(broadImpact&&path.includes("troubleshooting-cases")&&/ca phong|nhieu nguoi|tat ca|toan bo/.test(content))score+=18;return {...d,score};}).filter(d=>d.score>=6).sort((a,b)=>b.score-a.score).slice(0,6).map(d=>({...d,content:(d.content||"").slice(0,5500)}));
}

export async function POST(req:NextRequest){
  try{
    const user=await getSession();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
    const body=await req.json(),question=String(body.question||"").trim();
    const history=Array.isArray(body.history)?body.history.filter((x:Turn)=>x&&["user","assistant"].includes(x.role)&&typeof x.content==="string").slice(-8):[];
    if(!question)return NextResponse.json({error:"Vui lòng nhập câu hỏi"},{status:400});if(question.length>1000)return NextResponse.json({error:"Câu hỏi tối đa 1000 ký tự"},{status:400});
    const apiKey=process.env.AI_API_KEY,baseUrl=(process.env.AI_BASE_URL||"https://api.openai.com/v1").replace(/\/$/,""),model=process.env.AI_MODEL||"gpt-5.6-luna";if(!apiKey)return NextResponse.json({error:"AI_API_KEY chưa được cấu hình trên server"},{status:503});
    const docs=await listHelpdeskDocuments(),matches=relevantContext(question,docs,user.role),intents=detectedIntents(question);
    const context=matches.map((d,i)=>`SOURCE ${i+1}\nTitle: ${d.title}\nPath: ${d.path}\nType: ${d.type}\nRelevance: ${d.score}\nContent:\n${d.content}`).join("\n\n---\n\n");
    const conversation=history.map((x:Turn)=>`${x.role==="user"?"NHÂN VIÊN":"TRỢ LÝ"}: ${x.content.slice(0,3000)}`).join("\n");
    const prompt=`Bạn là Trợ lý CNTT Vinatex Đà Nẵng vận hành bởi OpenAI, trợ lý CNTT nội bộ dựa trên Kho kiến thức.\n- Chỉ dùng SOURCE; không bịa.\n- Ưu tiên triệu chứng và phạm vi ảnh hưởng gần nhất.\n- Phân biệt lỗi một máy với lỗi diện rộng.\n- Nếu nguồn không đủ, nói rõ và hỏi tối đa 3 thông tin chẩn đoán.\n- Trả lời: Nhận định ngắn → Kiểm tra nhanh → Các bước xử lý → Cách xác nhận → Khi nào cần tạo yêu cầu/chuyển IT.\n- Cuối câu trả lời ghi Nguồn tham khảo: SOURCE X,... chỉ với nguồn đã dùng.\n- Dùng tiếng Việt rõ ràng.\n\nLỊCH SỬ:\n${conversation||"(chưa có)"}\n\nCÂU HỎI:\n${question}\n\nSOURCE:\n${context||"Không tìm thấy SOURCE phù hợp."}`;
    const response=await fetch(baseUrl+"/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+apiKey},body:JSON.stringify({model,messages:[{role:"system",content:"Bạn là trợ lý CNTT nội bộ của Vinatex Đà Nẵng."},{role:"user",content:prompt}],max_completion_tokens:1600})});
    const data=await response.json();if(!response.ok)return NextResponse.json({error:data?.error?.message||`OpenAI trả về HTTP ${response.status}`},{status:502});const answer=data?.choices?.[0]?.message?.content;if(!answer)return NextResponse.json({error:"OpenAI không trả về nội dung"},{status:502});
    const sourceSummary=matches.slice(0,4).map(d=>d.title);
    const priority=ticketPriority(question+" "+answer),category=intents[0]?.category||"Other";
    const shouldSuggestTicket=matches.length===0||priority==="Critical"||priority==="High"||/tạo yêu cầu|chuyển it|chuyển cấp|chưa có đủ thông tin/i.test(answer);
    const ticketDraft={title:ticketTitle(question,intents),category,priority,description:`Nội dung người dùng:\n${question}\n\nTrao đổi với Trợ lý CNTT:\n${answer}\n\nTài liệu Kho kiến thức đã tham khảo:\n${sourceSummary.length?sourceSummary.map((x,i)=>`${i+1}. ${x}`).join("\n"):"Không tìm thấy tài liệu phù hợp."}`};
    return NextResponse.json({answer,sources:matches.map(d=>({title:d.title,path:d.path,type:d.type,url:d.url,relevance:d.score})),canCreateTicket:true,suggestCreateTicket:shouldSuggestTicket,ticketDraft,user:{name:user.name,email:user.email,role:user.role}});
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Lỗi Trợ lý CNTT"},{status:500});}
}
