import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-session";
import { listCertifySubmissions } from "@/lib/certify-store";

export async function GET() {
  try {
    await requireAdminSession();
    const submissions = await listCertifySubmissions();
    return NextResponse.json({ submissions });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
