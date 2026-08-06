import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "../../../../lib/admin-auth";
import { listLeads } from "../../../../lib/leads";

export async function GET() {
  const cookieStore=await cookies();
  if(!verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value)) return NextResponse.json({error:"Требуется вход"},{status:401});
  const leads=await listLeads();
  return NextResponse.json({items:leads.map((lead)=>({slug:lead.id,data:{...lead,title:`${lead.name} — ${lead.phone}`}}))});
}
