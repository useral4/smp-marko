import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { uploadRoot, usesPersistentServerStorage } from "../../../lib/content-paths";

const mimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  if (!usesPersistentServerStorage) {
    return new NextResponse("Not found", { status: 404 });
  }

  const segments = (await params).path;
  if (
    !segments.length ||
    segments.some((segment) => !/^[a-zA-Z0-9._-]+$/.test(segment))
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filename = path.join(uploadRoot, ...segments);
  const relative = path.relative(uploadRoot, filename);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const extension = path.extname(filename).toLowerCase();
    const contentType = mimeTypes[extension];
    if (!contentType) return new NextResponse("Not found", { status: 404 });
    const bytes = await fs.readFile(filename);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
