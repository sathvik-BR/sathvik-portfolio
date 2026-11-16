# Premium AI/ML Portfolio — Foundation Setup (Step 1)

This project is a high-performance, dark-themed AI/ML portfolio engineered with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **GSAP + ScrollTrigger**, **Lenis**, **Framer Motion**, and **React Three Fiber + drei**.

---

## 🛠️ Stack & Foundation Overview

- **Framework**: Next.js 15 with App Router (`/app`)
- **Language**: TypeScript (`strict: true`)
- **Styling**: Tailwind CSS with custom design tokens (`tailwind.config.ts`, `globals.css`)
- **Typography** via `next/font`:
  - Display Headings: **Instrument Serif** (`font-display`, `text-display`, `text-h2`)
  - Body: **Inter** (`font-sans`, `text-body`)
  - Labels / Tech tags: **JetBrains Mono** (`font-mono`)
- **Color Palette & Tokens**:
  - Background: `#05060A`
  - Surface: `#0B0D14`
  - Border: `rgba(255, 255, 255, 0.08)`
  - Text: `#EDEEF2`
  - Muted: `#8A8F9C`
  - Accent (Violet): `#7C5CFF`
  - Accent2 (Cyan): `#3DE0FF`
- **Motion & Smooth Scroll**:
  - Motion tokens in `/lib/motion.ts` (`cubic-bezier(0.16, 1, 0.3, 1)`, durations `fast 0.4s`, `base 0.8s`, `slow 1.2s`, `stagger 0.06s`)
  - Reusable GSAP helpers: `splitTextReveal`, `fadeUp`, `magnetic`, `pinSection`
  - Global `prefers-reduced-motion` override (disables animations when system preference is set)
  - Lenis smooth scroll synced with GSAP ScrollTrigger on a single unified requestAnimationFrame (RAF) ticker loop in `/components/motion/SmoothScroll.tsx`
- **Data Layer**:
  - Single source of truth exported in `/data/content.ts` (Profile, Projects, Skills, Certifications)

---

## 📁 Project Structure

```text
sathvik-portfolio/
├── app/
│   ├── globals.css          # Design tokens, Lenis styles, reduced-motion overrides
│   ├── layout.tsx           # Google Fonts setup, Lenis provider, metadata
│   └── page.tsx             # Foundation test bench
├── components/
│   ├── motion/              # Lenis smooth scroll & motion wrappers
│   ├── sections/            # Portfolio sections (ready for Step 2)
│   ├── three/               # React Three Fiber 3D canvases (ready for Step 2)
│   └── ui/                  # Reusable atomic UI components
├── data/
│   └── content.ts           # Single source of truth for all portfolio data
├── lib/
│   └── motion.ts            # Motion tokens & GSAP animation helpers
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind tokens (colors, clamp type scale, spacing)
├── tsconfig.json            # Strict TypeScript configuration with @/* path alias
└── README.md
```

---

## 🚀 Running the Project

1. **Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Production Build**:
   ```bash
   npm run build
   ```

3. **Production Server**:
   ```bash
   npm run start
   ```
