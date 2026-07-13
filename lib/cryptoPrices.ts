export type CoinMeta = {
  key: string;
  id: string;
  sym: string;
  pair?: string;
  icon?: string;
  iconBg?: string;
  iconLabel?: string;
  decimals: number;
};

export const COIN_META: CoinMeta[] = [
  { key: "btc", id: "bitcoin", sym: "BTC", pair: "BTCUSDT", icon: "/coins/btc.png", decimals: 0 },
  { key: "eth", id: "ethereum", sym: "ETH", pair: "ETHUSDT", icon: "/coins/eth-blue.png", decimals: 0 },
  { key: "sol", id: "solana", sym: "SOL", pair: "SOLUSDT", icon: "/coins/sol.png", decimals: 2 },
  { key: "xrp", id: "ripple", sym: "XRP", pair: "XRPUSDT", iconBg: "#23292F", iconLabel: "X", decimals: 4 },
  { key: "bnb", id: "binancecoin", sym: "BNB", pair: "BNBUSDT", icon: "/coins/bnb.png", decimals: 2 },
  { key: "usdt", id: "tether", sym: "USDT", iconBg: "#26A17B", iconLabel: "₮", decimals: 4 },
];

export type LiveCoin = CoinMeta & {
  price: number;
  change: number;
};

export function formatPrice(value: number, decimals: number): string {
  if (decimals === 0) {
    return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

type GeckoResponse = Record<string, { usd: number; usd_24h_change?: number }>;

type BinanceTicker = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
};

async function fetchFromBinance(): Promise<LiveCoin[]> {
  const tradable = COIN_META.filter((coin) => coin.pair);

  const rows = await Promise.all(
    tradable.map(async (coin) => {
      const url = `https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${coin.pair}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Binance request failed for ${coin.pair}: ${res.status}`);
      return (await res.json()) as BinanceTicker;
    })
  );

  const byPair = new Map(rows.map((row) => [row.symbol, row]));

  return COIN_META.map((coin) => {
    if (coin.key === "usdt") {
      return { ...coin, price: 1, change: 0.01 };
    }

    const quote = byPair.get(coin.pair!);
    if (!quote) throw new Error(`Missing quote for ${coin.pair}`);

    return {
      ...coin,
      price: Number(quote.lastPrice),
      change: Number(quote.priceChangePercent),
    };
  });
}

async function fetchFromCoinGecko(): Promise<LiveCoin[]> {
  const ids = COIN_META.map((coin) => coin.id).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

  const res = await fetch(url, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`CoinGecko request failed: ${res.status}`);

  const data = (await res.json()) as GeckoResponse;

  return COIN_META.map((coin) => {
    const quote = data[coin.id];
    if (!quote) throw new Error(`Missing quote for ${coin.id}`);

    return {
      ...coin,
      price: quote.usd,
      change: quote.usd_24h_change ?? 0,
    };
  });
}

export async function fetchLiveCoinPrices(): Promise<LiveCoin[]> {
  try {
    return await fetchFromBinance();
  } catch {
    return fetchFromCoinGecko();
  }
}
