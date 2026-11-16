"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { profile } from "@/data/content";
import { usePreloader } from "./PreloaderContext";
import { EASE, prefersReducedMotion } from "@/lib/motion";

export function Preloader() {
  const { isLoading, completePreloader } = usePreloader();

  const containerRef = useRef<HTMLDivElement>(null);
  const panelTopRef = useRef<HTMLDivElement>(null);
  const panelBottomRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!isLoading) return;

    if (prefersReducedMotion()) {
      completePreloader();
      return;
    }

    const container = containerRef.current;
    const counter = counterRef.current;
    const progressLine = progressLineRef.current;
    const progressContainer = progressContainerRef.current;
    const centerContent = centerContentRef.current;
    const name = nameRef.current;
    const panelTop = panelTopRef.current;
    const panelBottom = panelBottomRef.current;

    if (
      !container ||
      !counter ||
      !progressLine ||
      !progressContainer ||
      !centerContent ||
      !name ||
      !panelTop ||
      !panelBottom
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const progressObj = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          completePreloader();
        },
      });

      // 1. Counter 0 -> 100 + Progress line animation (1.25s)
      tl.to(progressObj, {
        value: 100,
        duration: 1.25,
        ease: "power2.inOut",
        onUpdate: () => {
          const current = Math.floor(progressObj.value);
          counter.innerText = current.toString().padStart(2, "0");
        },
      });

      tl.to(
        progressLine,
        {
          scaleX: 1,
          duration: 1.25,
          ease: "power2.inOut",
        },
        0
      );

      // 2. Crossfade counter out, name in with letter spacing animation (0.45s)
      tl.to(
        [counter, progressContainer],
        {
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: EASE,
        },
        "+=0.05"
      );

      tl.fromTo(
        name,
        {
          opacity: 0,
          letterSpacing: "0.35em",
          y: 12,
        },
        {
          opacity: 1,
          letterSpacing: "0.08em",
          y: 0,
          duration: 0.45,
          ease: EASE,
        },
        "<"
      );

      // Brief hold for visual impact (0.15s)
      tl.to({}, { duration: 0.15 });

      // 3. Fade out center content & enable pass-through
      tl.to(centerContent, {
        opacity: 0,
        scale: 0.98,
        duration: 0.25,
        ease: EASE,
      });

      // 4. Two-panel curtain exit (0.55s)
      tl.to(
        panelTop,
        {
          yPercent: -100,
          duration: 0.55,
          ease: EASE,
        },
        "<"
      );

      tl.to(
        panelBottom,
        {
          yPercent: 100,
          duration: 0.55,
          ease: EASE,
        },
        "<"
      );
    }, container);

    return () => ctx.revert();
  }, [isLoading, completePreloader]);

  if (!isLoading) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-auto select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Top Half Curtain */}
      <div
        ref={panelTopRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-[#05060A] border-b border-white/[0.04]"
      />

      {/* Bottom Half Curtain */}
      <div
        ref={panelBottomRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#05060A] border-t border-white/[0.04]"
      />

      {/* Center Content */}
      <div
        ref={centerContentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6"
      >
        <div className="flex flex-col items-center justify-center">
          {/* JetBrains Mono Counter */}
          <div className="flex items-baseline gap-1 font-mono text-muted mb-2">
            <span
              ref={counterRef}
              className="text-4xl md:text-6xl font-light text-text tracking-tighter"
            >
              00
            </span>
            <span className="text-xs text-accent font-semibold tracking-widest">%</span>
          </div>

          {/* Thin Progress Line Container */}
          <div
            ref={progressContainerRef}
            className="w-44 md:w-56 h-[1.5px] bg-white/[0.08] relative overflow-hidden rounded-full"
          >
            <div
              ref={progressLineRef}
              className="w-full h-full bg-gradient-to-r from-accent via-accent to-accent2 origin-left scale-x-0"
            />
          </div>

          {/* Name Reveal at 100% */}
          <h2
            ref={nameRef}
            className="absolute opacity-0 font-display text-3xl md:text-5xl text-text font-normal text-center whitespace-nowrap"
          >
            {profile.name}
          </h2>
        </div>
      </div>
    </div>
  );
}
