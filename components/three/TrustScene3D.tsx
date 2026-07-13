"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import type { Group } from "three";
import GoldCoin from "./GoldCoin";
import CryptoCoin3D from "./CryptoCoin3D";
import { coins } from "@/lib/assets";

function TrustContent() {
  const group = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = pointer.x * 0.22;
    group.current.rotation.x = pointer.y * 0.08;
  });

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        {/* Centerpiece — Ethereum */}
        <CryptoCoin3D
          coin={coins.ethBlue}
          position={[0.35, 0.15, 0]}
          scale={1.7}
          rotationSpeed={0.008}
          floatIntensity={0.65}
          tilt={[0.1, 0, 0]}
        />
        {/* Solana — left */}
        <CryptoCoin3D
          coin={coins.sol}
          position={[-1.75, -0.5, -0.4]}
          scale={0.72}
          rotationSpeed={-0.012}
          floatIntensity={0.45}
          tilt={[0.12, 0, -0.08]}
        />
        {/* BNB — upper left */}
        <CryptoCoin3D
          coin={coins.bnb}
          position={[-1.3, 0.95, -0.7]}
          scale={0.5}
          rotationSpeed={0.015}
          floatIntensity={0.4}
          tilt={[0.14, 0, 0.1]}
        />
        {/* Bitcoin — right accent */}
        <CryptoCoin3D
          coin={coins.btc}
          position={[2.05, -0.65, -0.3]}
          scale={0.62}
          rotationSpeed={-0.01}
          floatIntensity={0.42}
          tilt={[0.1, 0, 0.05]}
        />
      </Suspense>
      <GoldCoin position={[2.2, 0.75, -0.8]} scale={0.35} rotationSpeed={-0.004} />
      <GoldCoin position={[-2.4, 0.3, -1.1]} scale={0.28} rotationSpeed={0.005} />
    </group>
  );
}

export default function TrustScene3D() {
  return (
    <div className="bc-three-canvas bc-three-canvas--trust">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.38} />
        <spotLight position={[6, 10, 6]} intensity={2.4} color="#fff8dc" angle={0.4} penumbra={0.8} />
        <pointLight position={[-4, 2, 4]} intensity={1.1} color="#d4af37" />
        <pointLight position={[3, -2, 2]} intensity={0.5} color="#8fa3e8" />
        <Suspense fallback={null}>
          <TrustContent />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
