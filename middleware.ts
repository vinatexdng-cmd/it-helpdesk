import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";
export async function middleware(req: NextRequest){const session=await verifyToken(req.cookies.get(SESSION_COOKIE)?.value);if(session)return NextResponse.next();if(req.nextUrl.pathname.startsWith("/api/"))return NextResponse.json({error:"Unauthorized"},{status:401});const url=req.nextUrl.clone();url.pathname="/login";url.searchParams.set("next",req.nextUrl.pathname);return NextResponse.redirect(url)}
export const config={matcher:["/","/tickets/:path*","/api/tickets/:path*"]};
