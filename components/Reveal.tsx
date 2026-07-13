"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type RevealFrom = "up" | "down" | "left" | "right" | "scale";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: RevealFrom;
  immediate?: boolean;
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  from = "up",
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (immediate) {
      const timer = window.setTimeout(() => setVisible(true), 40 + delay);
      return () => window.clearTimeout(timer);
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, immediate]);

  return (
    <div
      ref={ref}
      className={`reveal reveal--${from} ${visible ? "reveal--visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
