import { NextResponse } from "next/server";

import { clearAdminSession, createAdminSession, getAllowedAdminEmail } from "@/lib/admin-session";

interface GoogleTokenInfoResponse {
  email?: string;
  email_verified?: string;
  aud?: string;
}

export async function POST(request: Request) {
  try {
    const { credential } = (await request.json()) as { credential?: string };

    if (!credential) {
      return NextResponse.json({ error: "Missing Google credential." }, { status: 400 });
    }

    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Google token verification failed." }, { status: 401 });
    }

    const tokenInfo = (await response.json()) as GoogleTokenInfoResponse;
    const allowedEmail = getAllowedAdminEmail();
    const clientId =
      process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

    if (
      !tokenInfo.email ||
      tokenInfo.email.toLowerCase() !== allowedEmail ||
      tokenInfo.email_verified !== "true" ||
      (clientId && tokenInfo.aud !== clientId)
    ) {
      return NextResponse.json({ error: "This Google account is not allowed." }, { status: 403 });
    }

    await createAdminSession(tokenInfo.email);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create admin session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
