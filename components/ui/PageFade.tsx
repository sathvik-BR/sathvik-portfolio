"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PageFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  inView?: boolean;
}

export function PageFade({ children, className, delay = 0, inView = false }: PageFadeProps) {
  const reduce = useReducedMotion();
  const transition = { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const };
  const hidden = reduce ? false : { opacity: 0, y: 24 };

  if (inView) {
    return (
      <motion.div
        className={className}
        initial={hidden}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div className={className} initial={hidden} animate={{ opacity: 1, y: 0 }} transition={transition}>
      {children}
    </motion.div>
  );
}