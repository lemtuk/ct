import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import "./animations.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bestcrypto.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "BestCrypto — Compound Your USDT On-Chain",
  description:
    "Tiered daily dividends up to 2% with automatic compounding. Fully decentralized. Transparent rewards. Premium VIP benefits on Ethereum.",
  keywords: ["BestCrypto", "USDT", "staking", "DeFi", "Ethereum", "compound", "non-custodial"],
  openGraph: {
    type: "website",
    title: "BestCrypto — Compound Your USDT On-Chain",
    description:
      "Tiered daily dividends up to 2% with automatic compounding. Fully decentralized. Transparent rewards.",
    siteName: "BestCrypto",
  },
  twitter: {
    card: "summary_large_image",
    title: "BestCrypto — Compound Your USDT On-Chain",
    description:
      "Tiered daily dividends up to 2% with automatic compounding. Fully decentralized. Transparent rewards.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
