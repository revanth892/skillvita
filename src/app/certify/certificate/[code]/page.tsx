import { notFound } from "next/navigation";

import { CertificateActions } from "@/components/certify/CertificateActions";
import { PrintCertificateButton } from "@/components/certify/PrintCertificateButton";
import { getCertifySubmissionByCertificateCode } from "@/lib/certify-store";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const submission = await getCertifySubmissionByCertificateCode(code);

  if (!submission || !submission.certificate) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-6 flex flex-col gap-3 print:hidden md:flex-row md:items-center md:justify-end">
        <PrintCertificateButton />
        <CertificateActions
          certificateCode={submission.certificate.code}
          projectName={submission.projectName}
        />
      </div>

      <div
        id="certificate-sheet"
        className="overflow-hidden rounded-[36px] border border-[#014051]/10 bg-white shadow-[0_30px_90px_rgba(1,64,81,0.18)]"
      >
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(50,254,107,0.20),_transparent_32%),linear-gradient(135deg,#0b2530_0%,#014051_45%,#0b2530_100%)] px-8 py-14 text-white md:px-14">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent-500">
            SkillVita Certificate of Project Completion
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            {submission.teamMemberName}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-200">
            is hereby recognized by SkillVita for the successful completion and review of{" "}
            <span className="font-semibold text-white">{submission.projectName}</span>.
          </p>
        </div>

        <div className="grid gap-10 p-8 md:p-14">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <CertificateMeta label="Institution" value={submission.institutionName} />
            <CertificateMeta label="Project ID" value={submission.projectId} />
            <CertificateMeta
              label="Duration"
              value={`${formatDate(submission.projectStartDate)} - ${formatDate(submission.projectEndDate)}`}
            />
            <CertificateMeta
              label="Issued On"
              value={formatDate(submission.certificate.issuedAt)}
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[28px] bg-[#f7fbfc] p-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#014051]">
                Verified proof of work
              </h2>
              <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-gray-700">
                {submission.proofText || "Supporting project links and files were submitted during review."}
              </p>
            </div>

            <div className="rounded-[28px] border border-gray-200 bg-white p-8">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#014051]">
                Certificate details
              </h2>
              <dl className="mt-5 grid gap-4">
                <MetaRow label="Certificate Code" value={submission.certificate.code} />
                <MetaRow label="Recipient Email" value={submission.email} />
                <MetaRow label="Mobile Number" value={submission.mobileNumber} />
                <MetaRow label="Reviewed By" value={submission.certificate.reviewerEmail} />
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CertificateMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f7fbfc] px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-gray-800">{value}</dd>
    </div>
  );
}
