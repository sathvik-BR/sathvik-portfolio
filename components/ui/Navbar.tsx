"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLenis } from "@/components/motion/SmoothScroll";
import { magnetic } from "@/lib/motion";
import { asset } from "@/lib/assets";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { lenis, scrollTo } = useLenis();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  const lastScrollY = useRef(0);
  const logoRef = useRef<HTMLButtonElement>(null);
  const resumeButtonRef = useRef<HTMLAnchorElement>(null);

  // Setup magnetic hover for logo and resume button
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    if (logoRef.current) {
      cleanups.push(magnetic(logoRef.current, { strength: 0.2 }));
    }
    if (resumeButtonRef.current) {
      cleanups.push(magnetic(resumeButtonRef.current, { strength: 0.25 }));
    }

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);

  // Highlight the link of the section currently in view
  useEffect(() => {
    const els = NAV_LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(
      Boolean
    ) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Track scroll for show/hide and glass background
  useEffect(() => {
    if (lenis) {
      const handleLenisScroll = (e: { scroll: number; direction: number }) => {
        const currentScroll = e.scroll;
        setIsScrolled(currentScroll > 40);
        if (currentScroll < 300) setActive("");

        if (currentScroll > 120 && e.direction === 1 && !mobileMenuOpen) {
          setIsHidden(true);
        } else if (e.direction === -1 || currentScroll <= 120) {
          setIsHidden(false);
        }

        lastScrollY.current = currentScroll;
      };

      lenis.on("scroll", handleLenisScroll);
      return () => {
        lenis.off("scroll", handleLenisScroll);
      };
    } else {
      const handleScroll = () => {
        const currentScroll = window.scrollY;
        setIsScrolled(currentScroll > 40);
        if (currentScroll < 300) setActive("");

        if (currentScroll > 120 && currentScroll > lastScrollY.current && !mobileMenuOpen) {
          setIsHidden(true);
        } else if (currentScroll < lastScrollY.current || currentScroll <= 120) {
          setIsHidden(false);
        }

        lastScrollY.current = currentScroll;
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [lenis, mobileMenuOpen]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen, lenis]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollTo(href, { offset: -60 });
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollTo(0);
  };

  const resumeHref = asset("/resume.pdf");

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-fast ease-motion ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        } ${
          isScrolled
            ? "bg-surface/75 backdrop-blur-md border-b border-border py-3 shadow-lg shadow-black/20"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <button
            ref={logoRef}
            onClick={handleLogoClick}
            className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-1"
            aria-label="Scroll to top"
          >
            <span className="font-mono text-lg font-bold tracking-tight text-text group-hover:text-accent transition-colors duration-fast">
              BRS<span className="text-accent">.</span>
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-7">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`font-mono text-xs uppercase tracking-wider transition-colors duration-fast relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-accent after:transition-all after:duration-fast ${
                        isActive
                          ? "text-text after:w-full"
                          : "text-muted hover:text-text after:w-0 hover:after:w-full"
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Resume Pill Button */}
            <a
              ref={resumeButtonRef}
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase text-text bg-surface border border-border hover:border-accent hover:text-accent transition-all duration-fast hover:shadow-glow-accent"
            >
              Resume
            </a>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-text border border-border bg-surface/50 backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Overlay Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#05060A]/95 backdrop-blur-xl flex flex-col justify-between px-8 py-24 md:hidden transition-all duration-base ease-motion ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex flex-col gap-6 my-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">Navigation</span>
          <nav>
            <ul className="flex flex-col gap-5">
              {NAV_LINKS.map((link, idx) => (
                <li
                  key={link.href}
                  style={{ transitionDelay: mobileMenuOpen ? `${idx * 60 + 100}ms` : "0ms" }}
                  className={`transition-all duration-fast ease-motion ${
                    mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="font-display text-4xl text-text hover:text-accent transition-colors duration-fast block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div
            style={{ transitionDelay: mobileMenuOpen ? `${NAV_LINKS.length * 60 + 120}ms` : "0ms" }}
            className={`pt-6 border-t border-border transition-all duration-fast ${
              mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-3.5 rounded-full text-sm font-mono tracking-wider uppercase text-text bg-surface border border-accent/40 hover:border-accent text-center shadow-glow-accent"
            >
              Download Resume (PDF)
            </a>
          </div>
        </div>

        <div className="text-center font-mono text-xs text-muted">B R Sathvik · AI/ML Engineer</div>
      </div>
    </>
  );
}