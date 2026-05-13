export interface CertificateSheetProps {
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
  containerId?: string;
  variant?: "public" | "pdf";
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
  containerId = "certificate-sheet",
  variant = "public",
}: CertificateSheetProps) {
  if (variant === "pdf") {
    return (
      <PdfCertificateSheet
        teamMemberName={teamMemberName}
        projectName={projectName}
        institutionName={institutionName}
        projectId={projectId}
        projectStartDate={projectStartDate}
        projectEndDate={projectEndDate}
        issuedAt={issuedAt}
        proofText={proofText}
        certificateCode={certificateCode}
        email={email}
        mobileNumber={mobileNumber}
        reviewerEmail={reviewerEmail}
        containerId={containerId}
      />
    );
  }

  return (
    <PublicCertificateSheet
      teamMemberName={teamMemberName}
      projectName={projectName}
      institutionName={institutionName}
      projectId={projectId}
      projectStartDate={projectStartDate}
      projectEndDate={projectEndDate}
      issuedAt={issuedAt}
      proofText={proofText}
      certificateCode={certificateCode}
      email={email}
      mobileNumber={mobileNumber}
      reviewerEmail={reviewerEmail}
      containerId={containerId}
    />
  );
}

function PublicCertificateSheet({
  teamMemberName,
  projectName,
  institutionName,
  projectId,
  projectStartDate,
  projectEndDate,
  issuedAt,
  proofText,
  certificateCode,
  reviewerEmail,
  containerId,
}: CertificateSheetProps) {
  return (
    <div
      id={containerId}
      className="overflow-hidden rounded-[36px] border border-[#014051]/10 bg-white shadow-[0_30px_90px_rgba(1,64,81,0.18)]"
    >
      <div className="bg-[radial-gradient(circle_at_top_left,_rgba(50,254,107,0.20),_transparent_32%),linear-gradient(135deg,#0b2530_0%,#014051_45%,#0b2530_100%)] px-8 py-14 text-white md:px-14">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent-500">
              SkillVita Certificate of Skill
            </p>
            <p className="mt-3 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              Skill Badge: Verified Project Completion
            </p>
          </div>
          <img
            src="/skillvita.svg"
            alt="SkillVita logo"
            className="h-10 w-auto rounded-full bg-white/95 px-3 py-2 shadow-sm"
          />
        </div>
        <h1 className="mt-8 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          {teamMemberName}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-200">
          has completed the project{" "}
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
              <MetaRow label="Reviewed By" value={reviewerEmail} />
              <MetaRow label="Issued On" value={formatCertificateDate(issuedAt)} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function PdfCertificateSheet({
  teamMemberName,
  projectName,
  institutionName,
  projectId,
  projectStartDate,
  projectEndDate,
  issuedAt,
  certificateCode,
  reviewerEmail,
  containerId,
}: CertificateSheetProps) {
  return (
    <div
      id={containerId}
      className="relative mx-auto flex min-h-[820px] w-[1200px] overflow-hidden bg-[#fffaf4] text-[#111827]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(243,134,77,0.16),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(243,134,77,0.26),_transparent_28%)]" />
      <div className="absolute right-[-120px] top-[-80px] h-[480px] w-[480px] rounded-full border-[52px] border-[#f2d8ca]/80" />
      <div className="absolute right-[-70px] top-[10px] h-[420px] w-[420px] rounded-full border-[28px] border-[#f7e8df]/90" />
      <div className="absolute bottom-[-210px] left-[-110px] h-[430px] w-[700px] rotate-[-12deg] rounded-[55%] bg-[linear-gradient(180deg,#f29a61_0%,#d96f36_100%)] shadow-[0_30px_80px_rgba(217,111,54,0.25)]" />
      <div className="absolute bottom-[-160px] left-[150px] h-[310px] w-[620px] rotate-[-12deg] rounded-[55%] bg-[linear-gradient(180deg,#ffcca8_0%,#f09a62_100%)] opacity-95" />

      <div className="relative z-10 flex min-h-[820px] w-full flex-col px-20 py-16">
        <div className="flex justify-center">
          <div className="rounded-full bg-[#111111] px-5 py-3 shadow-sm">
            <img src="/skillvita.svg" alt="SkillVita logo" className="h-9 w-auto" />
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-[58px] font-semibold uppercase tracking-[0.1em] text-[#171717]">
            Certificate
          </p>
          <p className="mt-10 text-[42px] font-medium text-[#111827]">{teamMemberName}</p>
          <p className="mt-8 text-[24px] leading-10 text-[#374151]">
            has successfully completed
          </p>
          <p className="mt-3 text-[28px] font-semibold uppercase tracking-[0.14em] text-[#d96f36]">
            {projectName}
          </p>
          <p className="mt-4 text-[22px] leading-10 text-[#4b5563]">
            under SkillVita review and project verification
          </p>
        </div>

        <div className="mt-auto grid grid-cols-[1.2fr_0.8fr_0.9fr] items-end gap-8 text-white">
          <div className="pb-6">
            <p className="text-[18px] font-semibold">{formatCertificateDate(issuedAt)}</p>
            <div className="mt-5 space-y-2 text-[19px]">
              <p>{institutionName}</p>
              <p className="font-semibold">{projectName}</p>
              <p>{projectId}</p>
            </div>
          </div>

          <div className="pb-6 text-center text-[#fff3ec]">
            <p className="text-[15px] uppercase tracking-[0.18em] text-[#ffe5d6]">Reviewed by</p>
            <p className="mt-3 text-[22px] font-semibold text-white">SkillVita</p>
            <p className="mt-2 text-[18px] text-[#fff3ec]">{reviewerEmail}</p>
          </div>

          <div className="justify-self-end rounded-[26px] bg-[rgba(23,23,23,0.92)] px-8 py-5 text-center text-white shadow-[0_16px_40px_rgba(0,0,0,0.24)]">
            <img
              src="/images/certify/sign_HG.jpg"
              alt="Signature of Hemanth Guthala"
              className="mx-auto h-20 w-auto object-contain invert"
            />
            <div className="mt-3 border-t border-white/20 pt-3">
              <p className="text-[22px] font-semibold">Hemanth Guthala</p>
              <p className="mt-1 text-[16px] text-[#f8d7c3]">Technical Lead, SkillVita</p>
              <p className="mt-2 text-[14px] uppercase tracking-[0.14em] text-[#ffd9c4]">
                {certificateCode}
              </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-10 right-12 text-[12px] uppercase tracking-[0.28em] text-white/90">
          {formatCertificateDate(projectStartDate)} - {formatCertificateDate(projectEndDate)}
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
