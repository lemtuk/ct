"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type SlideDirection = "up" | "down" | "left" | "right";

const offsets: Record<SlideDirection, { x: number; y: number }> = {
  up: { x: 0, y: 72 },
  down: { x: 0, y: -72 },
  left: { x: -80, y: 0 },
  right: { x: 80, y: 0 },
};

type SlideSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  direction?: SlideDirection;
  delay?: number;
};

export default function SlideSection({
  children,
  className = "",
  id,
  direction = "up",
  delay = 0,
}: SlideSectionProps) {
  const offset = offsets[direction];

  const variants: Variants = {
    hidden: { opacity: 0, x: offset.x, y: offset.y, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -80px 0px" }}
      variants={variants}
    >
      {children}
    </motion.section>
  );
}

type SlideInProps = {
  children: ReactNode;
  className?: string;
  direction?: SlideDirection;
  delay?: number;
};

export function SlideIn({ children, className = "", direction = "up", delay = 0 }: SlideInProps) {
  const offset = offsets[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export function Stagger({ children, className = "", stagger = 0.1 }: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 48, filter: "blur(6px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
