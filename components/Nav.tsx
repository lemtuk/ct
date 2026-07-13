import { navLinks } from "@/lib/data";

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="2" y="2" width="12" height="12" rx="3" fill="rgba(212,175,55,0.25)" stroke="rgba(212,175,55,0.5)" strokeWidth="1" />
      <rect x="18" y="2" width="12" height="12" rx="3" fill="rgba(212,175,55,0.15)" stroke="rgba(212,175,55,0.35)" strokeWidth="1" />
      <rect x="2" y="18" width="12" height="12" rx="3" fill="rgba(212,175,55,0.15)" stroke="rgba(212,175,55,0.35)" strokeWidth="1" />
      <rect x="18" y="18" width="12" height="12" rx="3" fill="rgba(212,175,55,0.25)" stroke="rgba(212,175,55,0.5)" strokeWidth="1" />
    </svg>
  );
}

export default function Nav() {
  return (
    <header className="bc-nav">
      <div className="bc-container bc-nav__inner">
        <a href="#top" className="bc-nav__brand">
          <LogoMark />
          <span>BestCrypto</span>
        </a>
        <nav className="bc-nav-links" aria-label="Main">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="bc-nav-link">
              {link.label}
            </a>
          ))}
        </nav>
        <a href="#top" className="bc-nav-cta">
          Connect
        </a>
      </div>
    </header>
  );
}

export { LogoMark };
