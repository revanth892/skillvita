"use client";

import React, { useRef, useState } from "react";
import { Play } from "lucide-react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section
      id="video-section"
      className="py-24 px-4 md:px-8 bg-black relative w-full overflow-hidden"
    >
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-white tracking-tight">
          Know more about our{" "}
          <span className="text-green-500">hiring portal</span>
        </h2>

        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-green-500/20 border border-green-500/20 bg-zinc-900 group">
          <video
            ref={videoRef}
            className="w-full h-full object-cover cursor-pointer"
            controls={isPlaying}
            preload="none"
            onClick={handlePlay}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          >
            <source
              src="https://coursevita-storate.s3.ap-south-1.amazonaws.com/1772130618676-Coursevita+-+Skill+%26+Chill.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {!isPlaying && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer transition-all duration-300 group-hover:bg-black/20 z-20"
              onClick={handlePlay}
            >
              <div className="w-20 h-20 md:w-28 md:h-28 bg-green-500/20 rounded-full flex items-center justify-center backdrop-blur-md border border-green-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:bg-green-500/30">
                <Play
                  className="w-8 h-8 md:w-12 md:h-12 text-green-400 ml-2"
                  fill="currentColor"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
