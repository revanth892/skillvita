import type { Metadata } from "next";
import { Suspense } from "react";
import { IBM_Plex_Sans } from "next/font/google";
import SiteChrome from "@/components/common/SiteChrome";
import { ThemeProvider } from "@/context/ThemeContext";
import Preloader from "@/components/ui/PreLoader";
import AppLoaderWrapper from "@/components/common/AppLoaderWrapper";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: "Skillvita",
  description:
    "Skillvita is here to guide you on your career transformation. Welcome to Skillvita, your gateway to a dynamic world of learning.",
  icons: {
    icon: '/skillvita_icon.svg',
  },
  keywords: [
    "Skillvita",
    "Job Simulation",
    "Final Year Projects",
    "Portfolio Builder",
    "Career",
    "Workshops",
    "Blogs",
  ],
  openGraph: {
    title: "Skillvita - Transform Your Career",
    description:
      "Your gateway to a dynamic world of learning and career transformation.",
    url: "https://main-revitalize.vercel.app",
    siteName: "Skillvita",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Skillvita preview",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skillvita - Transform Your Career",
    description:
      "Join Skillvita to explore hands-on learning experiences and build your future.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${ibmPlexSans.variable} font-sans`}>
        <Suspense fallback={<Preloader />}>
          <ThemeProvider>
            <AppLoaderWrapper>
              <SiteChrome>{children}</SiteChrome>
            </AppLoaderWrapper>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
