"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { certifications } from "@/data/content";
import { splitTextReveal, fadeUp, prefersReducedMotion, EASE } from "@/lib/motion";
import { ArrowUpRight } from "lucide-react";

export function Certifications() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    if (prefersReducedMotion()) {
      [labelRef, headingRef].forEach(r => {
        if (r.current) gsap.set(r.current, { opacity: 1 });
      });
      if (listRef.current) {
        gsap.set(listRef.current.children, { opacity: 1, y: 0, x: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        fadeUp(labelRef.current, { duration: 0.6, yOffset: 16, trigger: labelRef.current, start: "top 88%" });
      }
      if (headingRef.current) {
        splitTextReveal(headingRef.current, {
          text: "Certifications",
          duration: 0.85,
          by: "words",
          trigger: headingRef.current,
          start: "top 85%",
        });
      }
      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: EASE,
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 86%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="relative w-full py-section bg-surface/30 overflow-hidden"
    >
      <div className="absolute top-1/2 right-0 w-[400px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-14">
          <div ref={labelRef} className="opacity-0">
            <span className="font-mono text-xs uppercase tracking-widest text-accent border border-accent/30 bg-accent/5 px-3 py-1 rounded-full">
              Credentials
            </span>
          </div>
          <h2
            ref={headingRef}
            className="opacity-0 font-display text-h2 font-normal text-text tracking-tight"
          >
            Certifications
          </h2>
        </div>

        {/* Certification list */}
        <div ref={listRef} className="flex flex-col divide-y divide-border">
          {certifications.map((cert) => (
            <CertRow key={cert.title} cert={cert} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CertRow({ cert }: { cert: { title: string; issuer: string; year: string } }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const arrow = arrowRef.current;
    if (!row || !arrow || prefersReducedMotion()) return;

    const handleEnter = () => {
      gsap.to(row, {
        x: 10,
        borderColor: "rgba(124, 92, 255, 0.5)",
        duration: 0.3,
        ease: EASE,
      });
      gsap.to(arrow, { opacity: 1, x: 0, duration: 0.25, ease: EASE });
    };
    const handleLeave = () => {
      gsap.to(row, {
        x: 0,
        borderColor: "transparent",
        duration: 0.35,
        ease: EASE,
      });
      gsap.to(arrow, { opacity: 0, x: -6, duration: 0.2 });
    };

    row.addEventListener("mouseenter", handleEnter);
    row.addEventListener("mouseleave", handleLeave);
    return () => {
      row.removeEventListener("mouseenter", handleEnter);
      row.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={rowRef}
      className="group flex items-center justify-between gap-4 py-5 px-3 -mx-3 rounded-lg border border-transparent cursor-default transition-colors"
      style={{ willChange: "transform" }}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-text font-medium text-sm md:text-base leading-snug truncate">
          {cert.title}
        </span>
        <span className="font-mono text-xs text-muted">
          {cert.issuer}
        </span>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="font-mono text-xs text-accent/70 border border-accent/20 bg-accent/5 px-2.5 py-1 rounded-full">
          {cert.year}
        </span>
        <span
          ref={arrowRef}
          className="text-accent opacity-0"
          style={{ transform: "translateX(-6px)" }}
          aria-hidden="true"
        >
          <ArrowUpRight size={16} />
        </span>
      </div>
    </div>
  );
}
