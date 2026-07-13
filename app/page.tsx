"use client";

import { useState } from "react";
import BestBuyLogo from "@/components/BestBuyLogo";
import ConnectWalletModal from "@/components/ConnectWalletModal";
import FaIcon from "@/components/FaIcon";
import Reveal from "@/components/Reveal";
import HeroScene3D from "@/components/three/HeroScene3D";

const STATS = [
  { value: "$12.4M", label: "Total Value Locked" },
  { value: "2,847", label: "Active Stakers" },
  { value: "98.2%", label: "Uptime" },
];

const PILLARS = [
  {
    title: "Tiered Rewards",
    body: "Unlock higher APY as your stake grows. From 1% to 2% daily compounded returns.",
    icon: "layer-group",
  },
  {
    title: "Auto-Compound",
    body: "Set it and forget it. Earnings automatically compound to maximize your returns.",
    icon: "rotate",
  },
  {
    title: "VIP Levels",
    body: "Automatic upgrades with exclusive bonus rates and priority support.",
    icon: "crown",
  },
  {
    title: "Flexible Withdrawal",
    body: "Access your earnings or full balance anytime. No lock-up periods.",
    icon: "wallet",
  },
];

const TIERS = [
  {
    name: "Starter",
    rate: "1.0%",
    range: "1 – 10,000 USDT",
    features: ["Daily compounding", "Standard support", "Withdraw anytime"],
  },
  {
    name: "Growth",
    rate: "1.5%",
    range: "10,001 – 50,000 USDT",
    features: ["Enhanced returns", "Priority support", "VIP eligibility", "Analytics dashboard"],
    popular: true,
  },
  {
    name: "Premium",
    rate: "2.0%",
    range: "50,001+ USDT",
    features: ["Maximum APY", "VIP 2 & 3 access", "Dedicated support", "Advanced analytics", "Early feature access"],
  },
];

const VIP_ROWS = [
  { level: "Normal", requirement: "0+ USDT", bonus: "+0%", perks: "Standard support" },
  { level: "VIP 1", requirement: "10,000+ USDT", bonus: "+0.25%", perks: "Priority support" },
  { level: "VIP 2", requirement: "50,000+ USDT", bonus: "+0.5%", perks: "Dedicated manager" },
  { level: "VIP 3", requirement: "100,000+ USDT", bonus: "+1.0%", perks: "All features unlocked" },
];

const SECURITY = [
  { icon: "lock", title: "Audited Smart Contracts", body: "Professionally audited by CertiK. OpenZeppelin security standards." },
  { icon: "bolt", title: "Non-Custodial", body: "You control your funds. Withdraw anytime without permission." },
  { icon: "shield-halved", title: "Emergency Pause", body: "Circuit breaker protection for unexpected situations." },
  { icon: "chart-line", title: "Transparent", body: "All transactions visible on-chain. Fully verifiable." },
];

const SOCIALS = [
  { label: "X", icon: "x-twitter", brand: true },
  { label: "T", icon: "telegram", brand: true },
  { label: "D", icon: "discord", brand: true },
] as const;

