'use client';

import { useState, useEffect, useRef } from 'react';

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function interpolated(prog: number) {
  const volume = Math.round(412 * prog);
  const apy = (7.94 * prog).toFixed(2);
  const wallets = Math.round(214000 * prog).toLocaleString('en-US');
  const uptime = (99.99 * prog).toFixed(2);
  return {
    cVolume: `$${volume}M`,
    cApy: `${apy}%`,
    cWallets: wallets,
    cUptime: `${uptime}%`,
  };
}

export default function AccrueStats() {
  const [prog, setProg] = useState(0);
  const rafRef = useRef<number | null>(null);
  const t0Ref = useRef<number | null>(null);

  useEffect(() => {
    const duration = 1700;
    const step = (now: number) => {
      if (t0Ref.current === null) t0Ref.current = now;
      const elapsed = Math.min(1, (now - t0Ref.current) / duration);
      setProg(easeOut(elapsed));
      if (elapsed < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const { cVolume, cApy, cWallets, cUptime } = interpolated(prog);

  const cols = [
    { val: cVolume,  label: 'USDT routed on-chain',     color: '#E9F2ED', borderLeft: false },
    { val: cApy,     label: 'Avg net APY, past 90 days', color: '#2EE6A8', borderLeft: true  },
    { val: cWallets, label: 'Self-custody wallets',       color: '#E9F2ED', borderLeft: true  },
    { val: cUptime,  label: 'Route uptime',               color: '#E9F2ED', borderLeft: true  },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.015)',
      }}
    >
      {cols.map((c) => (
        <div
          key={c.label}
          style={{
            padding: '34px 40px',
            borderLeft: c.borderLeft ? '1px solid rgba(255,255,255,0.07)' : undefined,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 36,
              fontWeight: 600,
              color: c.color,
            }}
          >
            {c.val}
          </div>
          <div style={{ fontSize: 13, color: '#5D7169', marginTop: 6 }}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}
