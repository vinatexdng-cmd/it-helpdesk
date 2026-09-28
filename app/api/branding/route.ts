import{NextResponse}from"next/server";
export const dynamic="force-dynamic";
const APPROVED_LOGO="/brand/vinatex-da-nang.svg?v=20260928";
export async function GET(){return NextResponse.json({logo:APPROVED_LOGO})}