export default function LandingPage() {
  const [walletOpen, setWalletOpen] = useState(false);
  const openWallet = () => setWalletOpen(true);
  const closeWallet = () => setWalletOpen(false);

  return (
    <div style={{ background: "#090E0C", color: "#E9F2ED", minWidth: 0, overflow: "hidden" }}>
      <ConnectWalletModal open={walletOpen} onClose={closeWallet} />

      <section className="bb-hero">
        <Reveal from="down" immediate className="bb-nav">
          <div className="bb-brand">
            <BestBuyLogo />
            <span className="bb-brand-name">BestBuy</span>
          </div>
          <div className="bb-nav-links">
            {["Tiers", "VIP", "Security", "Documentation"].map((l) => (
              <a key={l} href={l === "Documentation" ? "#footer" : `#${l.toLowerCase()}`} className="nav-link">{l}</a>
            ))}
          </div>
          <button type="button" className="btn-green" onClick={openWallet}>Connect Wallet</button>
        </Reveal>

        <div className="bb-hero-grid" id="top">
          <div>
            <Reveal from="left" immediate delay={60}>
              <div className="bb-hero-badge">
                <span className="bb-live-dot" />
                Live on Ethereum Mainnet
              </div>
            </Reveal>
            <Reveal from="left" immediate delay={120}>
              <h1 className="bb-hero-title">
                Compound Your<br />
                <span className="bb-hero-title-accent">USDT Holdings</span><br />
                On-Chain
              </h1>
            </Reveal>
            <Reveal from="left" immediate delay={200}>
              <p className="bb-hero-sub">
                Tiered daily dividends up to 2% with automatic compounding.
                Fully decentralized. Transparent rewards. Premium VIP benefits.
              </p>
            </Reveal>
            <Reveal from="left" immediate delay={280}>
              <div className="bb-hero-actions">
                <button type="button" className="btn-green-lg" onClick={openWallet}>Connect Wallet</button>
                <a href="#tiers" className="btn-ghost">View Staking Tiers</a>
              </div>
            </Reveal>
            <Reveal from="up" immediate delay={360}>
              <div className="bb-stats">
                {STATS.map((stat, i) => (
                  <Reveal key={stat.label} from="up" immediate delay={400 + i * 80}>
                    <div>
                      <div className="bb-stat-value">{stat.value}</div>
                      <div className="bb-stat-label">{stat.label}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal from="right" immediate delay={160} className="bb-hero-visual">
            <div className="bb-coin-scene-wrap">
              <HeroScene3D />
            </div>
            <div className="bb-widget">
              <div className="bb-widget-top">
                <span>VIP 3</span>
                <strong>2.0% Daily</strong>
              </div>
              <div className="bb-widget-row">
                <span>Staked Balance</span>
                <strong>125,000 USDT</strong>
              </div>
              <div className="bb-widget-row">
                <span>Daily Earnings</span>
                <strong className="bb-green">+3,437.50 USDT</strong>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bb-section bb-paragraph-section">
        <Reveal from="up">
          <div className="bb-info-card">
            <div className="bb-eyebrow">Why Circulate Your Crypto</div>
            <p>
              Don&apos;t leave your crypto lying on exchange and losing value with market fluctuations.
              Connect your wallet to BestBuy to grow your crypto gradually over time. No money will be
              taken out of your exchange; this is a portal that lets your crypto circulate in the blockchain
              to earn interest while safely still in your exchange, just like banks do when you deposit money.
              They make much more by circulating the money. Remember, crypto is limited. Circulating your
              crypto safely compounds profits.
            </p>
          </div>
        </Reveal>
      </section>

      <section id="tiers" className="bb-section">
        <div className="bb-grid-4 reveal-stagger">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.title} from={index % 2 === 0 ? "left" : "right"} delay={index * 60}>
              <div className="feature-card">
                <div className="bb-card-icon">
                  <FaIcon icon={pillar.icon} />
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bb-section">
        <Reveal from="left">
          <div className="bb-section-head">
            <h2>Staking Tiers</h2>
          </div>
        </Reveal>
        <div className="bb-grid-3">
          {TIERS.map((tier, index) => (
            <Reveal key={tier.name} from="up" delay={index * 100}>
              <div className={`tier-card ${tier.popular ? "tier-card--popular" : ""}`}>
                {tier.popular && <span className="popular-pill">Popular</span>}
                <h3>{tier.name}</h3>
                <div className="tier-rate">{tier.rate} <span>Daily</span></div>
                <div className="tier-range">{tier.range}</div>
                <ul>
                  {tier.features.map((feature) => (
                    <li key={feature}>
                      <FaIcon icon="check" className="tier-check" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="vip" className="bb-section">
        <Reveal from="right">
          <div className="bb-section-head">
            <h2>VIP Benefits</h2>
            <p>
              Automatic tier upgrades based on your staked balance. Higher tiers unlock enhanced daily rates and exclusive perks.
            </p>
          </div>
        </Reveal>
        <Reveal from="up" delay={80}>
          <div className="vip-table">
            <div className="vip-row vip-row--head">
              <div>Level</div>
              <div>Requirement</div>
              <div>Bonus Rate</div>
              <div>Perks</div>
            </div>
            {VIP_ROWS.map((row, index) => (
              <Reveal key={row.level} from="left" delay={index * 70}>
                <div className="vip-row">
                  <div>{row.level}</div>
                  <div>{row.requirement}</div>
                  <div>{row.bonus}</div>
                  <div>{row.perks}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="security" className="bb-section bb-security">
        <Reveal from="left">
          <div className="bb-section-head">
            <h2>Security First</h2>
          </div>
        </Reveal>
        <div className="bb-grid-4 reveal-stagger">
          {SECURITY.map((item, index) => (
            <Reveal key={item.title} from={index % 2 === 0 ? "left" : "right"} delay={index * 60}>
              <div className="sec-stat-card">
                <div className="security-icon">
                  <FaIcon icon={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <footer id="footer" className="bb-footer">
        <Reveal from="up">
          <div className="bb-footer-links">
            {["Documentation", "Security Audit", "Terms", "Privacy"].map((link) => (
              <a key={link} href={link === "Security Audit" ? "#security" : "#footer"} className="footer-link">{link}</a>
            ))}
          </div>
        </Reveal>
        <Reveal from="up" delay={80}>
          <div className="bb-socials">
            {SOCIALS.map((social) => (
              <a key={social.label} href="#footer" className="social-link social-link--icon" aria-label={social.label}>
                <FaIcon icon={social.icon} brand={social.brand} />
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal from="up" delay={140}>
          <p>© 2026 Audited by CertiK. Built on Ethereum.</p>
        </Reveal>
      </footer>
    </div>
  );
}
