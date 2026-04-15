import { CertifyAdminLogin } from "@/components/certify/CertifyAdminLogin";
import { CertifyReviewDashboard } from "@/components/certify/CertifyReviewDashboard";
import { getAdminSession } from "@/lib/admin-session";
import { listCertifySubmissions } from "@/lib/certify-store";

export default async function CertifyReviewPage() {
  const session = await getAdminSession();

  if (!session) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-12 md:px-6">
        <CertifyAdminLogin clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""} />
      </section>
    );
  }

  const submissions = await listCertifySubmissions();

  return (
    <CertifyReviewDashboard initialSubmissions={submissions} adminEmail={session.email} />
  );
}
