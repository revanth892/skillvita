"use client";
import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Prism from "../Prism";

interface HeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export default function Hero({
  eyebrow = "Innovate Without Limits",
  title,
  subtitle,
  primaryCtaLabel,
  primaryCtaHref = "#",
  secondaryCtaLabel,
  secondaryCtaHref = "#",
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative mx-auto w-full pt-32 px-6 text-center md:px-8 min-h-screen overflow-hidden bg-black rounded-b-xl flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
        <Prism
          animationType="hover"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>
      {eyebrow && (
        <div className="group mb-8 relative z-20">
          <span className="text-sm text-green-400 font-medium mx-auto px-5 py-2 bg-green-900/20 border border-green-500/30 rounded-3xl w-fit tracking-tight uppercase flex items-center justify-center">
            {eyebrow}
            <ChevronRight className="inline w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      )}
      <h1 className="text-white py-6 text-5xl font-extrabold leading-[1.1] tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl relative z-20">
        {title}
      </h1>
      <p className="mb-12 text-lg tracking-tight text-zinc-400 md:text-xl max-w-3xl mx-auto relative z-20">
        {subtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-30 mt-10 px-4">
        {primaryCtaLabel && (
          <Button
            asChild
            className="w-full sm:w-fit md:w-52 tracking-tight text-lg py-6 rounded-xl shadow-[0_0_30px_-5px_rgba(50,254,107,0.6)] hover:shadow-green-500/60 transition-all duration-300 bg-green-600 hover:bg-green-500 text-white border-0"
          >
            <a href={primaryCtaHref}>{primaryCtaLabel}</a>
          </Button>
        )}
        {secondaryCtaLabel && (
          <Button
            asChild
            className="w-full sm:w-fit md:w-52 tracking-tight text-lg py-6 rounded-xl bg-white transition-all duration-300 text-black border border-white/20 hover:border-white/30 backdrop-blur-sm"
          >
            <a href={secondaryCtaHref}>{secondaryCtaLabel}</a>
          </Button>
        )}
      </div>
      <div className="relative mt-32" />
    </section>
  );
}
