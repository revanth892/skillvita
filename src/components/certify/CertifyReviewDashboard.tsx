"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import type { CertifySubmission } from "@/lib/certify-types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CertifyReviewDashboard({
  initialSubmissions,
  adminEmail,
}: {
  initialSubmissions: CertifySubmission[];
  adminEmail: string;
}) {
  const router = useRouter();
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedCertificateId, setExpandedCertificateId] = useState<string | null>(null);
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);
  const [emailDrafts, setEmailDrafts] = useState<Record<string, { subject: string; message: string }>>(
    {}
  );

  const handleApprove = async (submissionId: string) => {
    setBusyId(submissionId);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/admin/certify/submissions/${submissionId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const result = (await response.json()) as {
        error?: string;
        submission?: CertifySubmission;
      };

      if (!response.ok || !result.submission) {
        throw new Error(result.error || "Unable to approve this submission.");
      }

      setSubmissions(current =>
        current.map(entry => (entry.id === submissionId ? result.submission! : entry))
      );
      setMessage("Submission approved and certificate email triggered.");
      router.refresh();
    } catch (approveError) {
      setError(
        approveError instanceof Error
          ? approveError.message
          : "Unable to approve this submission."
      );
    } finally {
      setBusyId(null);
    }
  };

  const updateEmailDraft = (submissionId: string, key: "subject" | "message", value: string) => {
    setEmailDrafts(current => ({
      ...current,
      [submissionId]: {
        subject: current[submissionId]?.subject || "",
        message: current[submissionId]?.message || "",
        [key]: value,
      },
    }));
  };

  const handleSendEmail = async (submission: CertifySubmission) => {
    const draft = emailDrafts[submission.id] || { subject: "", message: "" };
    setBusyId(submission.id);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/admin/certify/submissions/${submission.id}/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Unable to send this email.");
      }

      setMessage(`Email sent to ${submission.email} from reachus@skillvita.in.`);
      setExpandedEmailId(null);
      setEmailDrafts(current => ({
        ...current,
        [submission.id]: { subject: "", message: "" },
      }));
    } catch (emailError) {
      setError(emailError instanceof Error ? emailError.message : "Unable to send this email.");
    } finally {
      setBusyId(null);
    }
  };

  const handleCopyPublicLink = async (certificateCode: string) => {
    try {
      const absoluteUrl = `${window.location.origin}/certify/certificate/${certificateCode}`;
      await navigator.clipboard.writeText(absoluteUrl);
      setMessage("Certificate public link copied.");
      setError(null);
    } catch {
      setError("Unable to copy the certificate public link.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.reload();
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 flex flex-col gap-4 rounded-[28px] bg-[#071923] p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-500">
            Certification Review
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Approve submissions and issue certificates</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300">
            Signed in as {adminEmail}. Each approval issues a unique certificate code and sends
            the recipient an email with a certificate link.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          Sign out
        </Button>
      </div>

      {message ? (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6">
        {submissions.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
            No certification submissions yet.
          </div>
        ) : (
          submissions.map(submission => (
            <article
              key={submission.id}
              className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-gray-900">{submission.projectName}</h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        submission.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {submission.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {submission.teamMemberName} · {submission.institutionName} · Project ID{" "}
                    <span className="font-semibold text-gray-900">{submission.projectId}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {submission.status === "pending" ? (
                    <Button
                      onClick={() => handleApprove(submission.id)}
                      disabled={busyId === submission.id}
                      className="rounded-full bg-[#014051] px-5 text-white hover:bg-[#022e39]"
                    >
                      {busyId === submission.id ? "Approving..." : "Approve and email certificate"}
                    </Button>
                  ) : null}

                  {submission.certificate ? (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCertificateId(current =>
                          current === submission.id ? null : submission.id
                        )
                      }
                      className="inline-flex h-9 items-center rounded-full border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      {expandedCertificateId === submission.id
                        ? "Hide certificate preview"
                        : "View certificate"}
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedEmailId(current => (current === submission.id ? null : submission.id))
                    }
                    className="inline-flex h-9 items-center rounded-full border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    {expandedEmailId === submission.id ? "Close email" : "Send email"}
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Info label="Submitted" value={formatDate(submission.submittedAt)} />
                <Info
                  label="Project Window"
                  value={`${formatDate(submission.projectStartDate)} - ${formatDate(submission.projectEndDate)}`}
                />
                <Info label="Email" value={submission.email} />
                <Info label="Mobile" value={submission.mobileNumber} />
                <Info label="DOB" value={formatDate(submission.dob)} />
                <Info label="Certificate Code" value={submission.certificate?.code || "Pending"} />
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-2xl bg-gray-50 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#014051]">
                    Proof Summary
                  </h3>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                    {submission.proofText || "No proof summary added."}
                  </p>
                </section>

                <section className="rounded-2xl bg-gray-50 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#014051]">
                    Links and Files
                  </h3>
                  <div className="mt-3 grid gap-3 text-sm">
                    {submission.proofLinks.length > 0 ? (
                      submission.proofLinks.map(link => (
                        <a
                          key={link}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-[#014051] underline underline-offset-4"
                        >
                          {link}
                        </a>
                      ))
                    ) : (
                      <p className="text-gray-500">No proof links added.</p>
                    )}

                    {submission.proofFiles.map(file => (
                      <a
                        key={file.id}
                        href={`/api/admin/certify/submissions/${submission.id}/files/${file.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-700 transition hover:border-[#014051]/30 hover:text-[#014051]"
                      >
                        {file.originalName}
                      </a>
                    ))}
                  </div>
                </section>
              </div>

              {submission.certificate && expandedCertificateId === submission.id ? (
                <section className="mt-6 rounded-[28px] border border-gray-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#014051]">
                        Certificate Preview
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Code {submission.certificate.code} · issued on{" "}
                        {formatDate(submission.certificate.issuedAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`/certify/certificate/${submission.certificate.code}`}
                        className="inline-flex h-9 items-center rounded-full border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open full certificate
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyPublicLink(submission.certificate!.code)}
                        className="inline-flex h-9 items-center rounded-full border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        Copy public link
                      </button>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                    <iframe
                      title={`Certificate preview for ${submission.teamMemberName}`}
                      src={`/certify/certificate/${submission.certificate.code}`}
                      className="h-[780px] w-full bg-white"
                    />
                  </div>
                </section>
              ) : null}

              {expandedEmailId === submission.id ? (
                <section className="mt-6 rounded-[28px] border border-gray-200 bg-gray-50 p-5">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#014051]">
                      Send Email
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      This sends through AWS SES using <strong>reachus@skillvita.in</strong>.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-4">
                    <div className="grid gap-2">
                      <label
                        htmlFor={`subject-${submission.id}`}
                        className="text-sm font-medium text-gray-800"
                      >
                        Subject
                      </label>
                      <input
                        id={`subject-${submission.id}`}
                        value={emailDrafts[submission.id]?.subject || ""}
                        onChange={event =>
                          updateEmailDraft(submission.id, "subject", event.target.value)
                        }
                        className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-[#014051] focus:ring-4 focus:ring-[#014051]/10"
                        placeholder="Your SkillVita certificate is ready"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor={`message-${submission.id}`}
                        className="text-sm font-medium text-gray-800"
                      >
                        Message
                      </label>
                      <textarea
                        id={`message-${submission.id}`}
                        value={emailDrafts[submission.id]?.message || ""}
                        onChange={event =>
                          updateEmailDraft(submission.id, "message", event.target.value)
                        }
                        className="min-h-36 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#014051] focus:ring-4 focus:ring-[#014051]/10"
                        placeholder={`Hi ${submission.teamMemberName},\n\nYour certificate is now available.`}
                      />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => handleSendEmail(submission)}
                        disabled={busyId === submission.id}
                        className="rounded-full bg-[#014051] px-5 text-white hover:bg-[#022e39]"
                      >
                        {busyId === submission.id ? "Sending..." : "Send email"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => setExpandedEmailId(null)}
                        className="inline-flex h-10 items-center rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </section>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}
