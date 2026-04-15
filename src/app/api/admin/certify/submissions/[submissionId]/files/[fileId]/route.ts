import { readFile } from "fs/promises";

import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-session";
import { getCertifyProofFile } from "@/lib/certify-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ submissionId: string; fileId: string }> }
) {
  try {
    await requireAdminSession();
    const { submissionId, fileId } = await params;
    const fileRecord = await getCertifyProofFile(submissionId, fileId);

    if (!fileRecord) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    const buffer = await readFile(fileRecord.absolutePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": fileRecord.proofFile.mimeType,
        "Content-Disposition": `inline; filename="${fileRecord.proofFile.originalName}"`,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Unable to open file." }, { status: 500 });
  }
}
