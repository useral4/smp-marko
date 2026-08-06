import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "../../../../../../lib/admin-auth";
import { leadAttachment } from "../../../../../../lib/leads";

export async function GET(_:Request,{params}:{params:Promise<{id:string}>}) {
  const cookieStore=await cookies();
  if(!verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value)) return NextResponse.json({error:"Требуется вход"},{status:401});
  try { const {id}=await params; const result=await leadAttachment(id); if(!result)return NextResponse.json({error:"Файл не найден"},{status:404}); return new NextResponse(result.bytes,{headers:{"Content-Disposition":`attachment; filename*=UTF-8''${encodeURIComponent(result.record.fileName)}`,"Content-Type":"application/octet-stream"}}); } catch { return NextResponse.json({error:"Файл не найден"},{status:404}); }
}
