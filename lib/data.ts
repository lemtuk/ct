export type TierName = "Starter" | "Growth" | "Premium";

export const POPULAR_TIER: TierName = "Growth";

export const pillars = [
  {
    icon: "◈",
    title: "Tiered Rewards",
    copy: "Unlock higher APY as your stake grows. From 1% to 2% daily compounded returns.",
  },
  {
    icon: "↻",
    title: "Auto-Compound",
    copy: "Set it and forget it. Earnings automatically compound to maximize your returns.",
  },
  {
    icon: "★",
    title: "VIP Levels",
    copy: "Automatic upgrades with exclusive bonus rates and priority support.",
  },
  {
    icon: "⇅",
    title: "Flexible Withdrawal",
    copy: "Access your earnings or full balance anytime. No lock-up periods.",
  },
] as const;

export type Tier = {
  name: string;
  rate: string;
  range: string;
  features: string[];
  popular: boolean;
  bg: string;
  border: string;
  rateColor: string;
  ctaBg: string;
};

function mkTier(
  name: TierName,
  rate: string,
  range: string,
  features: string[],
  popular: boolean
): Tier {
  return {
    name: name.toUpperCase(),
    rate,
    range,
    features,
    popular,
    bg: popular
      ? "linear-gradient(160deg, #1a1508 0%, #111008 55%, #0a0a0a 100%)"
      : "rgba(12,12,12,0.75)",
    border: popular ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.18)",
    rateColor: popular ? "#e8c547" : "#f5f5f5",
    ctaBg: popular ? "#a67c00" : "rgba(166,124,0,0.35)",
  };
}

export const tiers: Tier[] = [
  mkTier("Starter", "1.0%", "1 – 10,000 USDT", ["Daily compounding", "Standard support", "Withdraw anytime"], false),
  mkTier("Growth", "1.5%", "10,001 – 50,000 USDT", ["Enhanced returns", "Priority support", "VIP eligibility", "Analytics dashboard"], true),
  mkTier("Premium", "2.0%", "50,001+ USDT", ["Maximum APY", "VIP 2 & 3 access", "Dedicated support", "Advanced analytics", "Early feature access"], false),
];

export const vipRows = [
  { level: "Normal", levelColor: "rgba(245,245,245,0.85)", req: "0+ USDT", bonus: "+0%", perks: "Standard support" },
  { level: "VIP 1", levelColor: "#e0c060", req: "10,000+ USDT", bonus: "+0.25%", perks: "Priority support" },
  { level: "VIP 2", levelColor: "#d4af37", req: "50,000+ USDT", bonus: "+0.5%", perks: "Dedicated manager" },
  { level: "VIP 3", levelColor: "#e8c547", req: "100,000+ USDT", bonus: "+1.0%", perks: "All features unlocked" },
] as const;

export const security = [
  { icon: "◉", title: "Audited Smart Contracts", copy: "Professionally audited by CertiK. OpenZeppelin security standards." },
  { icon: "⚿", title: "Non-Custodial", copy: "You control your funds. Withdraw anytime without permission." },
  { icon: "◭", title: "Emergency Pause", copy: "Circuit breaker protection for unexpected situations." },
  { icon: "≡", title: "Transparent", copy: "All transactions visible on-chain. Fully verifiable." },
] as const;

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#tiers", label: "Tiers" },
  { href: "#vip", label: "VIP" },
  { href: "#security", label: "Security" },
] as const;
