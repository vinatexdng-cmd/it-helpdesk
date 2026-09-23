import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
  const status=req.nextUrl.searchParams.get("status")||"All";
  return NextResponse.json({
    tickets:[],
    status,
    message:"Database adapter chưa được bật. Cấu hình DATABASE_URL để kích hoạt persistence."
  });
}