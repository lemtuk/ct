"use client";

"use client";

import type { CSSProperties } from "react";

function IsoCube({ size, className = "", style }: { size: number; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`bc-iso-cube ${className}`}
      style={{ width: size, height: size, "--cube-half": `${size / 2}px`, ...style } as CSSProperties}
    >
      <div className="bc-iso-cube__top" />
      <div className="bc-iso-cube__left" />
      <div className="bc-iso-cube__right" />
    </div>
  );
}

export default function BlockchainIsometric() {
  const nodes = [
    { size: 28, top: "8%", left: "18%", delay: "0s", dur: "5.5s" },
    { size: 22, top: "22%", left: "78%", delay: "0.8s", dur: "6.2s" },
    { size: 26, top: "12%", left: "52%", delay: "1.2s", dur: "5.8s" },
    { size: 20, top: "68%", left: "12%", delay: "0.4s", dur: "6.8s" },
    { size: 24, top: "72%", left: "72%", delay: "1.6s", dur: "5.2s" },
    { size: 18, top: "55%", left: "88%", delay: "0.2s", dur: "7s" },
    { size: 16, top: "35%", left: "6%", delay: "1s", dur: "6.4s" },
  ];

  return (
    <div className="bc-blockchain-scene" aria-hidden>
      <div className="bc-blockchain-scene__platform">
        <div className="bc-blockchain-scene__base bc-blockchain-scene__base--1" />
        <div className="bc-blockchain-scene__base bc-blockchain-scene__base--2" />
        <div className="bc-blockchain-scene__base bc-blockchain-scene__base--3" />

        <div className="bc-blockchain-scene__core">
          <div className="bc-blockchain-scene__core-grid">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bc-blockchain-scene__core-cell" />
            ))}
          </div>
        </div>
      </div>

      {nodes.map((n, i) => (
        <IsoCube
          key={i}
          size={n.size}
          className="bc-iso-cube--node bc-anim-float"
          style={{
            top: n.top,
            left: n.left,
            position: "absolute",
            "--bc-delay": n.delay,
            "--bc-duration": n.dur,
          } as CSSProperties}
        />
      ))}

      <svg className="bc-blockchain-scene__orbit bc-spin-slow" viewBox="0 0 400 400">
        <ellipse cx="200" cy="200" rx="170" ry="60" fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth="1" strokeDasharray="6 10" />
      </svg>
    </div>
  );
}
