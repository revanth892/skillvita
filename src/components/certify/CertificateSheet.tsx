interface CertificateSheetProps {
  teamMemberName: string;
  projectName: string;
  institutionName: string;
  projectId: string;
  projectStartDate: string;
  projectEndDate: string;
  issuedAt: string;
  proofText: string;
  certificateCode: string;
  email: string;
  mobileNumber: string;
  reviewerEmail: string;
}

export function formatCertificateDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function CertificateSheet({
  teamMemberName,
  projectName,
  institutionName,
  projectId,
  projectStartDate,
  projectEndDate,
  issuedAt,
  proofText,
  certificateCode,
  email,
  mobileNumber,
  reviewerEmail,
}: CertificateSheetProps) {
  return (
    <div
      id="certificate-sheet"
      className="overflow-hidden rounded-[36px] border border-[#014051]/10 bg-white shadow-[0_30px_90px_rgba(1,64,81,0.18)]"
    >
      <div className="bg-[radial-gradient(circle_at_top_left,_rgba(50,254,107,0.20),_transparent_32%),linear-gradient(135deg,#0b2530_0%,#014051_45%,#0b2530_100%)] px-8 py-14 text-white md:px-14">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent-500">
          SkillVita Certificate of Project Completion
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          {teamMemberName}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-200">
          is hereby recognized by SkillVita for the successful completion and review of{" "}
          <span className="font-semibold text-white">{projectName}</span>.
        </p>
      </div>

      <div className="grid gap-10 p-8 md:p-14">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CertificateMeta label="Institution" value={institutionName} />
          <CertificateMeta label="Project ID" value={projectId} />
          <CertificateMeta
            label="Duration"
            value={`${formatCertificateDate(projectStartDate)} - ${formatCertificateDate(projectEndDate)}`}
          />
          <CertificateMeta label="Issued On" value={formatCertificateDate(issuedAt)} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] bg-[#f7fbfc] p-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#014051]">
              Verified proof of work
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-gray-700">
              {proofText || "Supporting project links and files were submitted during review."}
            </p>
          </div>

          <div className="rounded-[28px] border border-gray-200 bg-white p-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#014051]">
              Certificate details
            </h2>
            <dl className="mt-5 grid gap-4">
              <MetaRow label="Certificate Code" value={certificateCode} />
              <MetaRow label="Recipient Email" value={email} />
              <MetaRow label="Mobile Number" value={mobileNumber} />
              <MetaRow label="Reviewed By" value={reviewerEmail} />
            </dl>
          </div>
        </div>
      </div>
    </div>
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
