import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshWobbleMaterial, Stars } from '@react-three/drei';

function HeroShape() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.8}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <MeshWobbleMaterial
          color="#3b82f6"
          factor={0.4}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white relative font-sans overflow-x-hidden">
      {/* 3D Canvas Background */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          gl={{ powerPreference: "high-performance", antialias: true }}
          dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <pointLight position={[-10, -10, -5]} color="#6366f1" intensity={1} />
          
          <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />
          
          <Suspense fallback={null}>
            <HeroShape />
          </Suspense>
          
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Main Content Overlay */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-3xl backdrop-blur-sm bg-slate-900/40 p-8 rounded-2xl border border-slate-800 shadow-2xl">
          <span className="text-blue-400 font-mono text-sm tracking-widest uppercase">
            Electronics Engineer & Developer
          </span>
          <h1 className="mt-2 text-4xl sm:text-6xl font-black tracking-tight text-white">
            ELAMUKIL KUMARESAN
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
            Building interactive embedded systems, microcontroller solutions, and modern WebGL experiences.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#projects"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/25"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 transition-all"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}