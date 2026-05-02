import { notFound } from "next/navigation";

import { CertificateActions } from "@/components/certify/CertificateActions";
import { CertificateSheet } from "@/components/certify/CertificateSheet";
import { PrintCertificateButton } from "@/components/certify/PrintCertificateButton";
import { getCertifySubmissionByCertificateCode } from "@/lib/certify-store";

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

      <CertificateSheet
        teamMemberName={submission.teamMemberName}
        projectName={submission.projectName}
        institutionName={submission.institutionName}
        projectId={submission.projectId}
        projectStartDate={submission.projectStartDate}
        projectEndDate={submission.projectEndDate}
        issuedAt={submission.certificate.issuedAt}
        proofText={submission.proofText}
        certificateCode={submission.certificate.code}
        email={submission.email}
        mobileNumber={submission.mobileNumber}
        reviewerEmail={submission.certificate.reviewerEmail}
        variant="public"
      />

      <div className="pointer-events-none absolute left-[-99999px] top-0">
        <CertificateSheet
          teamMemberName={submission.teamMemberName}
          projectName={submission.projectName}
          institutionName={submission.institutionName}
          projectId={submission.projectId}
          projectStartDate={submission.projectStartDate}
          projectEndDate={submission.projectEndDate}
          issuedAt={submission.certificate.issuedAt}
          proofText={submission.proofText}
          certificateCode={submission.certificate.code}
          email={submission.email}
          mobileNumber={submission.mobileNumber}
          reviewerEmail={submission.certificate.reviewerEmail}
          containerId="certificate-pdf-sheet"
          variant="pdf"
        />
      </div>
    </section>
  );
}
