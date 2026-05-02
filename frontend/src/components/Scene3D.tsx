"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Float, 
  MeshDistortMaterial, 
  PerspectiveCamera, 
  PresentationControls, 
  Sphere, 
  Torus,
  MeshWobbleMaterial,
  Environment,
  ContactShadows
} from "@react-three/drei";
import * as THREE from "three";

function FloatingElements() {
  return (
    <group>
      {/* Central Morphing Sphere */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 128, 128]} scale={1.8}>
          <MeshDistortMaterial
            color="#3b82f6"
            attach="material"
            distort={0.5}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      {/* Satellite Objects */}
      <Float speed={3} rotationIntensity={2} floatIntensity={1}>
        <Torus args={[0.5, 0.15, 16, 100]} position={[3, 2, -2]}>
          <MeshWobbleMaterial color="#f59e0b" speed={1} factor={0.6} />
        </Torus>
      </Float>

      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[-3, -1, -1]}>
          <octahedronGeometry args={[0.6]} />
          <MeshDistortMaterial color="#10b981" speed={3} distort={0.4} />
        </mesh>
      </Float>

      <Float speed={4} rotationIntensity={0.5} floatIntensity={3}>
        <mesh position={[2, -2, 1]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <MeshWobbleMaterial color="#8b5cf6" speed={2} factor={1} />
        </mesh>
      </Float>
    </group>
  );
}

function ParticleWave({ count = 2000 }) {
  const mesh = useRef<THREE.Points>(null!);
  const { mouse } = useThree();

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 20;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 20;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.05;
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, mouse.y * 0.2, 0.1);
    mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, -mouse.x * 0.2, 0.1);
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#94a3b8" transparent opacity={0.4} />
    </points>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, -10, -10]} color="white" intensity={1} />
          
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <FloatingElements />
          </PresentationControls>

          <ParticleWave />
          <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
