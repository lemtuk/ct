"use client";

import { Float, useTexture } from "@react-three/drei";

type EthBillboardProps = {
  position: [number, number, number];
  scale?: number;
  floatIntensity?: number;
  rotation?: [number, number, number];
};

export default function EthBillboard({
  position,
  scale = 2.2,
  floatIntensity = 0.8,
  rotation = [0, 0, 0],
}: EthBillboardProps) {
  const texture = useTexture("/3dicons-eth-icon/eth/dynamic/premium.png");

  return (
    <Float speed={1.8} rotationIntensity={0.15} floatIntensity={floatIntensity}>
      <mesh position={position} rotation={rotation} scale={scale}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </Float>
  );
}
