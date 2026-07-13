# BestCrypto Landing

Marketing landing page for BestCrypto — tiered USDT staking on Ethereum.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- React 19
- TypeScript

## Scripts

```bash
npm run dev        # local dev server on http://localhost:3003
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build      # production build
npm run start      # serve production build
```

## Deploy to GitHub + Vercel

1. Create a new repository on GitHub.
2. Push this project:

```bash
git init
git add .
git commit -m "Initial BestCrypto landing page"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

3. Import the repo in [Vercel](https://vercel.com/new). Framework preset: **Next.js**. No extra build settings needed.
4. Optional: set `NEXT_PUBLIC_SITE_URL` to your production URL for correct Open Graph metadata.

## Project structure

```
app/                    # pages, layout, global styles
components/             # Nav, FadeIn, animation scenes
components/three/       # CryptoCoin3D, HeroScene3D, TrustScene3D, ProtocolScene3D
components/animations/  # PillarAura, FluidBlobs, etc.
public/coins/           # 3D coin renders (BTC, ETH, SOL, BNB)
lib/data.ts             # tiers, pillars, copy data
public/animations/      # optional local media assets
```
