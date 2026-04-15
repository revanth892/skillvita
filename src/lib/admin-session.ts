import { createHmac, timingSafeEqual } from "crypto";

import { cookies } from "next/headers";

const SESSION_COOKIE = "skillvita_admin_session";
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

interface AdminSessionPayload {
  email: string;
  exp: number;
}

function getSessionSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "skillvita-dev-secret";
}

function encode(payload: AdminSessionPayload) {
  const json = JSON.stringify(payload);
  return Buffer.from(json, "utf8").toString("base64url");
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function decode(value: string) {
  const decoded = Buffer.from(value, "base64url").toString("utf8");
  return JSON.parse(decoded) as AdminSessionPayload;
}

export function getAllowedAdminEmail() {
  return (process.env.ADMIN_GOOGLE_EMAIL || "hemanth@skillvita.in").toLowerCase();
}

export async function createAdminSession(email: string) {
  const payload: AdminSessionPayload = {
    email: email.toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + ONE_DAY_IN_SECONDS,
  };
  const encoded = encode(payload);
  const token = `${encoded}.${sign(encoded)}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_DAY_IN_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return null;
  }

  const expectedSignature = sign(encoded);
  const isValid =
    signature.length === expectedSignature.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!isValid) {
    return null;
  }

  const payload = decode(encoded);
  if (payload.exp * 1000 < Date.now()) {
    return null;
  }

  if (payload.email !== getAllowedAdminEmail()) {
    return null;
  }

  return payload;
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
