"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import type { Mesh } from "three";

export function PerspectiveGrid() {
  return (
    <Grid
      renderOrder={-1}
      position={[0, -1.55, 0]}
      args={[16, 16]}
      cellSize={0.42}
      cellThickness={0.55}
      cellColor="#2EE6A8"
      sectionSize={2.1}
      sectionThickness={0.9}
      sectionColor="#14B8A6"
      fadeDistance={20}
      fadeStrength={1.3}
      followCamera={false}
      infiniteGrid={false}
    />
  );
}

type GlassPanelProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  opacity?: number;
};

export function GlassPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [2.4, 3.4],
  opacity = 0.07,
}: GlassPanelProps) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshPhysicalMaterial
        color="#2EE6A8"
        transparent
        opacity={opacity}
        roughness={0.08}
        metalness={0.15}
        transmission={0.92}
        thickness={0.35}
        ior={1.2}
        envMapIntensity={0.8}
        depthWrite={false}
      />
    </mesh>
  );
}

export function OrbitRings() {
  const inner = useRef<Mesh>(null);
  const outer = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (inner.current) inner.current.rotation.z += delta * 0.18;
    if (outer.current) outer.current.rotation.z -= delta * 0.1;
  });

  return (
    <group position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={outer}>
        <ringGeometry args={[2.5, 3.2, 72]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.07} depthWrite={false} />
      </mesh>
      <mesh ref={inner}>
        <ringGeometry args={[1.55, 1.85, 64]} />
        <meshBasicMaterial color="#2EE6A8" transparent opacity={0.1} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function CoinShadow({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={[position[0], -1.48, position[2]]} rotation={[-Math.PI / 2, 0, 0]} scale={[scale, scale, 1]}>
      <circleGeometry args={[0.55, 32]} />
      <meshBasicMaterial color="#2EE6A8" transparent opacity={0.06} depthWrite={false} />
    </mesh>
  );
}
