"use client";

import { usePathname } from "next/navigation";

import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import Footer from "@/components/landing-page/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandaloneCertificatePage =
    pathname.startsWith("/certify/certificate/") || pathname.startsWith("/certify/sample");

  if (isStandaloneCertificatePage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="mt-16 md:mt-18" />
      {children}
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
