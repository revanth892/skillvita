import { Events } from "@/components/landing-page/events";
import { Hero } from "@/components/landing-page/Hero";
import LearningJourney from "@/components/landing-page/LearningJourney";
// import WhySkillvita from "@/components/landing-page/WhySkillvita";
import Testimonials from "@/components/landing-page/Testimonials";
// import Workshop from "@/components/landing-page/workshop";

export default function Home() {
  return (
    <>
      <Hero />
      <LearningJourney />
      <Events/>
      {/* <Workshop /> */}
      {/* <WhySkillvita /> */}
      <Testimonials />
    </>
  );
}
