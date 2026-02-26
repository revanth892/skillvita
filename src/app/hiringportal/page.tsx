"use client";
import Hero from "../../components/hiringportal/Hero";
import Overview from "../../components/hiringportal/Overview";
import WhySkillVita from "../../components/hiringportal/WhySkillVita";
import Steps from "../../components/hiringportal/Steps";
import Categories from "../../components/hiringportal/Categories";
import RecruiterFAQ from "../../components/hiringportal/RecruiterFAQ";
import RegisterSection from "../../components/hiringportal/RegisterSection";
import VideoSection from "../../components/hiringportal/VideoSection";

export default function HiringPortalPage() {
  return (
    <main className="min-h-screen font-sans text-white bg-black selection:bg-green-500/30 selection:text-green-200">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Hiring Portal | SkillVita",
            description:
              "Access a curated pipeline of job ready students with portfolios built through real simulations, projects, team workflows, and capability assessments.",
            url: "https://main-revitalize.vercel.app/hiringportal",
            isPartOf: {
              "@type": "Website",
              name: "SkillVita",
              url: "https://main-revitalize.vercel.app",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "SkillVita Hiring Portal",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "A hiring platform based on execution and verified proof of work rather than resumes. Discover candidates through real projects and role based simulations.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "INR",
            },
            featureList: [
              "Post Jobs",
              "Source Profiles",
              "Evaluate Portfolios",
              "Simulated Experience Assessments",
              "Capability Scores",
            ],
            provider: {
              "@type": "Organization",
              name: "SkillVita",
              url: "https://main-revitalize.vercel.app",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://main-revitalize.vercel.app",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Hiring Portal",
                item: "https://main-revitalize.vercel.app/hiringportal",
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "SkillVita",
            url: "https://main-revitalize.vercel.app",
            logo: {
              "@type": "ImageObject",
              url: "https://main-revitalize.vercel.app/skillvita_icon.svg",
            },
          }),
        }}
      />
      <Hero
        eyebrow=""
        title={
          <>
            Hire{" "}
            <span className="text-green-500 relative inline-block">
              Job
              <span className="absolute bottom-0 left-0 w-full h-1 bg-green-500/20 rounded-full blur-sm"></span>
            </span>{" "}
            Ready{" "}
            <span className="text-green-500 relative inline-block">
              Talent
              <span className="absolute bottom-0 left-0 w-full h-1 bg-green-500/20 rounded-full blur-sm"></span>
            </span>{" "}
            <br className="hidden lg:block" />
            With{" "}
            <span className="text-green-500 relative inline-block">
              Verified
              <span className="absolute bottom-0 left-0 w-full h-1 bg-green-500/20 rounded-full blur-sm"></span>
            </span>{" "}
            Execution
          </>
        }
        subtitle="Access job ready talent with verified proof of work so you can shortlist confidently and reduce hiring risk."
        primaryCtaLabel="Know more"
        primaryCtaHref="#video-section"
        secondaryCtaLabel="Login/Register"
        secondaryCtaHref="#register-section"
      />
      {/* <HiringWorkflowSection /> */}
      <VideoSection />
      <RegisterSection />
      <Steps />
      <Overview />
      <WhySkillVita />
      <Categories />
      <RecruiterFAQ />
    </main>
  );
}
