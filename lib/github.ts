export type HelpdeskDocument = { title: string; path: string; type: "knowledge" | "case" | "script"; url: string; content?: string };
const repo = process.env.GITHUB_REPOSITORY || "vinatexdng-cmd/it-helpdesk";
const branch = process.env.GITHUB_BRANCH || "main";

export async function githubGet(path:string){
  const token=process.env.GITHUB_TOKEN;
  const r=await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`,{
    headers:{"Accept":"application/vnd.github+json",...(token?{Authorization:`Bearer ${token}`}: {})},
    next:{revalidate:300}
  });
  if(!r.ok) throw new Error(`GitHub API ${r.status}`);
  return r.json();
}

export async function listDirectory(path:string){
  const data=await githubGet(path);
  return Array.isArray(data)?data:[];
}

export async function loadMarkdown(path:string){
  const data=await githubGet(path);
  return Buffer.from(data.content,"base64").toString("utf8");
}

export function classify(path:string): HelpdeskDocument["type"] {
  if(path.startsWith("scripts/")) return "script";
  if(path.startsWith("troubleshooting-cases/")) return "case";
  return "knowledge";
}

export async function listHelpdeskDocuments(){
  const roots=["knowledge-base","troubleshooting-cases","scripts"];
  const out:HelpdeskDocument[]=[];

  async function walk(path:string){
    for(const item of await listDirectory(path)){
      if(item.type==="dir") {
        await walk(item.path);
      } else if(/\.(md|markdown|txt|ps1|psm1|bat|cmd|sh)$/i.test(item.name)) {
        out.push({
          title:item.name.replace(/\.[^.]+$/,""),
          path:item.path,
          type:classify(item.path),
          url:item.html_url,
        });
      }
    }
  }

  for(const root of roots) {
    try { await walk(root); } catch {}
  }

  return out;
}