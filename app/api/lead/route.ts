import { randomBytes } from "node:crypto";
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT_COUNT = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();
const allowedExtensions = new Set([".pdf", ".dwg", ".jpg", ".jpeg", ".png"]);

function value(form: FormData, name: string, maxLength: number) {
  const raw = form.get(name);
  return typeof raw === "string" ? raw.trim().slice(0, maxLength) : "";
}

function rateLimited(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_COUNT;
}

async function removeExpiredFiles(directory: string) {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  try {
    for (const entry of await readdir(directory)) {
      const filePath = path.join(/* turbopackIgnore: true */ directory, entry);
      if ((await stat(filePath)).mtimeMs < cutoff) await rm(filePath, { force: true });
    }
  } catch {
    // Cleanup is best-effort and must not block a lead.
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "rate-limit" }, { status: 429 });

  const form = await request.formData();
  if (value(form, "website", 200)) return NextResponse.json({ ok: true });

  const name = value(form, "name", 120);
  const phone = value(form, "phone", 80);
  const region = value(form, "region", 160);
  const objectType = value(form, "objectType", 160);
  const comment = value(form, "comment", 3000);
  if (!name || !phone || !region || !objectType) {
    return NextResponse.json({ error: "required-fields" }, { status: 400 });
  }

  const serviceIds = (process.env.TILDA_FORM_SERVICE_IDS || "").split(",").map((item) => item.trim()).filter(Boolean);
  if (!serviceIds.length) return NextResponse.json({ error: "lead-service-not-configured" }, { status: 503 });

  const uploadDirectory = process.env.LEAD_UPLOAD_DIR || "/opt/smp-marko/shared/lead-files";
  let storedFile = "";
  let fileUrl = "Файл не приложен";
  const projectFile = form.get("projectFile");

  try {
    if (projectFile instanceof File && projectFile.size > 0) {
      const extension = path.extname(projectFile.name).toLowerCase();
      if (!allowedExtensions.has(extension) || projectFile.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "invalid-file" }, { status: 400 });
      }
      await mkdir(uploadDirectory, { recursive: true });
      storedFile = `${randomBytes(24).toString("hex")}${extension}`;
      await writeFile(path.join(/* turbopackIgnore: true */ uploadDirectory, storedFile), Buffer.from(await projectFile.arrayBuffer()), { flag: "wx" });
      fileUrl = `${request.nextUrl.origin}/api/lead-file/${storedFile}`;
      void removeExpiredFiles(uploadDirectory);
    }

    const payload = new URLSearchParams();
    for (const serviceId of serviceIds) payload.append("formservices[]", serviceId);
    payload.set("Name", name);
    payload.set("Phone", phone);
    payload.set("Город / регион", region);
    payload.set("Тип объекта", objectType);
    payload.set("Комментарий", comment || "Не указан");
    payload.set("План или эскиз", fileUrl);
    payload.set("tildaspec-formname", "Заявка на расчёт — smp-marko.ru");
    payload.set("tildaspec-projectid", process.env.TILDA_PROJECT_ID || "");
    payload.set("tildaspec-pageid", process.env.TILDA_PAGE_ID || "");
    payload.set("tildaspec-formskey", process.env.TILDA_FORMS_KEY || "");
    payload.set("form-spec-comments", "Its good");

    const response = await fetch("https://forms.tildacdn.com/procces/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Origin: "https://smp-marko.com",
        Referer: "https://smp-marko.com/",
      },
      body: payload.toString(),
      cache: "no-store",
    });
    const responseText = await response.text();
    let accepted = response.ok;
    try {
      const data = JSON.parse(responseText) as { status?: string; error?: string };
      if (data.status) accepted = response.ok && data.status === "success";
      if (data.error) accepted = false;
    } catch {
      if (/\berror\b/i.test(responseText)) accepted = false;
    }
    if (!accepted) throw new Error(`Tilda rejected lead: ${response.status}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (storedFile) await rm(path.join(/* turbopackIgnore: true */ uploadDirectory, storedFile), { force: true });
    console.error("Lead submission failed", error);
    return NextResponse.json({ error: "lead-submit-failed" }, { status: 502 });
  }
}
