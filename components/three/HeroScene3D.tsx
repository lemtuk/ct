"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Stars } from "@react-three/drei";
import type { Group } from "three";
import GoldCoin from "./GoldCoin";
import CryptoCoin3D from "./CryptoCoin3D";
import { coins } from "@/lib/assets";

function SceneContent() {
  const group = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y += (pointer.x * 0.35 - group.current.rotation.y) * 0.02;
    group.current.rotation.x += (-pointer.y * 0.12 - group.current.rotation.x) * 0.02;
  });

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        {/* Centerpiece — Bitcoin */}
        <CryptoCoin3D
          coin={coins.btc}
          position={[0.15, 0.05, 0.9]}
          scale={1.5}
          rotationSpeed={0.009}
          floatIntensity={0.7}
          tilt={[0.12, 0, 0.05]}
        />
        {/* Ethereum — upper left */}
        <CryptoCoin3D
          coin={coins.ethBlue}
          position={[-1.85, 0.75, -0.5]}
          scale={0.78}
          rotationSpeed={-0.011}
          floatIntensity={0.5}
          tilt={[0.08, 0, -0.1]}
        />
        {/* Solana — right */}
        <CryptoCoin3D
          coin={coins.sol}
          position={[1.8, -0.55, -0.3]}
          scale={0.66}
          rotationSpeed={0.013}
          floatIntensity={0.45}
          tilt={[0.15, 0, 0.08]}
        />
        {/* BNB — lower left */}
        <CryptoCoin3D
          coin={coins.bnb}
          position={[-1.2, -0.95, 0.3]}
          scale={0.52}
          rotationSpeed={0.016}
          floatIntensity={0.4}
          tilt={[0.1, 0, -0.06]}
        />
        {/* ETH — small far accent */}
        <CryptoCoin3D
          coin={coins.ethBlue}
          position={[2.15, 0.95, -1.2]}
          scale={0.34}
          rotationSpeed={-0.018}
          floatIntensity={0.35}
          tilt={[0.12, 0, 0.12]}
        />
      </Suspense>

      <GoldCoin position={[-2.5, -0.2, -1.4]} scale={0.28} rotationSpeed={0.005} />
      <GoldCoin position={[0.9, 1.35, -1.6]} scale={0.22} rotationSpeed={-0.004} />

      <Float speed={1.2} floatIntensity={0.4}>
        <mesh position={[0, -1.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 3.2, 64]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={0.06} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene3D() {
  return (
    <div className="bc-three-canvas bc-three-canvas--hero">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 42 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[8, 12, 8]} angle={0.35} penumbra={0.8} intensity={2.6} color="#fff8dc" castShadow />
        <pointLight position={[-6, -4, 6]} intensity={1.3} color="#d4af37" />
        <pointLight position={[4, 2, -4]} intensity={0.7} color="#a67c00" />
        <pointLight position={[-3, 3, 3]} intensity={0.4} color="#b088e8" />
        <Stars radius={80} depth={40} count={1200} factor={3} saturation={0} fade speed={0.4} />
        <Suspense fallback={null}>
          <SceneContent />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
