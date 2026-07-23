import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "smp-marko-admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function secret() {
  return process.env.ADMIN_SECRET || "";
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function adminIsConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}

export function verifyAdminPassword(password: string) {
  const expected = Buffer.from(process.env.ADMIN_PASSWORD || "");
  const actual = Buffer.from(password);
  return (
    adminIsConfigured() &&
    expected.length === actual.length &&
    timingSafeEqual(expected, actual)
  );
}

export function createAdminSession() {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS);
  return `${expires}.${signature(expires)}`;
}

export function verifyAdminSession(token?: string) {
  if (!token || !adminIsConfigured()) return false;
  const [expires, provided] = token.split(".");
  if (!expires || !provided || Number(expires) <= Date.now() / 1000) return false;
  const expected = Buffer.from(signature(expires));
  const actual = Buffer.from(provided);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.RENDER === "true",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
