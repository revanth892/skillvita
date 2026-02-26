"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import recruitAnimation from "../../../public/images/navbar/recruit.json";
import Scroll from "../ui/scroll/scroll";

const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.1, ease: "easeOut" as const },
};

export default function HiringMenu({
  isMobile = false,
  onItemClick,
}: {
  isMobile?: boolean;
  onItemClick?: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
  const scrollRef = useRef<HTMLDivElement>(null);
  const cards = [1, 2, 3]; // used for pagination dots

  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;
    const handleScroll = () => {
      const scrollLeft = scrollRef.current!.scrollLeft;
      const cardWidth = 280; // consistent with tailwind min-w + gap
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    };
    const ref = scrollRef.current;
    ref.addEventListener("scroll", handleScroll);
    return () => ref.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const cardClasses =
    "min-w-[300px] md:max-w-none h-[200px] bg-[#F9F8FA] dark:bg-[#18181B] rounded-xl p-6 flex flex-col items-start justify-start flex-shrink-0 hover:cursor-pointer border border-white dark:border-black hover:border-accent-500/30 dark:hover:border-accent-500/30 transition-all duration-300";

  return (
    <div className="flex flex-col gap-4">
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className={`flex overflow-x-auto gap-4 -mx-1 scrollbar-hide md:grid md:grid-cols-3 md:gap-4 md:overflow-visible`}
      >
        {/* Card 1 - Get Hired */}
        <Link href="https://skillvita.coursevita.com/" onClick={onItemClick}>
          <motion.div {...cardAnimation} className={`group ${cardClasses}`}>
            <h3 className="text-lg font-medium">
              <span className="inline-block text-black dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-500 group-hover:to-accent-500 dark:group-hover:text-transparent dark:group-hover:bg-clip-text dark:group-hover:bg-gradient-to-r dark:group-hover:from-brand-500 dark:group-hover:to-accent-500">
                Get Hired
              </span>
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
              Apply to top companies with the right skills
            </p>
            <div className="mt-4 w-full max-w-[500px]">
              <Scroll
                images={[
                  "/images/navbar/Blinkit_logo.svg",
                  "/images/navbar/myntra_logo.svg",
                  "/images/navbar/cred_logo.png",
                  "/images/navbar/netflix.svg",
                  "/images/navbar/slack_logo.svg",
                  "/images/navbar/swiggy_logo.svg",
                  "/images/navbar/Uber_logo.svg",
                  "/images/navbar/Zomato_logo.svg",
                ]}
                direction="horizontal"
                imageBgColors={[
                  "#ffe24b",
                  "#ffff",
                  "#ffff",
                  "#000000",
                  "#ffff",
                  "#fc8019",
                  "#000000",
                  "#e23844",
                ]}
                speed="10s"
              />
            </div>
          </motion.div>
        </Link>

        {/* Card 2 - Hire for your company */}
        <Link
          href="/hiringportal"
          onClick={onItemClick}
        >
          <motion.div
            {...cardAnimation}
            className={`group ${cardClasses} relative`}
          >
            <h3 className="text-lg font-medium">
              <span className="inline-block text-black dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-500 group-hover:to-accent-500 dark:group-hover:text-transparent dark:group-hover:bg-clip-text dark:group-hover:bg-gradient-to-r dark:group-hover:from-brand-500 dark:group-hover:to-accent-500">
                Hire for your company
              </span>
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
              India&apos;s 1st Skill Based Hiring Platform
            </p>

            {/* Lottie Animation pinned to bottom-right */}
            <div className="absolute bottom-12 right-6 w-40 h-24">
              <Lottie animationData={recruitAnimation} loop autoplay />
            </div>
          </motion.div>
        </Link>

        {/* Card 3 - Work with Skillvita */}
        <Link
          href="https://coursevita.zohorecruit.in/jobs/Careers"
          onClick={onItemClick}
        >
          <motion.div
            {...cardAnimation}
            className={`group ${cardClasses} relative`}
          >
            <div className="pr-4">
              <h3 className="text-lg font-medium">
                <span className="inline-block text-black dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-500 group-hover:to-accent-500 dark:group-hover:text-transparent dark:group-hover:bg-clip-text dark:group-hover:bg-gradient-to-r dark:group-hover:from-brand-500 dark:group-hover:to-accent-500">
                  Work with Skillvita
                </span>
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                Join us in shaping the future of learning and hiring.
              </p>
            </div>

            {/* Image pinned to bottom-right */}
            <div className="absolute bottom-0 right-4">
              <Image
                src="/images/navbar/work.svg"
                alt="Skillvita Team"
                width={200}
                height={60}
                className=""
              />
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Pagination Dots for mobile */}
      {isMobile && (
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-1.5 px-2 py-1 rounded-full bg-brand-950">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "bg-accent-500 w-4" : "bg-white w-1.5"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Card 4 - Always Full Width */}
      <motion.div
        {...cardAnimation}
        className="group bg-[#F9F8FA] dark:bg-[#18181B] rounded-xl p-4 w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-4 md:mb-0 border border-white dark:border-black hover:border-accent-500/30 dark:hover:border-accent-500/30 transition-all duration-300"
      >
        <div className="hidden md:flex flex-row items-center gap-6 text-left">
          <h4 className="text-xs lg:text-[16px] font-medium text-black dark:text-white">
            <span className="inline-block text-black dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-500 group-hover:to-accent-500 dark:group-hover:text-transparent dark:group-hover:bg-clip-text dark:group-hover:bg-gradient-to-r dark:group-hover:from-brand-500 dark:group-hover:to-accent-500">
              Flexible Mentorship, Big Earnings!
            </span>
          </h4>

          <video
            src="/images/navbar/hiring.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-34 h-14 rounded-full object-cover"
          />

          <p className="text-xs text-gray-600 dark:text-gray-400">
            Earn up to ₹5000/week on average with just 4 hours of mentoring
          </p>
        </div>

        {/* Mobile layout */}
        <div className="flex w-full items-center justify-between md:hidden gap-4">
          <h4 className="text-sm font-medium text-black dark:text-white">
            Flexible Mentorship, Big Earnings!
          </h4>
          <Link
            href="/coachvita"
            onClick={onItemClick}
            className="text-xs text-black dark:text-white font-normal bg-white dark:bg-black px-2 py-2 rounded-lg text-center border"
          >
            Become a mentor →
          </Link>
        </div>

        {/* Desktop/Tablet button */}
        <Link
          href="/coachvita"
          onClick={onItemClick}
          className="hidden md:block lg:text-sm text-xs text-white dark:text-black font-normal bg-black dark:bg-white px-4 py-3 rounded-lg text-center border"
        >
          Become a mentor →
        </Link>
      </motion.div>
    </div>
  );
}
