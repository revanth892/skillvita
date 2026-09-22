import nodemailer from "nodemailer";

import type { CertifySubmission } from "@/lib/certify-types";

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function getTransportConfig() {
  const host = process.env.SMTP_HOST || "";
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured");
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  };
}

function getSender() {
  return {
    email: process.env.CERTIFY_FROM_EMAIL || "reachus@skillvita.in",
    name: process.env.CERTIFY_FROM_NAME || "SkillVita",
  };
}

function getTransporter() {
  return nodemailer.createTransport(getTransportConfig());
}

export async function sendCertifyPortalEmail({
  toEmail,
  toName,
  subject,
  html,
  text,
}: {
  toEmail: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const sender = getSender();
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `${sender.name} <${sender.email}>`,
    to: toName ? `${toName} <${toEmail}>` : toEmail,
    subject,
    html,
    text,
  });
}

export async function sendCertificateApprovalEmail(submission: CertifySubmission) {
  if (!submission.certificate) {
    throw new Error("Certificate data missing");
  }

  const certificateUrl = `${getAppUrl()}/certify/certificate/${submission.certificate.code}`;

  await sendCertifyPortalEmail({
    toEmail: submission.email,
    toName: submission.teamMemberName,
    subject: `Your SkillVita certificate is ready for ${submission.projectName}`,
    text: `Hi ${submission.teamMemberName},

Your submission for ${submission.projectName} has been reviewed and approved by SkillVita.

Certificate ID: ${submission.certificate.code}
Certificate link: ${certificateUrl}`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #0f172a;">
          <div style="background: linear-gradient(135deg, #014051, #0c1f2d); color: white; padding: 32px; border-radius: 20px 20px 0 0;">
            <p style="margin: 0 0 8px; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.8;">SkillVita Certification</p>
            <h1 style="margin: 0; font-size: 32px; line-height: 1.2;">Your certificate has been approved</h1>
          </div>
          <div style="padding: 32px; background: #ffffff; border: 1px solid #e2e8f0; border-top: 0; border-radius: 0 0 20px 20px;">
            <p style="font-size: 16px; line-height: 1.7;">Hi ${submission.teamMemberName},</p>
            <p style="font-size: 16px; line-height: 1.7;">
              Your submission for <strong>${submission.projectName}</strong> has been reviewed and approved by SkillVita.
            </p>
            <p style="font-size: 16px; line-height: 1.7;">
              Certificate ID: <strong>${submission.certificate.code}</strong>
            </p>
            <p style="margin: 28px 0;">
              <a href="${certificateUrl}" style="display: inline-block; background: #32FE6B; color: #06210d; padding: 14px 22px; border-radius: 999px; text-decoration: none; font-weight: 700;">
                View and Download Certificate
              </a>
            </p>
            <p style="font-size: 14px; line-height: 1.7; color: #475569;">
              If the button does not open, copy this link into your browser:<br />
              <a href="${certificateUrl}" style="color: #014051;">${certificateUrl}</a>
            </p>
          </div>
        </div>
      `,
  });
}
