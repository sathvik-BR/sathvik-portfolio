"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile, projects, certifications } from "@/data/content";
import { splitTextReveal, fadeUp, prefersReducedMotion, EASE } from "@/lib/motion";
import { asset } from "@/lib/assets";

function PhotoFallback() {
  return (
    <div className="w-full h-full min-h-[380px] bg-surface border border-border rounded-2xl flex flex-col items-center justify-center select-none">
      <span className="font-mono text-4xl font-bold text-accent/60 tracking-tight">BRS</span>
      <span className="font-mono text-xs text-muted mt-2 tracking-widest uppercase">Photo</span>
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const eduRef = useRef<HTMLDivElement>(null);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    if (prefersReducedMotion()) {
      [labelRef, headingRef, summaryRef, statsRef, eduRef].forEach(r => {
        if (r.current) gsap.set(r.current, { opacity: 1, y: 0 });
      });
      if (imageWrapRef.current) gsap.set(imageWrapRef.current, { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" });
      return;
    }

    const ctx = gsap.context(() => {
      // Image: clip-path reveal (top → open) + parallax
      if (imageWrapRef.current) {
        gsap.fromTo(
          imageWrapRef.current,
          { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.0,
            ease: EASE,
            scrollTrigger: {
              trigger: imageWrapRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
        // Slow parallax on scroll
        gsap.to(imageWrapRef.current, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // Text elements: staggered fadeUp
      if (labelRef.current) {
        fadeUp(labelRef.current, { delay: 0.05, duration: 0.6, yOffset: 18, trigger: labelRef.current, start: "top 88%" });
      }
      if (headingRef.current) {
        splitTextReveal(headingRef.current, {
          text: "Who I am",
          duration: 0.85,
          by: "words",
          trigger: headingRef.current,
          start: "top 85%",
        });
      }
      if (summaryRef.current) {
        fadeUp(summaryRef.current, { delay: 0.1, duration: 0.9, yOffset: 22, trigger: summaryRef.current, start: "top 86%" });
      }
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll(".stat-item");
        gsap.fromTo(
          statItems,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: EASE,
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 86%",
              toggleActions: "play none none none",
            },
          }
        );
        // Count-up for stat numbers
        statItems.forEach((item) => {
          const numEl = item.querySelector<HTMLSpanElement>(".stat-number");
          if (!numEl) return;
          const target = parseFloat(numEl.dataset.target || "0");
          const isFloat = String(numEl.dataset.target).includes(".");
          const prefix = numEl.dataset.prefix || "";
          const suffix = numEl.dataset.suffix || "";
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.4,
            ease: "power2.out",
            delay: 0.3,
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 86%",
              toggleActions: "play none none none",
            },
            onUpdate: () => {
              numEl.textContent =
                prefix + (isFloat ? obj.val.toFixed(2) : Math.floor(obj.val).toString()) + suffix;
            },
          });
        });
      }
      if (eduRef.current) {
        fadeUp(eduRef.current, { delay: 0.05, duration: 0.75, yOffset: 20, trigger: eduRef.current, start: "top 88%" });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { suffix: "", label: "AI Projects", target: String(projects.length) },
    { suffix: "+", label: "AUC-ROC (MediScan)", target: "0.96" },
    { suffix: "", label: "Certifications", target: String(certifications.length) },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-section bg-background overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* LEFT: Photo column */}
          <div className="flex flex-col items-center md:items-start gap-4">
            {/* Glow behind photo */}
            <div className="relative w-full max-w-sm mx-auto md:mx-0">
              <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 via-accent2/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />
              <div
                ref={imageWrapRef}
                className="relative rounded-2xl overflow-hidden border border-border shadow-2xl opacity-0"
                style={{ clipPath: "inset(100% 0% 0% 0%)" }}
              >
                {!photoError ? (
                  <Image
                    src={asset("/images/sathvik.jpg")}
                    alt="B R Sathvik — AI/ML Engineer, Bengaluru"
                    width={480}
                    height={560}
                    className="w-full h-auto object-cover object-top"
                    priority
                    onError={() => setPhotoError(true)}
                  />
                ) : (
                  <PhotoFallback />
                )}
              </div>
            </div>
            {/* Caption */}
            <span className="font-mono text-xs text-muted uppercase tracking-widest text-center md:text-left w-full max-w-sm mx-auto md:mx-0 pl-1">
              📍 Bengaluru, India
            </span>
          </div>

          {/* RIGHT: Text column */}
          <div className="flex flex-col gap-7">
            {/* Mono label */}
            <div ref={labelRef} className="opacity-0">
              <span className="font-mono text-xs uppercase tracking-widest text-accent border border-accent/30 bg-accent/5 px-3 py-1 rounded-full">
                About
              </span>
            </div>

            {/* h2 heading */}
            <h2
              ref={headingRef}
              className="opacity-0 font-display text-h2 font-normal text-text tracking-tight"
            >
              Who I am
            </h2>

            {/* Summary paragraph */}
            <p ref={summaryRef} className="opacity-0 text-body leading-[1.75] text-muted max-w-xl">
              {profile.summary}
            </p>

            {/* 3-stat row with count-up */}
            <div ref={statsRef} className="grid grid-cols-3 gap-4 py-6 border-y border-border">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-item opacity-0 flex flex-col gap-1">
                  <span className="font-display text-3xl md:text-4xl font-normal text-text">
                    <span
                      className="stat-number"
                      data-target={stat.target}
                      data-suffix={stat.suffix}
                    >
                      0
                    </span>
                  </span>
                  <span className="font-mono text-[10px] text-muted uppercase tracking-wider leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Education */}
            <div ref={eduRef} className="opacity-0 flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">Education</span>
              <div className="flex flex-col gap-0.5 pl-3 border-l border-accent/30">
                <span className="text-sm text-text font-medium leading-snug">
                  {profile.education.degree}
                </span>
                <span className="text-xs text-muted">
                  {profile.education.college}
                </span>
                <span className="font-mono text-xs text-accent/80 mt-0.5">
                  {profile.education.years}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}