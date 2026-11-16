"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@/data/content";
import { splitTextReveal, fadeUp, prefersReducedMotion, EASE } from "@/lib/motion";

// All tech names flattened for marquee
const allTech = Object.values(skills).flat();

function SpotlightCard({
  category,
  techs,
  index,
}: {
  category: string;
  techs: string[];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  // Spotlight: radial gradient follows cursor over the card
  useEffect(() => {
    const card = cardRef.current;
    const gradient = gradientRef.current;
    if (!card || !gradient) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gradient.style.background = `radial-gradient(220px circle at ${x}px ${y}px, rgba(124,92,255,0.12) 0%, transparent 70%)`;
    };
    const handleMouseLeave = () => {
      gradient.style.background = "transparent";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Stagger chips in on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) {
      if (chipsRef.current) gsap.set(chipsRef.current.children, { opacity: 1, y: 0 });
      return;
    }
    const chips = chipsRef.current?.children;
    if (!chips || chips.length === 0) return;

    gsap.fromTo(
      chips,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.055,
        ease: EASE,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative group bg-surface border border-border rounded-2xl p-6 overflow-hidden transition-all duration-base hover:border-accent/30"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Spotlight overlay */}
      <div
        ref={gradientRef}
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-fast"
        style={{ zIndex: 0 }}
      />

      <div className="relative z-10 flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          {category}
        </span>
        <div ref={chipsRef} className="flex flex-wrap gap-2">
          {techs.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-background border border-border text-muted hover:border-accent/40 hover:text-text transition-all duration-fast"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) return;

    const track = trackRef.current;
    if (!track) return;

    // Double the items for seamless loop
    const totalWidth = track.scrollWidth / 2;
    tweenRef.current = gsap.to(track, {
      x: -totalWidth,
      duration: 28,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: string) => parseFloat(x) % totalWidth),
      },
    });

    const handlePause = () => tweenRef.current?.pause();
    const handlePlay = () => tweenRef.current?.play();
    const container = track.parentElement;
    container?.addEventListener("mouseenter", handlePause);
    container?.addEventListener("mouseleave", handlePlay);
    return () => {
      tweenRef.current?.kill();
      container?.removeEventListener("mouseenter", handlePause);
      container?.removeEventListener("mouseleave", handlePlay);
    };
  }, []);

  const items = [...allTech, ...allTech]; // duplicate for loop

  return (
    <div className="relative overflow-hidden w-full py-4 mb-14">
      {/* fade edges */}
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div ref={trackRef} className="flex gap-5 whitespace-nowrap will-change-transform">
        {items.map((tech, i) => (
          <span
            key={i}
            className="font-mono text-xs text-muted px-3 py-1.5 border border-border rounded-full bg-surface/50 shrink-0 select-none"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        fadeUp(labelRef.current, { duration: 0.6, yOffset: 16, trigger: labelRef.current, start: "top 88%" });
      }
      if (headingRef.current) {
        splitTextReveal(headingRef.current, {
          text: "Skills & Tools",
          duration: 0.85,
          by: "words",
          trigger: headingRef.current,
          start: "top 85%",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full py-section bg-background overflow-hidden"
    >
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-accent2/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-14">
          <div ref={labelRef} className="opacity-0">
            <span className="font-mono text-xs uppercase tracking-widest text-accent border border-accent/30 bg-accent/5 px-3 py-1 rounded-full">
              Skills
            </span>
          </div>
          <h2
            ref={headingRef}
            className="opacity-0 font-display text-h2 font-normal text-text tracking-tight"
          >
            Skills &amp; Tools
          </h2>
        </div>

        {/* Marquee */}
        <Marquee />

        {/* Skill category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(skills).map(([category, techs], i) => (
            <SpotlightCard key={category} category={category} techs={techs} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
