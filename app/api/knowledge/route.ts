import { NextResponse } from "next/server";
import { listHelpdeskDocuments } from "@/lib/github";
export async function GET(){ try { const documents=await listHelpdeskDocuments(); return NextResponse.json({documents,count:documents.length}); } catch(e){ return NextResponse.json({error:e instanceof Error?e.message:"Unknown error"},{status:500}); } }