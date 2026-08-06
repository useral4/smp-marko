import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

export type LeadRecord = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  region: string;
  objectType: string;
  comment: string;
  page: string;
  fileName: string;
  storedFile: string;
  fileSize: number;
  emailStatus: "sent" | "not-configured" | "failed";
  emailError?: string;
};

const leadRoot = process.env.LEAD_UPLOAD_DIR || "/tmp/smp-marko-leads";

function clean(value: FormDataEntryValue | null, max = 2000) {
  return String(value || "").trim().slice(0, max);
}

function safeName(value: string) {
  return value.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]+/g, "-").slice(0, 100) || "file";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" })[char] || char);
}

async function sendLeadEmail(lead: LeadRecord, attachmentPath: string | null) {
  const serviceIds = (process.env.TILDA_FORM_SERVICE_IDS || "").split(",").map((item)=>item.trim()).filter(Boolean);
  if (serviceIds.length) {
    const payload = new URLSearchParams();
    for (const serviceId of serviceIds) payload.append("formservices[]",serviceId);
    payload.set("Name",lead.name);
    payload.set("Phone",lead.phone);
    payload.set("Город / регион",lead.region);
    payload.set("Тип объекта",lead.objectType);
    payload.set("Комментарий",lead.comment||"Не указан");
    payload.set("План или эскиз",lead.fileName?`Файл сохранён в админке: ${lead.fileName}`:"Файл не приложен");
    payload.set("Страница",lead.page);
    payload.set("tildaspec-formname","Заявка на расчёт — smp-marko.ru");
    payload.set("tildaspec-projectid",process.env.TILDA_PROJECT_ID||"");
    payload.set("tildaspec-pageid",process.env.TILDA_PAGE_ID||"");
    payload.set("tildaspec-formskey",process.env.TILDA_FORMS_KEY||"");
    payload.set("form-spec-comments","Its good");
    const response=await fetch("https://forms.tildacdn.com/procces/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",Origin:"https://smp-marko.com",Referer:"https://smp-marko.com/"},body:payload.toString(),cache:"no-store"});
    const responseText=await response.text();
    let accepted=response.ok;
    try{const result=JSON.parse(responseText) as {status?:string;error?:string};if(result.status)accepted=response.ok&&result.status==="success";if(result.error)accepted=false}catch{if(/\berror\b/i.test(responseText))accepted=false}
    if(!accepted)throw new Error(`Сервис почты отклонил заявку (${response.status})`);
    return {status:"sent" as const};
  }
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  if (!host || !user || !password) return { status: "not-configured" as const };
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: { user, pass: password },
  });
  const to = process.env.LEAD_EMAIL_TO || "info@kolumb.ru";
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Сайт СМП МАРКО <${user}>`,
    to,
    replyTo: user,
    subject: `Новая заявка с сайта: ${lead.name}, ${lead.phone}`,
    text: `Имя: ${lead.name}\nТелефон: ${lead.phone}\nГород/регион: ${lead.region}\nТип объекта: ${lead.objectType}\nСтраница: ${lead.page}\n\nКомментарий:\n${lead.comment || "—"}`,
    html: `<h2>Новая заявка с сайта СМП МАРКО</h2><p><b>Имя:</b> ${escapeHtml(lead.name)}</p><p><b>Телефон:</b> ${escapeHtml(lead.phone)}</p><p><b>Город/регион:</b> ${escapeHtml(lead.region)}</p><p><b>Тип объекта:</b> ${escapeHtml(lead.objectType)}</p><p><b>Страница:</b> ${escapeHtml(lead.page)}</p><p><b>Комментарий:</b><br>${escapeHtml(lead.comment || "—").replace(/\n/g,"<br>")}</p>`,
    attachments: attachmentPath ? [{ filename: lead.fileName, path: attachmentPath }] : [],
  });
  return { status: "sent" as const };
}

export async function createLead(form: FormData, page: string) {
  const name = clean(form.get("name"), 120);
  const phone = clean(form.get("phone"), 80);
  const region = clean(form.get("region"), 160);
  const objectType = clean(form.get("objectType"), 160);
  const comment = clean(form.get("comment"), 4000);
  if (!name || !phone || !region || !objectType) throw new Error("Заполните обязательные поля");
  if (clean(form.get("companyWebsite"))) throw new Error("Заявка отклонена");

  const id = `${Date.now()}-${crypto.randomUUID().slice(0,8)}`;
  const directory = path.join(leadRoot, id);
  await fs.mkdir(directory, { recursive: true });
  const file = form.get("projectFile");
  let fileName = "";
  let storedFile = "";
  let fileSize = 0;
  let attachmentPath: string | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > 15 * 1024 * 1024) throw new Error("Файл больше 15 МБ");
    const extension = path.extname(file.name).toLowerCase();
    if (![".pdf", ".dwg", ".jpg", ".jpeg", ".png", ".webp"].includes(extension)) throw new Error("Разрешены PDF, DWG, JPG, PNG и WEBP");
    fileName = safeName(file.name);
    storedFile = fileName;
    fileSize = file.size;
    attachmentPath = path.join(directory, storedFile);
    await fs.writeFile(attachmentPath, new Uint8Array(await file.arrayBuffer()));
  }
  const lead: LeadRecord = { id, createdAt:new Date().toISOString(), name, phone, region, objectType, comment, page, fileName, storedFile, fileSize, emailStatus:"not-configured" };
  try {
    const result = await sendLeadEmail(lead, attachmentPath);
    lead.emailStatus = result.status;
  } catch (error) {
    lead.emailStatus = "failed";
    lead.emailError = error instanceof Error ? error.message.slice(0,300) : "Ошибка отправки";
  }
  await fs.writeFile(path.join(directory,"lead.json"), `${JSON.stringify(lead,null,2)}\n`, "utf8");
  return lead;
}

export async function listLeads() {
  await fs.mkdir(leadRoot, { recursive: true });
  const directories = await fs.readdir(leadRoot, { withFileTypes:true });
  const leads = await Promise.all(directories.filter((entry)=>entry.isDirectory()).map(async(entry)=>{
    try { return JSON.parse(await fs.readFile(path.join(leadRoot,entry.name,"lead.json"),"utf8")) as LeadRecord; } catch { return null; }
  }));
  return leads.filter((lead): lead is LeadRecord => Boolean(lead)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}

export async function leadAttachment(id: string) {
  if (!/^[a-zA-Z0-9-]+$/.test(id)) return null;
  const record = JSON.parse(await fs.readFile(path.join(leadRoot,id,"lead.json"),"utf8")) as LeadRecord;
  if (!record.storedFile) return null;
  return { record, bytes:await fs.readFile(path.join(leadRoot,id,record.storedFile)) };
}
