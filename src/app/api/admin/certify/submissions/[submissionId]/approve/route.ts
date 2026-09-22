import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-session";
import { approveCertifySubmission } from "@/lib/certify-store";
import { sendCertificateApprovalEmail } from "@/lib/certify-email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const session = await requireAdminSession();
    const { submissionId } = await params;
    const body = (await request.json().catch(() => ({}))) as { reviewNotes?: string };

    const submission = await approveCertifySubmission(
      submissionId,
      session.email,
      body.reviewNotes?.trim()
    );

    if (!submission) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    await sendCertificateApprovalEmail(submission);

    return NextResponse.json({ submission });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message =
      error instanceof Error ? error.message : "Unable to approve submission.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
