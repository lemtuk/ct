"use client";

import dynamic from "next/dynamic";

const HeroScene3D = dynamic(() => import("@/components/three/HeroScene3D"), {
  ssr: false,
  loading: () => <div className="bc-three-canvas bc-three-canvas--hero bc-three-canvas--loading" />,
});

const TrustScene3D = dynamic(() => import("@/components/three/TrustScene3D"), {
  ssr: false,
  loading: () => <div className="bc-three-canvas bc-three-canvas--trust bc-three-canvas--loading" />,
});

const ProtocolScene3D = dynamic(() => import("@/components/three/ProtocolScene3D"), {
  ssr: false,
  loading: () => <div className="bc-three-canvas bc-three-canvas--protocol bc-three-canvas--loading" />,
});

export { HeroScene3D, TrustScene3D, ProtocolScene3D };
