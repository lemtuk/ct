import Nav from "@/components/Nav";
import FadeIn from "@/components/FadeIn";
import HeroCoinScene from "@/components/animations/HeroCoinScene";
import FloatingCoins from "@/components/animations/FloatingCoins";
import BlockchainIsometric from "@/components/animations/BlockchainIsometric";
import PillarAura from "@/components/animations/PillarAura";
import FluidBlobs from "@/components/animations/FluidBlobs";
import { pillars, security, tiers, vipRows } from "@/lib/data";

const pillarAuras = ["planes", "horizon", "mesh", "mesh"] as const;

function HeroDecor() {
  return (
    <>
      <div
        className="bc-spin-slow"
        style={{
          position: "absolute",
          right: -140,
          top: 180,
          width: 560,
          height: 560,
          border: "1.5px dashed rgba(212,175,55,0.22)",
          borderRadius: 120,
          pointerEvents: "none",
        }}
      />
      <div
        className="bc-spin-reverse"
        style={{
          position: "absolute",
          right: 120,
          top: 380,
          width: 340,
          height: 340,
          border: "1.5px dashed rgba(212,175,55,0.16)",
          borderRadius: 90,
          pointerEvents: "none",
        }}
      />
      <div
        className="bc-glow"
        style={{
          position: "absolute",
          right: 60,
          top: -120,
          width: 420,
          height: 420,
          background: "radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0) 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="bc-glow"
        style={{
          position: "absolute",
          left: -180,
          bottom: -220,
          width: 620,
          height: 620,
          background: "radial-gradient(circle, rgba(166,124,0,0.18) 0%, rgba(166,124,0,0) 70%)",
          pointerEvents: "none",
          animationDelay: "2s",
        }}
      />
    </>
  );
}

export default function LandingPage() {
  return (
    <div id="top" className="bc-shell">
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "radial-gradient(130% 110% at 75% 15%, #1a1508 0%, #0f0d08 42%, #050505 78%, #000000 100%)",
        }}
      >
        <HeroDecor />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Nav />
          <div className="bc-container bc-hero-grid" style={{ position: "relative", paddingTop: 96, paddingBottom: 110 }}>
            <div>
              <div
                className="bc-hero-enter bc-hero-enter--1"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  border: "1px solid rgba(212,175,55,0.35)",
                  background: "rgba(212,175,55,0.08)",
                  borderRadius: 999,
                  padding: "8px 18px",
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: "#e8c547",
                  marginBottom: 36,
                }}
              >
                <span className="bc-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#d4af37" }} />
                Live on Ethereum Mainnet
              </div>
              <h1 className="bc-hero-title bc-hero-enter bc-hero-enter--2" style={{ fontSize: 76, lineHeight: 1.04, fontWeight: 700, letterSpacing: "-0.025em", margin: "0 0 34px" }}>
                Compound Your
                <br />
                <span className="bc-shimmer">USDT Holdings</span>
                <br />
                On-Chain
              </h1>
              <div className="bc-hero-enter bc-hero-enter--3" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                <span style={{ width: 44, height: 1.5, background: "rgba(212,175,55,0.7)" }} />
                <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: "0.01em" }}>Tiered. Compounding. Non-Custodial.</span>
              </div>
              <p className="bc-hero-enter bc-hero-enter--3" style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(245,245,245,0.72)", maxWidth: 460, margin: "0 0 40px" }}>
                Tiered daily dividends up to 2% with automatic compounding. Fully decentralized. Transparent rewards. Premium VIP benefits.
              </p>
              <div className="bc-hero-enter bc-hero-enter--4" style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 64 }}>
                <a
                  href="#top"
                  className="bc-btn-primary"
                  style={{
                    background: "#a67c00",
                    color: "#0a0a0a",
                    fontSize: 15.5,
                    fontWeight: 600,
                    padding: "15px 32px",
                    borderRadius: 999,
                    display: "inline-block",
                    border: "1px solid rgba(212,175,55,0.4)",
                  }}
                >
                  Connect Wallet
                </a>
                <a
                  href="#tiers"
                  className="bc-btn-outline"
                  style={{
                    background: "transparent",
                    color: "#f5f5f5",
                    fontSize: 15.5,
                    fontWeight: 600,
                    padding: "15px 32px",
                    borderRadius: 999,
                    display: "inline-block",
                    border: "1px solid rgba(212,175,55,0.35)",
                  }}
                >
                  View Staking Tiers
                </a>
              </div>
              <div className="bc-hero-stats bc-hero-enter bc-hero-enter--5" style={{ display: "flex", gap: 56 }}>
                {[
                  ["$12.4M", "Total Value Locked"],
                  ["2,847", "Active Stakers"],
                  ["98.2%", "Uptime"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", color: "#e8c547" }}>{value}</div>
                    <div style={{ fontSize: 13.5, color: "rgba(245,245,245,0.6)", marginTop: 6 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <HeroCoinScene />
          </div>
        </div>
      </section>

      <section id="about" style={{ background: "#050505", padding: "130px 0 120px" }}>
        <div className="bc-container">
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 76 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(212,175,55,0.7)", marginBottom: 22 }}>
                THE BESTCRYPTO PROTOCOL
              </div>
              <h2 className="bc-section-title" style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 auto 22px", maxWidth: 860 }}>
                Your USDT working around the clock — fully on-chain
              </h2>
              <p style={{ fontSize: 15.5, color: "rgba(245,245,245,0.6)", margin: 0 }}>BestCrypto is built on four core pillars:</p>
            </div>
          </FadeIn>
          <div className="bc-pillars-grid">
            {pillars.map((p, i) => (
              <FadeIn key={p.title} delay={i * 80}>
                <div
                  className="bc-pillar-card"
                  style={{
                    position: "relative",
                    borderRadius: 30,
                    overflow: "hidden",
                    background: "linear-gradient(155deg, #141008 0%, #0a0a0a 60%, #050505 100%)",
                    border: "1px solid rgba(212,175,55,0.16)",
                    padding: "30px 26px",
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    height: "100%",
                  }}
                >
                  <PillarAura variant={pillarAuras[i % pillarAuras.length]} />
                  <div
                    style={{
                      position: "absolute",
                      top: 22,
                      right: 22,
                      width: 52,
                      height: 52,
                      borderRadius: 18,
                      background: "rgba(10,10,10,0.9)",
                      border: "1px solid rgba(212,175,55,0.22)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#e8c547",
                      fontSize: 18,
                      zIndex: 2,
                    }}
                  >
                    ↗
                  </div>
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 20,
                        background: "rgba(10,10,10,0.95)",
                        border: "1px solid rgba(212,175,55,0.28)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        color: "#d4af37",
                        marginBottom: 18,
                      }}
                    >
                      {p.icon}
                    </div>
                    <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 10 }}>{p.title}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(245,245,245,0.62)" }}>{p.copy}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section
        id="trust"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#000000",
          padding: "120px 0",
        }}
      >
        <div className="bc-container bc-security-grid" style={{ alignItems: "center" }}>
          <FloatingCoins />
          <FadeIn>
            <div>
              <h2 className="bc-section-title" style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.12, margin: "0 0 22px" }}>
                Trust Through
                <br />
                <span className="bc-shimmer">Transparency</span>
              </h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "rgba(245,245,245,0.68)", margin: "0 0 32px", maxWidth: 440 }}>
                Experience the future of digital dollars — fully backed, fully on-chain. Every stake, reward, and withdrawal is verifiable in real time.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <a href="#tiers" className="bc-btn-secondary" style={{ border: "1px solid rgba(212,175,55,0.4)", color: "#f5f5f5", fontSize: 14.5, fontWeight: 600, padding: "13px 28px", borderRadius: 12, display: "inline-block" }}>
                  Learn More
                </a>
                <a href="#security" className="bc-btn-outline" style={{ color: "#f5f5f5", fontSize: 14.5, fontWeight: 600, padding: "13px 28px", borderRadius: 12, display: "inline-block", border: "1px solid rgba(212,175,55,0.35)" }}>
                  Transparency
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section
        id="tiers"
        style={{
          background: "radial-gradient(110% 90% at 50% 0%, rgba(212,175,55,0.08) 0%, rgba(5,5,5,0) 60%), #050505",
          padding: "110px 0 120px",
        }}
      >
        <div className="bc-container">
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 70 }}>
              <h2 className="bc-section-title" style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 18px" }}>
                Staking Tiers
              </h2>
              <p style={{ fontSize: 15.5, color: "rgba(245,245,245,0.6)", margin: 0 }}>
                Unlock higher APY as your stake grows. From 1% to 2% daily compounded returns.
              </p>
            </div>
          </FadeIn>
          <div className="bc-tiers-grid">
            {tiers.map((t, i) => (
              <FadeIn key={t.name} delay={i * 100}>
                <div
                  className="bc-tier-card"
                  style={{
                    position: "relative",
                    borderRadius: 30,
                    padding: "38px 34px",
                    background: t.bg,
                    border: `1px solid ${t.border}`,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  {t.popular && (
                    <div
                      style={{
                        position: "absolute",
                        top: 24,
                        right: 26,
                        background: "#a67c00",
                        border: "1px solid rgba(212,175,55,0.5)",
                        color: "#0a0a0a",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        padding: "6px 14px",
                        borderRadius: 999,
                      }}
                    >
                      POPULAR
                    </div>
                  )}
                  <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(245,245,245,0.65)", marginBottom: 20 }}>{t.name}</div>
                  <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.02em", color: t.rateColor }}>
                    {t.rate}
                    <span style={{ fontSize: 18, fontWeight: 500, color: "rgba(245,245,245,0.55)" }}> daily</span>
                  </div>
                  <div style={{ fontSize: 14.5, color: "rgba(245,245,245,0.7)", margin: "12px 0 28px", paddingBottom: 26, borderBottom: "1px solid rgba(212,175,55,0.14)" }}>
                    {t.range}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                    {t.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14.5, color: "rgba(245,245,245,0.85)" }}>
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            border: "1px solid rgba(212,175,55,0.5)",
                            color: "#d4af37",
                            fontSize: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </span>
                        {f}
                      </div>
                    ))}
                  </div>
                  <a
                    href="#top"
                    className="bc-tier-cta bc-btn-primary"
                    style={{
                      marginTop: 32,
                      textAlign: "center",
                      background: t.ctaBg,
                      border: "1px solid rgba(212,175,55,0.35)",
                      color: t.popular ? "#0a0a0a" : "#f5f5f5",
                      fontSize: 14.5,
                      fontWeight: 600,
                      padding: "13px 0",
                      borderRadius: 999,
                      display: "block",
                    }}
                  >
                    Stake Now
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="protocol" style={{ background: "#050505", padding: "110px 0 120px", overflow: "hidden" }}>
        <div className="bc-container">
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 className="bc-section-title" style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
                The BestCrypto Protocol
              </h2>
              <p style={{ fontSize: 15.5, color: "rgba(245,245,245,0.6)", margin: "0 auto", maxWidth: 560 }}>
                A next-generation staking network designed for scalability, low fees, and seamless integration with the BestCrypto ecosystem.
              </p>
            </div>
          </FadeIn>
          <BlockchainIsometric />
          <FadeIn delay={160}>
            <p style={{ textAlign: "center", fontSize: 15, lineHeight: 1.65, color: "rgba(245,245,245,0.55)", margin: "48px auto 0", maxWidth: 620 }}>
              Build and deploy scalable applications with native access to stablecoin infrastructure, DeFi protocols, and cross-chain liquidity.
            </p>
          </FadeIn>
        </div>
      </section>

      <section id="vip" style={{ background: "#050505", padding: "100px 0 130px" }}>
        <div className="bc-container" style={{ maxWidth: 1080 }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, marginBottom: 56, flexWrap: "wrap" }}>
              <div>
                <h2 className="bc-section-title" style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 18px" }}>
                  VIP Benefits
                </h2>
                <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "rgba(245,245,245,0.6)", margin: 0, maxWidth: 560 }}>
                  Automatic tier upgrades based on your staked balance. Higher tiers unlock enhanced daily rates and exclusive perks.
                </p>
              </div>
              <span style={{ width: 44, height: 1.5, background: "rgba(212,175,55,0.5)", marginBottom: 14, flexShrink: 0 }} />
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: 26, overflow: "hidden", background: "rgba(8,8,8,0.6)" }}>
              <div className="bc-vip-header">
                <div>LEVEL</div>
                <div>REQUIREMENT</div>
                <div>BONUS RATE</div>
                <div>PERKS</div>
              </div>
              {vipRows.map((r) => (
                <div key={r.level} className="bc-vip-row">
                  <div style={{ fontWeight: 600, color: r.levelColor }}>{r.level}</div>
                  <div style={{ color: "rgba(245,245,245,0.85)" }}>{r.req}</div>
                  <div style={{ fontWeight: 600, color: "#d4af37" }}>{r.bonus}</div>
                  <div style={{ color: "rgba(245,245,245,0.65)" }}>{r.perks}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section
        id="security"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "radial-gradient(120% 130% at 15% 80%, #1a1508 0%, #0a0a0a 45%, #000000 100%)",
          padding: "130px 0",
        }}
      >
        <div
          className="bc-glow"
          style={{
            position: "absolute",
            left: -120,
            bottom: -160,
            width: 520,
            height: 520,
            background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="bc-container bc-security-grid" style={{ position: "relative" }}>
          <FadeIn>
            <div>
              <h2 className="bc-section-title" style={{ fontSize: 52, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.12, margin: "0 0 24px" }}>
                Security
                <br />
                <span style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
                  <span style={{ width: 44, height: 1.5, background: "rgba(212,175,55,0.7)", display: "inline-block" }} />
                  <span className="bc-shimmer">First</span>
                </span>
              </h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "rgba(245,245,245,0.7)", margin: "0 0 28px", maxWidth: 420 }}>
                Professionally audited smart contracts built on OpenZeppelin standards. You stay in control of your funds at all times — everything verifiable on-chain.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 36 }}>
                <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "0.02em", color: "rgba(245,245,245,0.9)" }}>CertiK</span>
                <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "0.02em", color: "rgba(245,245,245,0.6)" }}>OpenZeppelin</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <a href="#top" className="bc-btn-secondary" style={{ border: "1px solid rgba(212,175,55,0.4)", color: "#f5f5f5", fontSize: 14.5, fontWeight: 600, padding: "13px 28px", borderRadius: 12, display: "inline-block" }}>
                  Security Audit
                </a>
                <a href="#top" className="bc-btn-secondary" style={{ border: "1px solid rgba(212,175,55,0.4)", color: "#f5f5f5", fontSize: 14.5, fontWeight: 600, padding: "13px 28px", borderRadius: 12, display: "inline-block" }}>
                  Documentation
                </a>
              </div>
            </div>
          </FadeIn>
          <div className="bc-security-cards">
            {security.map((s, i) => (
              <FadeIn key={s.title} delay={i * 80}>
                <div
                  className="bc-security-card"
                  style={{
                    borderRadius: 24,
                    border: "1px solid rgba(212,175,55,0.18)",
                    background: "rgba(8,8,8,0.75)",
                    padding: "28px 26px",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 16,
                      background: "rgba(10,10,10,0.95)",
                      border: "1px solid rgba(212,175,55,0.28)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 19,
                      color: "#d4af37",
                      marginBottom: 18,
                    }}
                  >
                    {s.icon}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(245,245,245,0.62)" }}>{s.copy}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section style={{ position: "relative", background: "#000000", paddingTop: 110, overflow: "hidden" }}>
        <FluidBlobs />
        <div style={{ position: "relative", zIndex: 1 }}>
        <FadeIn>
          <div className="bc-container" style={{ textAlign: "center", marginBottom: 110 }}>
            <h2 className="bc-section-title" style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 16px" }}>
              Start Earning Today
            </h2>
            <p style={{ fontSize: 15.5, color: "rgba(245,245,245,0.6)", margin: "0 0 34px" }}>
              Connect your wallet and start compounding — no lock-ups, withdraw anytime.
            </p>
            <a
              href="#top"
              className="bc-btn-primary"
              style={{
                background: "#a67c00",
                border: "1px solid rgba(212,175,55,0.4)",
                color: "#0a0a0a",
                fontSize: 16,
                fontWeight: 600,
                padding: "16px 40px",
                borderRadius: 999,
                display: "inline-block",
              }}
            >
              Connect Wallet
            </a>
          </div>
        </FadeIn>

        <div className="bc-container bc-footer-top" style={{ borderTop: "1px solid rgba(212,175,55,0.14)", paddingTop: 40, paddingBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: "1.5px solid rgba(212,175,55,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "#d4af37",
              }}
            >
              ◆
            </span>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.08em" }}>BESTCRYPTO</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
            {["Documentation", "Security Audit", "Terms", "Privacy"].map((label) => (
              <a key={label} href={label === "Security Audit" ? "#security" : "#top"} className="bc-footer-link" style={{ color: "rgba(245,245,245,0.65)", fontSize: 14 }}>
                {label}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {["X", "T", "D"].map((label) => (
              <a
                key={label}
                href="#top"
                className="bc-social-link"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid rgba(212,175,55,0.28)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(245,245,245,0.8)",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="bc-container" style={{ paddingBottom: 36, textAlign: "center", fontSize: 13, color: "rgba(245,245,245,0.45)" }}>
          © 2025 BestCrypto. Audited by CertiK. Built on Ethereum.
        </div>
        </div>
      </section>
    </div>
  );
}
