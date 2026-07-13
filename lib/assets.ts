export type CoinSpec = {
  texture: string;
  rimColor: string;
  rimDark: string;
  glowColor: string;
  /** UV zoom — how much of the source image the coin face occupies */
  faceZoom: number;
};

/** Tilted 3D render with transparency — used as a floating billboard, not a coin face */
export const ethGoldSprite = "/coins/eth-gold.png";

export const coins: Record<"btc" | "ethBlue" | "sol" | "bnb", CoinSpec> = {
  btc: {
    texture: "/coins/btc.png",
    rimColor: "#e09c3f",
    rimDark: "#7a4a10",
    glowColor: "#f0a848",
    faceZoom: 0.86,
  },
  ethBlue: {
    texture: "/coins/eth-blue.png",
    rimColor: "#8fa3e8",
    rimDark: "#3d4a8a",
    glowColor: "#a5b8ff",
    faceZoom: 0.86,
  },
  sol: {
    texture: "/coins/sol.png",
    rimColor: "#b088e8",
    rimDark: "#5a3a99",
    glowColor: "#c9a0ff",
    faceZoom: 0.86,
  },
  bnb: {
    texture: "/coins/bnb.png",
    rimColor: "#e8c547",
    rimDark: "#8b6914",
    glowColor: "#f4d666",
    faceZoom: 0.86,
  },
};
