import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 30%, #142820 0%, #090E0C 70%)",
        }}
      >
        <div
          style={{
            width: 128,
            height: 128,
            borderRadius: "50%",
            background: "linear-gradient(145deg, #F0D060 0%, #D4AF37 40%, #9A7B1A 100%)",
            border: "4px solid #2EE6A8",
            boxShadow: "0 0 40px rgba(46,230,168,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
            fontWeight: 700,
            color: "#05130D",
          }}
        >
          B
        </div>
      </div>
    ),
    { ...size }
  );
}
