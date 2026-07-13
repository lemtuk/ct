"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { COIN_META, formatPrice, type LiveCoin } from "@/lib/cryptoPrices";

const NETWORKS = ["Ethereum", "Tron", "Arbitrum", "Base", "Avalanche", "Solana"];
const POLL_MS = 20_000;

const FALLBACK: LiveCoin[] = COIN_META.map((coin) => ({
  ...coin,
  price: coin.key === "usdt" ? 1 : 0,
  change: 0,
}));

function CoinPill({ coin, flash }: { coin: LiveCoin; flash?: boolean }) {
  const up = coin.change >= 0;

  return (
    <div className="bb-ticker-pill">
      {coin.icon ? (
        <Image src={coin.icon} alt={coin.sym} width={22} height={22} className="bb-ticker-pill-icon" />
      ) : (
        <span className="bb-ticker-pill-fallback" style={{ background: coin.iconBg }}>
          {coin.iconLabel}
        </span>
      )}
      <span className="bb-ticker-pill-sym">{coin.sym}</span>
      <span className={`bb-ticker-pill-price ${flash ? "bb-ticker-pill-price--flash" : ""}`}>
        {formatPrice(coin.price, coin.decimals)}
      </span>
      <span className={`bb-ticker-pill-change ${up ? "bb-ticker-pill-change--up" : "bb-ticker-pill-change--down"}`}>
        {up ? "+" : ""}
        {coin.change.toFixed(2)}%
      </span>
    </div>
  );
}

function TickerRow({
  coins,
  reverse,
  flashKeys,
}: {
  coins: LiveCoin[];
  reverse?: boolean;
  flashKeys: Set<string>;
}) {
  const track = [...coins, ...coins];

  return (
    <div className={`bb-ticker-row ${reverse ? "bb-ticker-row--reverse" : ""}`}>
      <div className="bb-ticker-track">
        {track.map((coin, i) => (
          <CoinPill key={`${coin.key}-${i}`} coin={coin} flash={flashKeys.has(coin.key)} />
        ))}
      </div>
    </div>
  );
}

export default function CryptoTicker() {
  const [coins, setCoins] = useState<LiveCoin[]>(FALLBACK);
  const [live, setLive] = useState(false);
  const [flashKeys, setFlashKeys] = useState<Set<string>>(new Set());
  const prevPrices = useRef<Record<string, number>>({});

  const loadPrices = useCallback(async () => {
    try {
      const res = await fetch("/api/crypto-prices", { cache: "no-store" });
      if (!res.ok) return;

      const data = (await res.json()) as { coins: LiveCoin[] };
      const next = data.coins;
      const changed = new Set<string>();

      next.forEach((coin) => {
        const prev = prevPrices.current[coin.key];
        if (prev !== undefined && prev !== coin.price) {
          changed.add(coin.key);
        }
        prevPrices.current[coin.key] = coin.price;
      });

      setCoins(next);
      setLive(true);

      if (changed.size > 0) {
        setFlashKeys(changed);
        window.setTimeout(() => setFlashKeys(new Set()), 700);
      }
    } catch {
      /* keep last known prices */
    }
  }, []);

  useEffect(() => {
    loadPrices();
    const interval = window.setInterval(loadPrices, POLL_MS);
    return () => window.clearInterval(interval);
  }, [loadPrices]);

  const rowOne = coins;
  const rowTwo = [...coins.slice(3), ...coins.slice(0, 3)];

  return (
    <section className="bb-ticker" aria-label="Live crypto prices">
      <div className="bb-ticker-live">
        <span className={`bb-ticker-live-dot ${live ? "bb-ticker-live-dot--on" : ""}`} />
        {live ? "Live prices" : "Syncing prices"}
      </div>

      <TickerRow coins={rowOne} flashKeys={flashKeys} />
      <TickerRow coins={rowTwo} reverse flashKeys={flashKeys} />

      <p className="bb-ticker-networks">
        <span className="bb-ticker-networks-label">USDT native on</span>
        {NETWORKS.map((network, i) => (
          <span key={network}>
            {i > 0 && <span className="bb-ticker-networks-dot">·</span>}
            {network}
          </span>
        ))}
      </p>
    </section>
  );
}
