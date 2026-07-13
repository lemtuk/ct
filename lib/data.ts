export const navLinks = [
  { href: "#app", label: "App" },
  { href: "#about", label: "Explore" },
  { href: "#protocol", label: "BestNet" },
  { href: "#security", label: "Pro UI" },
] as const;

export const missionPillars = [
  {
    icon: "$",
    title: "The BestCrypto Stablecoin",
    aura: "planes" as const,
  },
  {
    icon: "⛓",
    title: "The BestCrypto Chain",
    aura: "horizon" as const,
  },
  {
    icon: "◎",
    title: "The BestCrypto Network",
    aura: "mesh" as const,
  },
] as const;

export const newsItems = [
  {
    source: "Cointelegraph",
    date: "Jan 2025",
    headline: "BestCrypto community approves BCUSD stablecoin expansion across major L2 networks",
  },
  {
    source: "The Block",
    date: "Dec 2024",
    headline: "BestCrypto staking protocol surpasses $50M TVL with zero security incidents",
  },
  {
    source: "Decrypt",
    date: "Nov 2024",
    headline: "BestCrypto launches cross-chain liquidity bridge for institutional partners",
  },
] as const;

export const partners = ["CertiK", "OpenZeppelin"] as const;
