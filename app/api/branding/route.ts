import{NextResponse}from"next/server";
export const dynamic="force-dynamic";
const APPROVED_LOGO="/brand/vinatex-da-nang.png?v=20260928b";
export async function GET(){return NextResponse.json({logo:APPROVED_LOGO})}
