"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import { SRGBColorSpace, type Group, type Texture } from "three";
import type { CoinSpec } from "@/lib/assets";

type CryptoCoin3DProps = {
  coin: CoinSpec;
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
  floatIntensity?: number;
  tilt?: [number, number, number];
  /** Continuous Y-spin (coin flip style) instead of gentle sway */
  spin?: boolean;
};

function useCoinFace(src: string, zoom: number): Texture {
  const raw = useTexture(src);

  return useMemo(() => {
    const t = raw.clone();
    t.colorSpace = SRGBColorSpace;
    if (zoom < 1) {
      t.center.set(0.5, 0.5);
      t.repeat.set(zoom, zoom);
    }
    t.needsUpdate = true;
    return t;
  }, [raw, zoom]);
}

export default function CryptoCoin3D({
  coin,
  position = [0, 0, 0],
  scale = 1,
  rotationSpeed = 0.008,
  floatIntensity = 0.55,
  tilt = [0.15, 0, 0],
  spin = true,
}: CryptoCoin3DProps) {
  const group = useRef<Group>(null);
  const faceMap = useCoinFace(coin.texture, coin.faceZoom);
  const baseY = position[1];

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if (spin) {
      g.rotation.y += rotationSpeed;
    } else {
      g.rotation.y = Math.sin(t * 0.5 + position[0]) * 0.35;
    }
    g.position.y = baseY + Math.sin(t * 0.85 + position[0] * 2) * 0.08 * scale;
  });

  const radius = 1;
  const thickness = 0.16;

  return (
    <Float speed={1.6} floatIntensity={floatIntensity} rotationIntensity={0.06}>
      <group ref={group} position={position} scale={scale} rotation={tilt}>
        {/* Stand the coin upright: faces point along ±Z, Y-spin flips it */}
        <group rotation={[Math.PI / 2, 0, 0]}>
          {/* Rim */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[radius, radius, thickness, 72]} />
            <meshStandardMaterial
              color={coin.rimColor}
              metalness={0.95}
              roughness={0.18}
              envMapIntensity={1.5}
            />
          </mesh>

          {/* Reeded edge detail */}
          <mesh>
            <torusGeometry args={[radius, thickness * 0.32, 12, 96]} />
            <meshStandardMaterial color={coin.rimDark} metalness={0.9} roughness={0.32} />
          </mesh>

          {/* Face — front */}
          <mesh position={[0, thickness / 2 + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[radius * 0.965, 72]} />
            <meshStandardMaterial
              map={faceMap}
              metalness={0.55}
              roughness={0.3}
              envMapIntensity={1.1}
            />
          </mesh>

          {/* Face — back */}
          <mesh position={[0, -thickness / 2 - 0.004, 0]} rotation={[Math.PI / 2, 0, Math.PI]}>
            <circleGeometry args={[radius * 0.965, 72]} />
            <meshStandardMaterial
              map={faceMap}
              metalness={0.55}
              roughness={0.34}
            />
          </mesh>
        </group>

        {/* Soft halo */}
        <mesh>
          <ringGeometry args={[radius * 1.05, radius * 1.5, 64]} />
          <meshBasicMaterial color={coin.glowColor} transparent opacity={0.05} depthWrite={false} />
        </mesh>
      </group>
    </Float>
  );
}
