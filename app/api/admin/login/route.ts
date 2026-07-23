import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  adminIsConfigured,
  createAdminSession,
  verifyAdminPassword,
} from "../../../../lib/admin-auth";

export async function POST(request: Request) {
  if (!adminIsConfigured()) {
    return NextResponse.json(
      { error: "Админка ещё не настроена на сервере" },
      { status: 503 },
    );
  }
  const { password } = (await request.json()) as { password?: string };
  if (!password || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    ADMIN_COOKIE,
    createAdminSession(),
    adminCookieOptions,
  );
  return response;
}
