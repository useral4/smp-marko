import { NextResponse } from "next/server";
import { createLead } from "../../../lib/leads";

const attempts = new Map<string,{count:number;reset:number}>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const current = attempts.get(ip);
    if (current && current.reset > now && current.count >= 8) return NextResponse.json({error:"Слишком много заявок. Попробуйте позже."},{status:429});
    attempts.set(ip,{count:current&&current.reset>now?current.count+1:1,reset:now+60*60*1000});
    const form = await request.formData();
    const lead = await createLead(form, request.headers.get("referer") || "Сайт");
    return NextResponse.json({ok:true,id:lead.id});
  } catch (error) {
    return NextResponse.json({error:error instanceof Error?error.message:"Не удалось отправить заявку"},{status:400});
  }
}
