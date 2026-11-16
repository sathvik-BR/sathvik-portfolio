"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/content";
import { splitTextReveal, fadeUp } from "@/lib/motion";

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    gsap.registerPlugin(ScrollTrigger);

    if (headingRef.current) {
      splitTextReveal(headingRef.current, {
        text: "Selected work",
        trigger: section,
        start: "top 70%",
      });
    }
    if (labelRef.current) {
      fadeUp(labelRef.current, { trigger: section, start: "top 75%" });
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: self.progress });
            }
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full overflow-hidden border-t border-border bg-background py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0"
    >
      <div className="w-full px-6 lg:px-[8vw]">
        <span
          ref={labelRef}
          className="inline-block rounded-full border border-accent/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent"
        >
          Projects
        </span>
        <h2
          ref={headingRef}
          className="mt-4 text-[clamp(2rem,4vw,4rem)] leading-tight text-text font-display"
        >
          Selected work
        </h2>
      </div>

      <div
        ref={trackRef}
        className="mt-10 flex flex-col gap-6 px-6 will-change-transform lg:mt-10 lg:w-max lg:flex-row lg:items-stretch lg:gap-8 lg:px-[8vw]"
      >
        {projects.map((project, i) => (
          <article
            key={project.slug}
            className="group relative flex w-full flex-col justify-between rounded-2xl border border-border bg-surface p-7 transition-colors duration-500 hover:border-accent/50 lg:min-h-[58vh] lg:w-[min(70vw,620px)] lg:shrink-0 lg:p-9"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest text-accent">
                  {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
                <span className="h-px w-16 bg-border transition-all duration-500 group-hover:w-28 group-hover:bg-accent" />
              </div>

              <h3 className="mt-6 text-3xl leading-tight text-text font-display lg:text-4xl">
                {project.title}
              </h3>
              <p className="mt-2 text-muted">{project.subtitle}</p>

              <ul className="mt-6 space-y-2.5">
                {project.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent2" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-border bg-background/60 px-2.5 py-1 font-mono text-[11px] text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/projects/${project.slug}`}
                  data-cursor="view"
                  className="rounded-full bg-accent px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                >
                  Case study
                </Link>
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:border-accent/60 hover:text-text"
                >
                  Code ↗
                </a>
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-muted transition-colors hover:border-accent/60 hover:text-text"
                  >
                    Live demo ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="absolute bottom-8 left-[8vw] right-[8vw] hidden h-px bg-border lg:block">
        <div
          ref={progressRef}
          className="h-px origin-left bg-gradient-to-r from-accent to-accent2"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}