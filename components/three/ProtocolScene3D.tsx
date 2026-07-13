"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Float, useTexture } from "@react-three/drei";
import { SRGBColorSpace, type Group, type Mesh } from "three";
import { ethGoldSprite } from "@/lib/assets";

function EthGoldBeacon() {
  const group = useRef<Group>(null);
  const raw = useTexture(ethGoldSprite);
  const map = useMemo(() => {
    const t = raw.clone();
    t.colorSpace = SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }, [raw]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.position.y = 1.4 + Math.sin(t * 0.9) * 0.18;
    g.rotation.z = Math.sin(t * 0.6) * 0.06;
  });

  return (
    <group ref={group} position={[0, 1.4, 1.2]}>
      <Billboard>
        <mesh>
          <planeGeometry args={[1.7, 1.7]} />
          <meshBasicMaterial map={map} transparent alphaTest={0.05} depthWrite={false} />
        </mesh>
        {/* Halo behind the coin */}
        <mesh position={[0, 0, -0.05]}>
          <circleGeometry args={[1.05, 48]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={0.07} depthWrite={false} />
        </mesh>
      </Billboard>
    </group>
  );
}

function IsoCube({ position, size, delay = 0 }: { position: [number, number, number]; size: number; delay?: number }) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    ref.current.position.y = position[1] + Math.sin(t * 1.2) * 0.15;
    ref.current.rotation.y = t * 0.3;
    ref.current.rotation.x = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial
          color="#1a1508"
          metalness={0.85}
          roughness={0.2}
          emissive="#d4af37"
          emissiveIntensity={0.08}
          transparent
          opacity={0.92}
        />
      </mesh>
    </Float>
  );
}

function Platform() {
  return (
    <group rotation={[-Math.PI / 6, Math.PI / 4, 0]} position={[0, -1.2, 0]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, i * 0.35, 0]}>
          <boxGeometry args={[3.2 - i * 0.5, 0.25, 3.2 - i * 0.5]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial color="#141008" metalness={0.95} roughness={0.15} emissive="#d4af37" emissiveIntensity={0.12} wireframe={false} />
      </mesh>
    </group>
  );
}

function ProtocolContent() {
  const nodes: [number, number, number][] = [
    [-2.2, 1.2, 0],
    [2.4, 0.8, -0.5],
    [-1.5, -0.8, 0.5],
    [1.8, -1, 0.3],
    [0.5, 1.8, -0.3],
    [-0.3, -1.6, -0.2],
    [2.8, -0.3, 0.8],
  ];

  return (
    <>
      <Platform />
      <Suspense fallback={null}>
        <EthGoldBeacon />
      </Suspense>
      {nodes.map((pos, i) => (
        <IsoCube key={i} position={pos} size={0.35 + (i % 3) * 0.08} delay={i * 0.7} />
      ))}
    </>
  );
}

export default function ProtocolScene3D() {
  return (
    <div className="bc-three-canvas bc-three-canvas--protocol">
      <Canvas camera={{ position: [0, 1, 7], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.25} />
        <spotLight position={[5, 10, 5]} intensity={2} color="#e8c547" angle={0.4} penumbra={1} />
        <pointLight position={[-3, 2, 3]} intensity={0.8} color="#d4af37" />
        <ProtocolContent />
      </Canvas>
    </div>
  );
}
