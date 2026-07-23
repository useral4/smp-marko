import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "../../../../lib/admin-auth";
import {
  deleteContent,
  listContent,
  saveContent,
} from "../../../../lib/content-store";

async function authorized() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
}

function errorResponse(error: unknown) {
  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Неизвестная ошибка" },
    { status: 400 },
  );
}

export async function GET(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }
  try {
    const type = new URL(request.url).searchParams.get("type") || "";
    return NextResponse.json({ items: await listContent(type) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }
  try {
    const input = (await request.json()) as {
      type: string;
      slug: string;
      previousSlug?: string;
      data: unknown;
    };
    return NextResponse.json({ ok: true, ...(await saveContent(input)) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }
  try {
    const input = (await request.json()) as { type: string; slug: string };
    await deleteContent(input.type, input.slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
