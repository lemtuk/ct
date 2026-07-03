import { navLinks } from "@/lib/data";

function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1.5px solid rgba(212,175,55,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.45,
        color: "#d4af37",
        background: "radial-gradient(circle at 35% 30%, #1a1508, #0a0a0a)",
      }}
    >
      ◆
    </span>
  );
}

export default function Nav() {
  return (
    <div className="bc-container" style={{ position: "relative", paddingTop: 28, paddingBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10, color: "#f5f5f5" }}>
        <LogoMark />
        <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "0.08em" }}>BESTCRYPTO</span>
      </a>
      <div className="bc-nav-links" style={{ display: "flex", alignItems: "center", gap: 40 }}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="bc-nav-link" style={{ color: "rgba(245,245,245,0.85)", fontSize: 15, fontWeight: 500 }}>
            {link.label}
          </a>
        ))}
      </div>
      <a
        href="#top"
        className="bc-nav-cta"
        style={{
          background: "rgba(212,175,55,0.12)",
          border: "1px solid rgba(212,175,55,0.4)",
          color: "#e8c547",
          fontSize: 15,
          fontWeight: 600,
          padding: "12px 26px",
          borderRadius: 999,
          display: "inline-block",
        }}
      >
        Connect Wallet
      </a>
    </div>
  );
}

export { LogoMark };
