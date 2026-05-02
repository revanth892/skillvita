import { CertificateActions } from "@/components/certify/CertificateActions";
import { CertificateSheet } from "@/components/certify/CertificateSheet";
import { PrintCertificateButton } from "@/components/certify/PrintCertificateButton";

const sampleCertificate = {
  certificateCode: "SV-2026-SAMPLE01",
  teamMemberName: "Aarav Sharma",
  projectName: "AI Career Assistant for Campus Hiring",
  institutionName: "SkillVita Innovation Lab",
  projectId: "SV-DEMO-2401",
  projectStartDate: "2026-01-12",
  projectEndDate: "2026-03-28",
  issuedAt: "2026-04-02",
  proofText:
    "Built a guided project workflow covering discovery, prototype validation, recruiter feedback loops, and final demo documentation. The project included UI mockups, working deployment notes, and proof links shared during review.",
  email: "aarav.sharma@example.com",
  mobileNumber: "+91 98765 43210",
  reviewerEmail: "hemanth@skillvita.in",
};

export default function SampleCertificatePage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-6 rounded-3xl border border-[#014051]/10 bg-[#f7fbfc] px-6 py-4 text-sm text-gray-700 print:hidden">
        This is a sample preview certificate for layout review. It is not tied to a real
        submission or approval record.
      </div>

      <div className="mb-6 flex flex-col gap-3 print:hidden md:flex-row md:items-center md:justify-end">
        <PrintCertificateButton />
        <CertificateActions
          certificateCode={sampleCertificate.certificateCode}
          projectName={sampleCertificate.projectName}
        />
      </div>

      <CertificateSheet
        teamMemberName={sampleCertificate.teamMemberName}
        projectName={sampleCertificate.projectName}
        institutionName={sampleCertificate.institutionName}
        projectId={sampleCertificate.projectId}
        projectStartDate={sampleCertificate.projectStartDate}
        projectEndDate={sampleCertificate.projectEndDate}
        issuedAt={sampleCertificate.issuedAt}
        proofText={sampleCertificate.proofText}
        certificateCode={sampleCertificate.certificateCode}
        email={sampleCertificate.email}
        mobileNumber={sampleCertificate.mobileNumber}
        reviewerEmail={sampleCertificate.reviewerEmail}
        variant="public"
      />

      <div className="pointer-events-none absolute left-[-99999px] top-0">
        <CertificateSheet
          teamMemberName={sampleCertificate.teamMemberName}
          projectName={sampleCertificate.projectName}
          institutionName={sampleCertificate.institutionName}
          projectId={sampleCertificate.projectId}
          projectStartDate={sampleCertificate.projectStartDate}
          projectEndDate={sampleCertificate.projectEndDate}
          issuedAt={sampleCertificate.issuedAt}
          proofText={sampleCertificate.proofText}
          certificateCode={sampleCertificate.certificateCode}
          email={sampleCertificate.email}
          mobileNumber={sampleCertificate.mobileNumber}
          reviewerEmail={sampleCertificate.reviewerEmail}
          containerId="certificate-pdf-sheet"
          variant="pdf"
        />
      </div>
    </section>
  );
}
