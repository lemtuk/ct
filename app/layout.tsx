import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { WalletProvider } from "@/lib/WalletContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sg",
  display: "swap",
  weight: ["500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bestbuy.finance";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "BestBuy — Compound Your USDT On-Chain",
  description:
    "BestBuy helps USDT holders access tiered daily dividends up to 2% with automatic compounding, transparent on-chain rewards, and premium VIP benefits.",
  keywords: ["BestBuy", "USDT", "staking", "yield", "DeFi", "Ethereum", "on-chain", "stablecoin"],
  openGraph: {
    type: "website",
    title: "BestBuy — Compound Your USDT On-Chain",
    description:
      "Tiered USDT dividends, automatic compounding, transparent rewards, and VIP benefits on Ethereum.",
    siteName: "BestBuy",
  },
  twitter: {
    card: "summary_large_image",
    title: "BestBuy — Compound Your USDT On-Chain",
    description:
      "Tiered USDT dividends, automatic compounding, transparent rewards, and VIP benefits on Ethereum.",
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
