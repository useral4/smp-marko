import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminIsConfigured,
  verifyAdminSession,
} from "../../../../lib/admin-auth";

export async function GET() {
  const cookieStore = await cookies();
  return NextResponse.json({
    authenticated: verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value),
    configured: adminIsConfigured(),
  });
}
