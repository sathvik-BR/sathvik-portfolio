"use client";

import React, { useEffect, useRef, useState } from "react";
import { profile } from "@/data/content";
import { splitTextReveal, fadeUp, magnetic } from "@/lib/motion";
import { asset } from "@/lib/assets";

const LINKEDIN_URL = "https://www.linkedin.com/in/b-r-sathvik-a9b785328";
const HACKERRANK_URL = "https://www.hackerrank.com/profile/sathvikbumisetty";

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mailBtnRef = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (headingRef.current) {
      splitTextReveal(headingRef.current, {
        text: "Let’s build something intelligent.",
        trigger: section,
        start: "top 65%",
      });
    }

    const items = section.querySelectorAll(".contact-fade");
    fadeUp(Array.from(items), { trigger: section, start: "top 55%" });

    const cleanup = magnetic(mailBtnRef.current);
    return () => cleanup();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const socials = [
    { label: "GitHub", href: profile.github },
    { label: "LinkedIn", href: LINKEDIN_URL },
    { label: "HackerRank", href: HACKERRANK_URL },
    { label: "Resume", href: asset("/resume.pdf") },
  ].filter((s) => s.href);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col justify-between border-t border-border bg-surface/30"
    >
      <div className="flex flex-1 flex-col justify-center px-6 py-24 lg:px-[8vw]">
        <span className="contact-fade inline-block w-fit rounded-full border border-accent/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
          Contact
        </span>

        <h2
          ref={headingRef}
          className="mt-5 max-w-4xl text-[clamp(2.5rem,6vw,6rem)] leading-[1.05] text-text font-display"
        >
          Let’s build something intelligent.
        </h2>

        <p className="contact-fade mt-6 max-w-xl text-muted">
          I’m open to fresher AI/ML engineer roles in Bengaluru and remote. If you’re working on
          computer vision, LLM or RAG products, I’d love to talk.
        </p>

        <div className="contact-fade mt-10 flex flex-wrap items-center gap-4">
          <a
            ref={mailBtnRef}
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-mono text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
          >
            Send email <span aria-hidden="true">↗</span>
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-mono text-xs tracking-wide text-muted transition-colors hover:border-accent/60 hover:text-text"
          >
            {copied ? "Copied to clipboard" : profile.email}
          </button>
        </div>

        <div className="contact-fade mt-12 flex flex-wrap gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-accent/60 hover:text-text"
            >
              {s.label}
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      </div>

      <footer className="flex flex-col items-start justify-between gap-3 border-t border-border px-6 py-6 font-mono text-[11px] uppercase tracking-widest text-muted sm:flex-row sm:items-center lg:px-[8vw]">
        <span>© 2026 {profile.name}</span>
        <span>Built with Next.js, GSAP and Three.js</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="transition-colors hover:text-text"
        >
          Back to top ↑
        </button>
      </footer>
    </section>
  );
}