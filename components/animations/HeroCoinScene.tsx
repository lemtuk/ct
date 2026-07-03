"use client";

import type { CSSProperties } from "react";

function CoinDisc({ size, style, className = "" }: { size: number; style?: CSSProperties; className?: string }) {
  return (
    <div
      className={`bc-coin-disc ${className}`}
      style={{
        width: size,
        height: size * 0.22,
        ...style,
      }}
    >
      <div className="bc-coin-disc__face" style={{ width: size, height: size }} />
      <div className="bc-coin-disc__edge" style={{ width: size, height: size * 0.22 }} />
    </div>
  );
}

export default function HeroCoinScene() {
  return (
    <div className="bc-hero-scene bc-hero-enter bc-hero-enter--5" aria-hidden>
      <div className="bc-hero-scene__glow" />

      {/* Hexagonal frame */}
      <svg className="bc-hero-scene__hex bc-anim-float-slow" viewBox="0 0 200 200" style={{ "--bc-delay": "0s" } as CSSProperties}>
        <polygon
          points="100,8 188,58 188,142 100,192 12,142 12,58"
          fill="none"
          stroke="rgba(212,175,55,0.22)"
          strokeWidth="2"
        />
      </svg>

      {/* Coin stacks */}
      <div className="bc-hero-scene__stack bc-anim-float" style={{ "--bc-delay": "0.4s", "--bc-duration": "6.5s" } as CSSProperties}>
        {[0, 1, 2, 3, 4].map((i) => (
          <CoinDisc key={i} size={88} style={{ marginTop: i === 0 ? 0 : -52, zIndex: 5 - i }} />
        ))}
      </div>

      <div className="bc-hero-scene__stack bc-hero-scene__stack--sm bc-anim-float" style={{ "--bc-delay": "1.2s", "--bc-duration": "7.8s" } as CSSProperties}>
        {[0, 1, 2].map((i) => (
          <CoinDisc key={i} size={56} style={{ marginTop: i === 0 ? 0 : -34, zIndex: 3 - i }} />
        ))}
      </div>

      {/* Dollar slab */}
      <div className="bc-hero-scene__slab bc-hero-scene__slab--dollar bc-anim-float-tilt" style={{ "--bc-delay": "0.8s" } as CSSProperties}>
        <span>$</span>
      </div>

      {/* BestCrypto branded slab */}
      <div className="bc-hero-scene__slab bc-hero-scene__slab--brand bc-anim-float-tilt" style={{ "--bc-delay": "1.6s" } as CSSProperties}>
        <span className="bc-hero-scene__brand-mark">◆</span>
        <span className="bc-hero-scene__brand-text">BC</span>
      </div>

      {/* Shield with checkmark */}
      <div className="bc-hero-scene__shield bc-anim-float" style={{ "--bc-delay": "0.2s", "--bc-duration": "8.2s" } as CSSProperties}>
        <svg viewBox="0 0 80 96" fill="none">
          <path
            d="M40 4L72 18V46C72 68 58 84 40 92C22 84 8 68 8 46V18L40 4Z"
            fill="url(#shieldGrad)"
            stroke="rgba(212,175,55,0.45)"
            strokeWidth="1.5"
          />
          <path d="M28 48L36 56L54 36" stroke="#e8c547" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="shieldGrad" x1="40" y1="4" x2="40" y2="92">
              <stop stopColor="#2a2008" />
              <stop offset="1" stopColor="#0a0a0a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating fragments */}
      {[
        { w: 28, h: 18, top: "12%", left: "68%", rot: 24, delay: "0.3s" },
        { w: 22, h: 14, top: "72%", left: "58%", rot: -18, delay: "1.1s" },
        { w: 18, h: 12, top: "38%", left: "82%", rot: 42, delay: "0.7s" },
        { w: 14, h: 10, top: "58%", left: "22%", rot: -32, delay: "1.4s" },
      ].map((f, i) => (
        <div
          key={i}
          className="bc-hero-scene__shard bc-anim-drift"
          style={{
            width: f.w,
            height: f.h,
            top: f.top,
            left: f.left,
            transform: `rotate(${f.rot}deg)`,
            "--bc-delay": f.delay,
          } as CSSProperties}
        />
      ))}

      {/* Scattered loose coins */}
      <div className="bc-coin-loose bc-anim-float" style={{ top: "78%", left: "12%", "--bc-delay": "0.5s", "--bc-duration": "5.5s" } as CSSProperties}>
        <CoinDisc size={42} />
      </div>
      <div className="bc-coin-loose bc-anim-float" style={{ top: "18%", left: "42%", "--bc-delay": "1.8s", "--bc-duration": "6.8s" } as CSSProperties}>
        <CoinDisc size={34} />
      </div>
    </div>
  );
}
