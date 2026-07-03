"use client";

import type { CSSProperties } from "react";

function Coin({
  symbol,
  size,
  className = "",
  style,
}: {
  symbol: string;
  size: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`bc-trust-coin ${className}`} style={{ width: size, height: size, ...style }}>
      <div className="bc-trust-coin__rim" />
      <div className="bc-trust-coin__face">
        <span>{symbol}</span>
      </div>
      <div className="bc-trust-coin__shine" />
    </div>
  );
}

export default function FloatingCoins() {
  return (
    <div className="bc-trust-scene" aria-hidden>
      <div className="bc-trust-scene__floor" />

      <Coin symbol="₿" size={140} className="bc-trust-coin--btc bc-anim-float-tilt" style={{ "--bc-delay": "0s" } as CSSProperties} />
      <Coin symbol="◆" size={120} className="bc-trust-coin--eth bc-anim-float-tilt" style={{ "--bc-delay": "0.6s" } as CSSProperties} />

      <Coin symbol="₿" size={48} className="bc-trust-coin--blur bc-anim-float" style={{ top: "8%", left: "5%", "--bc-delay": "1.2s", "--bc-duration": "7s" } as CSSProperties} />
      <Coin symbol="◆" size={36} className="bc-trust-coin--blur bc-anim-float" style={{ top: "70%", left: "8%", "--bc-delay": "0.4s", "--bc-duration": "6.2s" } as CSSProperties} />
      <Coin symbol="₿" size={32} className="bc-trust-coin--blur bc-anim-float" style={{ top: "82%", left: "55%", "--bc-delay": "1.8s", "--bc-duration": "5.8s" } as CSSProperties} />
      <Coin symbol="◆" size={28} className="bc-trust-coin--blur bc-anim-float" style={{ top: "15%", left: "72%", "--bc-delay": "0.9s", "--bc-duration": "6.5s" } as CSSProperties} />
      <Coin symbol="₿" size={24} className="bc-trust-coin--blur bc-anim-float" style={{ top: "55%", left: "85%", "--bc-delay": "1.4s", "--bc-duration": "7.4s" } as CSSProperties} />
    </div>
  );
}
