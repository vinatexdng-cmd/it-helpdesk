import { NextRequest, NextResponse } from "next/server";
import { listHelpdeskDocuments } from "@/lib/github";
export const revalidate=60;
export async function GET(req:NextRequest){
 const q=(req.nextUrl.searchParams.get("q")||"").trim().toLowerCase();
 const docs=await listHelpdeskDocuments();
 if(!q)return NextResponse.json({documents:docs.slice(0,50),count:docs.length});
 const words=q.split(/\s+/).filter(Boolean);
 const documents=docs.filter(d=>{const hay=(d.title+" "+d.path+" "+(d.content||"")).toLowerCase();return words.every(w=>hay.includes(w))}).slice(0,50);
 return NextResponse.json({documents,count:documents.length});
}