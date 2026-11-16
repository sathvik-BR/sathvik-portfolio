"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { profile } from "@/data/content";
import { usePreloader } from "@/components/ui/PreloaderContext";
import { useLenis } from "@/components/motion/SmoothScroll";
import { splitTextReveal, fadeUp, magnetic, prefersReducedMotion } from "@/lib/motion";
import { asset } from "@/lib/assets";
import { ArrowDown, ArrowUpRight } from "lucide-react";

// Dynamic import of 3D HeroScene with ssr: false and dark background Suspense fallback
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#05060A]" />,
});

export function Hero() {
  const { isReady } = usePreloader();
  const { scrollTo } = useLenis();

  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const ghostBtnRef = useRef<HTMLAnchorElement>(null);
  const scrollIndicatorRef = useRef<HTMLButtonElement>(null);

  // Setup magnetic effects on buttons
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    if (primaryBtnRef.current) {
      cleanups.push(magnetic(primaryBtnRef.current, { strength: 0.3 }));
    }
    if (ghostBtnRef.current) {
      cleanups.push(magnetic(ghostBtnRef.current, { strength: 0.3 }));
    }
    if (scrollIndicatorRef.current) {
      cleanups.push(magnetic(scrollIndicatorRef.current, { strength: 0.15 }));
    }

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);

  // Trigger animations strictly after preloader curtain exit is complete
  useEffect(() => {
    if (!isReady) return;

    if (prefersReducedMotion()) {
      if (labelRef.current) labelRef.current.style.opacity = "1";
      if (headingRef.current) headingRef.current.style.opacity = "1";
      if (taglineRef.current) taglineRef.current.style.opacity = "1";
      if (buttonsRef.current) buttonsRef.current.style.opacity = "1";
      if (scrollIndicatorRef.current) scrollIndicatorRef.current.style.opacity = "1";
      return;
    }

    // 1. Label fadeUp
    if (labelRef.current) {
      fadeUp(labelRef.current, {
        delay: 0.1,
        yOffset: 20,
        duration: 0.6,
      });
    }

    // 2. Heading split-text reveal
    if (headingRef.current) {
      splitTextReveal(headingRef.current, {
        text: profile.name,
        delay: 0.25,
        duration: 0.9,
        by: "words",
      });
    }

    // 3. Tagline fadeUp
    if (taglineRef.current) {
      fadeUp(taglineRef.current, {
        delay: 0.55,
        yOffset: 25,
        duration: 0.8,
      });
    }

    // 4. Action buttons reveal
    if (buttonsRef.current) {
      fadeUp(buttonsRef.current, {
        delay: 0.75,
        yOffset: 20,
        duration: 0.7,
      });
    }

    // 5. Scroll indicator reveal
    if (scrollIndicatorRef.current) {
      fadeUp(scrollIndicatorRef.current, {
        delay: 1.0,
        yOffset: 15,
        duration: 0.7,
      });
    }
  }, [isReady]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 md:px-12 pt-28 pb-16 overflow-hidden bg-background"
    >
      {/* 3D React Three Fiber Galaxy Canvas Background */}
      <HeroScene />

      {/* Soft radial text-block vignette — sits between canvas and text, z-[1] */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse 72% 60% at 50% 50%, rgba(5,6,10,0.75) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle ambient accent glow spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" style={{ zIndex: 2 }} />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-accent2/10 rounded-full blur-[120px] pointer-events-none" style={{ zIndex: 2 }} />

      {/* Hero HTML Content (Readable immediately before 3D loads) */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Small mono label */}
        <div
          ref={labelRef}
          className="opacity-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface/60 backdrop-blur-md mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            AI/ML ENGINEER - BENGALURU
          </span>
        </div>

        {/* Display Heading */}
        <h1
          ref={headingRef}
          className="opacity-0 font-display text-display font-normal text-text tracking-tight leading-[1.02] mb-6 max-w-3xl"
        >
          {profile.name}
        </h1>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="opacity-0 text-body md:text-lg max-w-2xl mb-10 leading-relaxed font-sans"
          style={{ color: "#C7CAD4" }}
        >
          {profile.tagline}
        </p>

        {/* Two Magnetic Action Buttons */}
        <div
          ref={buttonsRef}
          className="opacity-0 flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          {/* Primary: View Projects */}
          <button
            ref={primaryBtnRef}
            onClick={() => scrollTo("#projects", { offset: -40 })}
            className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-accent text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-fast hover:shadow-glow-accent hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>View projects</span>
            <ArrowDown
              size={14}
              className="group-hover:translate-y-0.5 transition-transform duration-fast"
            />
          </button>

          {/* Ghost: Resume */}
          <a
            ref={ghostBtnRef}
            href={asset("/resume.pdf")}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-surface/70 border border-border hover:border-accent text-text font-mono text-xs uppercase tracking-wider backdrop-blur-sm transition-all duration-fast hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>Resume</span>
            <ArrowUpRight
              size={14}
              className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-fast"
            />
          </a>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <button
        ref={scrollIndicatorRef}
        onClick={() => scrollTo("#about", { offset: -40 })}
        className="opacity-0 absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2.5 text-muted hover:text-text transition-colors duration-fast focus:outline-none"
        aria-label="Scroll to content"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-[1.5px] h-8 bg-white/10 relative overflow-hidden rounded-full">
          <div className="w-full h-1/2 bg-gradient-to-b from-accent to-accent2 rounded-full animate-bounce" />
        </div>
      </button>
    </section>
  );
}