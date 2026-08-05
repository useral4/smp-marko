import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".pdf": "application/pdf",
  ".dwg": "application/acad",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  if (!/^[a-f0-9]{48}\.(pdf|dwg|jpg|jpeg|png)$/.test(token)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const directory = process.env.LEAD_UPLOAD_DIR || "/opt/smp-marko/shared/lead-files";
    const extension = path.extname(token).toLowerCase();
    const file = await readFile(path.join(/* turbopackIgnore: true */ directory, token));
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentTypes[extension] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="project${extension}"`,
        "Cache-Control": "private, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
