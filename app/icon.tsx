import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#090E0C",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "linear-gradient(145deg, #E8C547 0%, #C9A227 45%, #8B6914 100%)",
            border: "2px solid #2EE6A8",
            boxShadow: "0 0 10px rgba(46,230,168,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
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
