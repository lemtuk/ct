"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

type GoldCoinProps = {
  position: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
  floatSpeed?: number;
  floatAmp?: number;
};

export default function GoldCoin({
  position,
  scale = 1,
  rotationSpeed = 0.004,
  floatSpeed = 0.9,
  floatAmp = 0.12,
}: GoldCoinProps) {
  const ref = useRef<Mesh>(null);
  const baseY = position[1];

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.y += rotationSpeed;
    mesh.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    mesh.position.y = baseY + Math.sin(state.clock.elapsedTime * floatSpeed + position[0]) * floatAmp;
  });

  return (
    <mesh ref={ref} position={position} scale={scale} castShadow receiveShadow>
      <cylinderGeometry args={[1, 1, 0.18, 48]} />
      <meshStandardMaterial color="#c9a227" metalness={0.92} roughness={0.22} envMapIntensity={1.2} />
    </mesh>
  );
}
