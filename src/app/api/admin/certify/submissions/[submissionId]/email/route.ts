import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-session";
import { sendCertifyPortalEmail } from "@/lib/certify-email";
import { getCertifySubmissionById } from "@/lib/certify-store";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatBodyToHtml(body: string) {
  return escapeHtml(body).replace(/\n/g, "<br />");
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const session = await requireAdminSession();
    const { submissionId } = await params;
    const body = (await request.json()) as {
      subject?: string;
      message?: string;
    };

    const subject = body.subject?.trim() || "";
    const message = body.message?.trim() || "";

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 }
      );
    }

    const submission = await getCertifySubmissionById(submissionId);
    if (!submission) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    await sendCertifyPortalEmail({
      toEmail: submission.email,
      toName: submission.teamMemberName,
      subject,
      text: `${message}\n\nSent by ${session.email} from the SkillVita certify admin portal.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #0f172a;">
          <div style="background: linear-gradient(135deg, #014051, #0c1f2d); color: white; padding: 28px; border-radius: 20px 20px 0 0;">
            <p style="margin: 0 0 8px; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.8;">SkillVita Admin Message</p>
            <h1 style="margin: 0; font-size: 28px; line-height: 1.2;">${escapeHtml(subject)}</h1>
          </div>
          <div style="padding: 28px; background: #ffffff; border: 1px solid #e2e8f0; border-top: 0; border-radius: 0 0 20px 20px;">
            <p style="font-size: 16px; line-height: 1.7;">Hi ${escapeHtml(submission.teamMemberName)},</p>
            <p style="font-size: 16px; line-height: 1.8;">${formatBodyToHtml(message)}</p>
            <p style="margin-top: 24px; font-size: 13px; line-height: 1.7; color: #475569;">
              Sent from the SkillVita certify admin portal by ${escapeHtml(session.email)}.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const message =
      error instanceof Error ? error.message : "Unable to send email right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
