import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Html, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { projects } from '../data/projects' // Uses your existing video projects data

// Interactive 3D Orbital Globe with Video Nodes inspired by Draftly Oodles
function InteractiveVideoGlobe() {
  const groupRef = useRef()
  const globePointsRef = useRef()

  // Generate globe wireframe points
  const points = useMemo(() => {
    const pts = []
    const count = 300
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count)
      const theta = Math.sqrt(count * Math.PI) * phi
      const radius = 2.2
      pts.push(
        new THREE.Vector3(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        )
      )
    }
    return pts
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  // Selected videos to attach to 3D Globe Orbit Nodes
  const nodeVideos = projects ? projects.slice(0, 3) : []

  return (
    <group ref={groupRef}>
      {/* Outer Glow Halo */}
      <mesh>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.05} wireframe />
      </mesh>

      {/* Dotted Sphere Nodes */}
      <group ref={globePointsRef}>
        {points.map((pt, idx) => (
          <mesh key={idx} position={pt}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color={idx % 5 === 0 ? "#f97316" : "#f59e0b"} transparent opacity={0.6} />
          </mesh>
        ))}
      </group>

      {/* Floating Interactive Video Nodes */}
      {nodeVideos.map((proj, i) => {
        const angle = (i / Math.max(nodeVideos.length, 1)) * Math.PI * 2
        const radius = 2.8
        const pos = [
          Math.cos(angle) * radius,
          (i - 1) * 0.8,
          Math.sin(angle) * radius
        ]

        return (
          <Float key={proj.id || i} speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={pos}>
              {/* Glowing anchor point */}
              <mesh>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#f97316" />
              </mesh>

              {/* 3D Floating Video Card */}
              <Html transform distanceFactor={5} position={[0, 0, 0]} zIndexRange={[100, 0]}>
                <div className="w-48 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-orange-500/30 shadow-xl hover:scale-105 transition-transform duration-300">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-2">
                    {proj.videoUrl ? (
                      <iframe
                        src={proj.videoUrl}
                        title={proj.title}
                        className="w-full h-full object-cover pointer-events-none"
                        allow="autoplay; encrypted-media"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-orange-400">
                        Video Node #{i + 1}
                      </div>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{proj.title}</h4>
                  <span className="text-[10px] text-orange-400 font-mono">{proj.category || "Edits"}</span>
                </div>
              </Html>
            </group>
          </Float>
        )
      })}

      {/* Ambient particles */}
      <Sparkles count={40} scale={6} size={2} color="#f97316" opacity={0.6} />
    </group>
  )
}

export default function Hero() {
  const featuredWorks = projects ? projects.slice(0, 2) : []

  return (
    <section className="relative min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-between z-10 overflow-hidden">
      
      {/* 1. Header & Tagline (Draftly Oodles Style) */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span className="text-xs font-mono font-medium text-orange-400 uppercase tracking-widest">
            ROLL0K • ARTISTIC VIDEO CREATIVE
          </span>
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          CINEMATIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500">VISUALS</span> & EDITING
        </h1>

        <p className="text-sm md:text-lg text-slate-400 font-light max-w-xl mx-auto">
          Elevating digital stories through high-octane editing, custom visual effects, and dynamic montage pacing.
        </p>
      </div>

      {/* 2. Main Center Grid: 3D Globe + Video Preview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-4">
        
        {/* Left Column: Featured Video Showcase */}
        <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
          <h3 className="text-xs font-mono uppercase tracking-wider text-orange-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            FEATURED WORKS
          </h3>

          {featuredWorks.map((item) => (
            <div 
              key={item.id} 
              className="group p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-orange-500/50 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3">
                {item.videoUrl ? (
                  <iframe
                    src={item.videoUrl}
                    title={item.title}
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    Video Player
                  </div>
                )}
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-1 mt-1">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Center Column: 3D Interactive Globe Canvas */}
        <div className="lg:col-span-5 h-[380px] md:h-[480px] relative w-full order-1 lg:order-2 flex items-center justify-center">
          <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#f97316" />
            <InteractiveVideoGlobe />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
          </Canvas>
          
          <div className="absolute bottom-2 text-center text-[10px] text-slate-500 font-mono tracking-widest pointer-events-none">
            DRAG TO ROTATE GLOBE ORBIT
          </div>
        </div>

        {/* Right Column: "Coming Soon" & Future Project Holders */}
        <div className="lg:col-span-3 space-y-4 order-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            MORE EDITING WORKS
          </h3>

          {/* Placeholder Slot 1 */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 border-dashed backdrop-blur-sm flex flex-col items-center justify-center text-center h-32 hover:border-orange-500/40 transition-colors">
            <span className="text-xs font-mono text-orange-400 mb-1">[ NEW REEL ]</span>
            <span className="text-sm font-medium text-slate-300">Commercial Edit</span>
            <span className="mt-2 text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-mono">
              COMING SOON
            </span>
          </div>

          {/* Placeholder Slot 2 */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 border-dashed backdrop-blur-sm flex flex-col items-center justify-center text-center h-32 hover:border-amber-500/40 transition-colors">
            <span className="text-xs font-mono text-amber-400 mb-1">[ VFX MONTAGE ]</span>
            <span className="text-sm font-medium text-slate-300">Color Grading Suite</span>
            <span className="mt-2 text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">
              IN PRODUCTION
            </span>
          </div>
        </div>

      </div>

      {/* 3. Bottom Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/60 mt-4">
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span>LOCATION: SRMIC, TN</span>
          <span>•</span>
          <span>CREATOR: ELAMUKIL KUMARESAN</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#projects"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-semibold text-xs tracking-wider uppercase hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20"
          >
            Explore Projects
          </a>
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-xs tracking-wider uppercase hover:border-orange-500/50 transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </div>

    </section>
  )
}