"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

type CursorVariant = "default" | "view" | "text";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const shownRef = useRef(false);
  const [active, setActive] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");

  // 1) Decide whether the custom cursor should be used at all
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");
    if (finePointer.matches && !prefersReducedMotion()) setActive(true);
  }, []);

  // 2) Attach listeners only AFTER the cursor elements exist
  useEffect(() => {
    if (!active) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const xTo = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!shownRef.current) {
        shownRef.current = true;
        gsap.set(ring, { x: e.clientX, y: e.clientY });
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      const isTextInput = !!target.closest("input, textarea");

      if (isTextInput) setVariant("text");
      else if (cursorTarget?.dataset.cursor === "view") setVariant("view");
      else setVariant("default");

      if (target.closest("a, button, [role='button']")) {
        gsap.to(ring, { scale: 1.4, duration: 0.25, ease: "power2.out" });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button']")) {
        gsap.to(ring, { scale: 1, duration: 0.25, ease: "power2.out" });
      }
    };

    const handleLeaveWindow = () => {
      if (shownRef.current) gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };
    const handleEnterWindow = () => {
      if (shownRef.current) gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeaveWindow);
    document.documentElement.addEventListener("mouseenter", handleEnterWindow);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.documentElement.removeEventListener("mouseleave", handleLeaveWindow);
      document.documentElement.removeEventListener("mouseenter", handleEnterWindow);
      gsap.killTweensOf([dot, ring]);
    };
  }, [active]);

  // 3) Ring style per variant
  useEffect(() => {
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!active || !ring || !label || !shownRef.current) return;

    if (variant === "view") {
      gsap.to(ring, { width: 64, height: 64, borderRadius: "50%", opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(label, { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" });
    } else if (variant === "text") {
      gsap.to(ring, { width: 2, height: 24, borderRadius: 2, opacity: 0.6, duration: 0.2, ease: "power2.out" });
      gsap.to(label, { opacity: 0, scale: 0.5, duration: 0.15 });
    } else {
      gsap.to(ring, { width: 36, height: 36, borderRadius: "50%", opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(label, { opacity: 0, scale: 0.5, duration: 0.15 });
    }
  }, [variant, active]);

  if (!active) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[99998] pointer-events-none mix-blend-difference will-change-transform"
        style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#EDEEF2" }}
        aria-hidden="true"
      />

      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[99997] pointer-events-none will-change-transform flex items-center justify-center"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(124, 92, 255, 0.7)",
        }}
        aria-hidden="true"
      >
        <span
          ref={labelRef}
          className="font-mono text-[9px] uppercase tracking-wider text-text"
          style={{ opacity: 0, transform: "scale(0.5)" }}
        >
          View
        </span>
      </div>
    </>
  );
}