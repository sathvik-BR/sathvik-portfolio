import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger safely in browser context
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Design tokens for motion and animations
 */
export const MOTION_TOKENS = {
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  easeArray: [0.16, 1, 0.3, 1] as const,
  durations: {
    fast: 0.4,
    base: 0.8,
    slow: 1.2,
    stagger: 0.06,
  },
} as const;

export const EASE = MOTION_TOKENS.ease;
export const EASE_ARRAY = MOTION_TOKENS.easeArray;
export const DURATION = MOTION_TOKENS.durations;

/**
 * Global check: All animations are disabled when prefers-reduced-motion is set
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Helper: Split text into word spans and animate them with stagger
 */
export interface SplitTextRevealOptions {
  text?: string;
  trigger?: HTMLElement | string;
  start?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  by?: "words" | "chars";
  onComplete?: () => void;
}

export function splitTextReveal(
  element: HTMLElement | string,
  options: SplitTextRevealOptions = {}
): gsap.core.Timeline | gsap.core.Tween | null {
  if (typeof window === "undefined") return null;

  const target =
    typeof element === "string" ? document.querySelector<HTMLElement>(element) : element;

  if (!target) return null;

  // Global reduced motion override
  if (prefersReducedMotion()) {
    if (options.text) target.textContent = options.text;
    gsap.set(target, { opacity: 1, y: 0, clearProps: "all" });
    options.onComplete?.();
    return null;
  }

  const {
    text,
    trigger = target,
    start = "top 85%",
    delay = 0,
    duration = DURATION.base,
    stagger = DURATION.stagger,
    by = "words",
    onComplete,
  } = options;

  // Use provided text or fallback to textContent
  const originalText = text || target.textContent?.trim() || "";
  if (!originalText) {
    gsap.set(target, { opacity: 1 });
    options.onComplete?.();
    return null;
  }

  // Clear container and make sure parent is visible
  target.innerHTML = "";
  gsap.set(target, { opacity: 1 });

  const units = by === "chars" ? originalText.split("") : originalText.split(/\s+/);
  const spanWrappers: HTMLSpanElement[] = [];

  units.forEach((unit, idx) => {
    const outer = document.createElement("span");
    outer.style.display = "inline-block";
    outer.style.overflow = "hidden";
    outer.style.verticalAlign = "top";

    const inner = document.createElement("span");
    inner.style.display = "inline-block";
    inner.textContent = unit + (by === "words" && idx < units.length - 1 ? "\u00A0" : "");
    inner.classList.add("split-text-unit");

    outer.appendChild(inner);
    target.appendChild(outer);
    spanWrappers.push(inner);
  });

  return gsap.fromTo(
    spanWrappers,
    {
      yPercent: 110,
      opacity: 0,
    },
    {
      yPercent: 0,
      opacity: 1,
      duration,
      stagger,
      delay,
      ease: EASE,
      scrollTrigger:
        trigger && trigger !== target
          ? {
              trigger,
              start,
              toggleActions: "play none none none",
            }
          : undefined,
      onComplete,
    }
  );
}

/**
 * Helper: Reusable Fade-Up reveal
 */
export interface FadeUpOptions {
  trigger?: HTMLElement | string;
  start?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  stagger?: number;
  scrub?: boolean | number;
  onComplete?: () => void;
}

export function fadeUp(
  elements: gsap.TweenTarget,
  options: FadeUpOptions = {}
): gsap.core.Tween | null {
  if (typeof window === "undefined") return null;

  // Global reduced motion override
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0, clearProps: "all" });
    options.onComplete?.();
    return null;
  }

  const {
    trigger,
    start = "top 88%",
    delay = 0,
    duration = DURATION.base,
    yOffset = 30,
    stagger = DURATION.stagger,
    scrub,
    onComplete,
  } = options;

  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: yOffset,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: EASE,
      scrollTrigger: trigger
        ? {
            trigger,
            start,
            scrub,
            toggleActions: scrub ? undefined : "play none none none",
          }
        : undefined,
      onComplete,
    }
  );
}

/**
 * Helper: Magnetic cursor effect for interactive elements (buttons, links, badges)
 */
export interface MagneticOptions {
  strength?: number;
  ease?: string;
}

export function magnetic(
  element: HTMLElement | null,
  options: MagneticOptions = {}
): () => void {
  if (typeof window === "undefined" || !element) {
    return () => {};
  }

  // Global reduced motion override
  if (prefersReducedMotion()) {
    return () => {};
  }

  const { strength = 0.35, ease = "power2.out" } = options;

  const xTo = gsap.quickTo(element, "x", { duration: DURATION.fast, ease });
  const yTo = gsap.quickTo(element, "y", { duration: DURATION.fast, ease });

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    xTo(distanceX);
    yTo(distanceY);
  };

  const handleMouseLeave = () => {
    xTo(0);
    yTo(0);
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
    gsap.set(element, { x: 0, y: 0 });
  };
}

/**
 * Helper: Pin a section with GSAP ScrollTrigger
 */
export interface PinSectionOptions {
  end?: string | (() => string);
  pinSpacing?: boolean;
  anticipatePin?: number;
  onUpdate?: (self: ScrollTrigger) => void;
}

export function pinSection(
  section: HTMLElement | string,
  options: PinSectionOptions = {}
): ScrollTrigger | null {
  if (typeof window === "undefined") return null;

  // Global reduced motion override
  if (prefersReducedMotion()) {
    return null;
  }

  const target =
    typeof section === "string" ? document.querySelector<HTMLElement>(section) : section;

  if (!target) return null;

  const {
    end = "+=100%",
    pinSpacing = true,
    anticipatePin = 1,
    onUpdate,
  } = options;

  return ScrollTrigger.create({
    trigger: target,
    pin: true,
    start: "top top",
    end,
    pinSpacing,
    anticipatePin,
    onUpdate,
  });
}
