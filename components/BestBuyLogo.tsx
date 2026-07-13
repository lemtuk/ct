import Image from "next/image";

type BestBuyLogoProps = {
  size?: number;
};

export default function BestBuyLogo({ size = 34 }: BestBuyLogoProps) {
  return (
    <span
      className="bb-logo-coin"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1.5px solid rgba(46,230,168,0.45)",
        boxShadow: "0 0 18px rgba(46,230,168,0.18)",
        flexShrink: 0,
      }}
    >
      <Image
        src="/coins/eth-gold.png"
        alt="BestBuy"
        width={size}
        height={size}
        style={{ objectFit: "cover", transform: "scale(1.08)" }}
      />
    </span>
  );
}
