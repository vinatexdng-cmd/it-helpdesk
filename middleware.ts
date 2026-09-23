import {NextRequest,NextResponse} from "next/server";
import {verifyToken,SESSION_COOKIE} from "@/lib/session";
export async function middleware(req:NextRequest){const s=await verifyToken(req.cookies.get(SESSION_COOKIE)?.value);if(s)return NextResponse.next();if(req.nextUrl.pathname.startsWith("/api/"))return NextResponse.json({error:"Unauthorized"},{status:401});const u=req.nextUrl.clone();u.pathname="/login";u.searchParams.set("next",req.nextUrl.pathname);return NextResponse.redirect(u)}
export const config={matcher:["/","/tickets/:path*","/api/tickets/:path*"]};
