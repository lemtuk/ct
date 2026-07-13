'use client';

import { useState, useEffect } from 'react';

interface Coin {
  key: string;
  sym: string;
  name: string;
  price: number;
  dp: number;
  chg: number;
  spark: number[];
}

function initSpark(): number[] {
  let v = 0.5;
  const a: number[] = [];
  for (let i = 0; i < 24; i++) {
    v += (Math.random() - 0.5) * 0.16;
    v = Math.max(0.08, Math.min(0.92, v));
    a.push(v);
  }
  return a;
}

const SEED: Omit<Coin, 'spark'>[] = [
  { key: 'btc', sym: 'BTC', name: 'Bitcoin',  price: 118240, dp: 0, chg: 1.84 },
  { key: 'eth', sym: 'ETH', name: 'Ethereum', price: 4128,   dp: 0, chg: 2.31 },
  { key: 'sol', sym: 'SOL', name: 'Solana',   price: 168.43, dp: 2, chg: -0.62 },
  { key: 'bnb', sym: 'BNB', name: 'BNB',      price: 705.4,  dp: 1, chg: 0.41 },
];

const ICONS: Record<string, string> = {
  btc: '/coins/btc.png',
  eth: '/coins/eth-blue.png',
  sol: '/coins/sol.png',
  bnb: '/coins/bnb.png',
};

function fmt(p: number, dp: number): string {
  return dp === 0
    ? p.toLocaleString('en-US', { maximumFractionDigits: 0 })
    : p.toFixed(dp);
}

function sparkPoints(spark: number[]): string {
  return spark
    .map((v, i) => `${(i * (120 / 23)).toFixed(1)},${((1 - v) * 20 + 3).toFixed(1)}`)
    .join(' ');
}

export default function AccrueLiveMarket({ apyStr }: { apyStr: string }) {
  const [coins, setCoins] = useState<Coin[]>(() =>
    SEED.map((c) => ({ ...c, spark: initSpark() }))
  );

  useEffect(() => {
    const iv = setInterval(() => {
      setCoins((prev) =>
        prev.map((c) => {
          const price = c.price * (1 + (Math.random() - 0.5) * 0.004);
          let chg = c.chg + (Math.random() - 0.5) * 0.1;
          chg = Math.max(-6, Math.min(6, chg));
          const spark = c.spark.slice(1);
          let sv = spark[spark.length - 1] + (Math.random() - 0.5) * 0.16;
          sv = Math.max(0.08, Math.min(0.92, sv));
          spark.push(sv);
          return { ...c, price, chg, spark };
        })
      );
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 18,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-sg)', fontSize: 15, fontWeight: 600 }}>
          Live markets
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            color: '#2EE6A8',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#2EE6A8',
              display: 'inline-block',
              animation: 'pulseG 1.8s ease-out infinite',
            }}
          />
          LIVE
        </span>
      </div>

      {/* Coin rows */}
      {coins.map((c) => {
        const up = c.chg >= 0;
        const strokeColor = up ? '#34D399' : '#F87171';
        const badgeBg = up ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)';
        return (
          <div
            key={c.key}
            style={{
              display: 'grid',
              gridTemplateColumns: '34px 96px 1fr 118px 78px',
              alignItems: 'center',
              gap: 12,
              padding: '11px 20px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <img
              src={ICONS[c.key]}
              alt={c.sym}
              width={30}
              height={30}
              style={{ display: 'block', borderRadius: '50%' }}
            />
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13.5, fontWeight: 600 }}>
                {c.sym}
              </div>
              <div style={{ fontSize: 11.5, color: '#5D7169' }}>{c.name}</div>
            </div>
            <svg
              width="120"
              height="26"
              viewBox="0 0 120 26"
              preserveAspectRatio="none"
              style={{ display: 'block', justifySelf: 'center' }}
            >
              <polyline
                points={sparkPoints(c.spark)}
                fill="none"
                stroke={strokeColor}
                strokeWidth={1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={0.85}
              />
            </svg>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 14, textAlign: 'right' }}>
              ${fmt(c.price, c.dp)}
            </div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 12,
                textAlign: 'center',
                padding: '4px 0',
                borderRadius: 7,
                color: strokeColor,
                background: badgeBg,
              }}
            >
              {(up ? '+' : '') + c.chg.toFixed(2) + '%'}
            </div>
          </div>
        );
      })}

      {/* USDT yield route banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          margin: 10,
          padding: '16px 14px',
          borderRadius: 12,
          background: 'linear-gradient(120deg,rgba(46,230,168,0.10),rgba(20,184,166,0.05))',
          border: '1px solid rgba(46,230,168,0.25)',
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: '#26A17B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'var(--mono)',
            flexShrink: 0,
            letterSpacing: '0.04em',
          }}
        >
          USDT
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13.5, fontWeight: 600 }}>
            USDT YIELD ROUTE
          </div>
          <div style={{ fontSize: 12, color: '#8FA69D', marginTop: 2 }}>
            Aave v4 → Morpho · auto-compounding
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 24,
              fontWeight: 600,
              background: 'linear-gradient(120deg,#2EE6A8,#14B8A6)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: '#2EE6A8',
            }}
          >
            {apyStr}
          </div>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              color: '#5D7169',
            }}
          >
            NET APY
          </div>
        </div>
      </div>
    </div>
  );
}
