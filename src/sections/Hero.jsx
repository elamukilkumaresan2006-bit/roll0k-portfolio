import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Sparkles, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Your 6 Cloudinary Videos shared earlier
const cloudinaryVideos = [
  'https://res.cloudinary.com/t6bizkaw/video/upload/v1785531462/lv_0_20251218152503_maob9m.mp4',
  'https://res.cloudinary.com/t6bizkaw/video/upload/v1785559047/lv_0_20241027003324_eicthg.mp4',
  'https://res.cloudinary.com/t6bizkaw/video/upload/v1785559621/lv_0_20250714140633_xhrfmy.mp4',
  'https://res.cloudinary.com/t6bizkaw/video/upload/v1785560049/lv_0_20260201113718_ls4oww.mp4',
  'https://res.cloudinary.com/t6bizkaw/video/upload/v1785560864/lv_0_20250629171052_h1hwdy.mp4',
  'https://res.cloudinary.com/t6bizkaw/video/upload/v1785561597/lv_0_20250722194326_aubhkz.mp4',
]

// 1. A single dynamic video node on the sphere. 
// This creates a 3D Plane that looks at the center and hosts an <Html> video element.
function VideoSphereNode({ videoUrl, position, radius, rotationPaused }) {
  const meshRef = useRef()
  const videoRef = useRef()

  // Make the plane geometry always face the sphere center (origin)
  useEffect(() => {
    meshRef.current.lookAt(0, 0, 0)
  }, [])

  return (
    <group position={position}>
      {/* invisible backing plane for basic Three.js hit testing */}
      <mesh ref={meshRef}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* The actual looping video element using <Html transform> */}
      {/* distanceFactor 20 scales it up relative to the canvas unit */}
      <Html transform distanceFactor={22} position={[0, 0, 0]} zIndexRange={[100, 0]} rotation={[0,0,0]}>
        <div className="w-48 aspect-[4/3] rounded-2xl overflow-hidden bg-black/80 border border-slate-700/50 shadow-2xl transition-transform duration-300 hover:scale-105 group">
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      </Html>
    </group>
  )
}

// 2. A "Coming Soon" placeholder node when videos are not sufficient.
function PlaceholderSphereNode({ position }) {
  const meshRef = useRef()

  useEffect(() => {
    meshRef.current.lookAt(0, 0, 0)
  }, [])

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <Html transform distanceFactor={20} position={[0, 0, 0]} zIndexRange={[50, 0]} rotation={[0,0,0]}>
        <div className="w-40 aspect-[4/3] rounded-2xl flex flex-col items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm border border-orange-500/20 shadow-xl text-center group">
          <span className="text-xs font-mono text-orange-400 mb-1">[ VFX MONTAGE ]</span>
          <span className="text-sm font-medium text-slate-300">Commercial Edit</span>
          <span className="mt-2 text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-mono">
            COMING SOON
          </span>
        </div>
      </Html>
    </group>
  )
}

// 3. The Main Interactive Sphere structure, matching the Draftly Oodles style.
function InteractiveVideoSphere() {
  const globeRef = useRef()
  const rotationPaused = useRef(false)
  const sphereRadius = 3.8 // Controls how spread out the nodes are

  // Define how many nodes the sphere structure should have. Draftly uses many.
  // We'll calculate positions for 28 total nodes.
  const totalNodesCount = 28
  
  const nodePositions = useMemo(() => {
    const pts = []
    const count = totalNodesCount
    for (let i = 0; i < count; i++) {
      // Golden spiral distribution algorithm
      const phi = Math.acos(-1 + (2 * i) / count)
      const theta = Math.sqrt(count * Math.PI) * phi
      
      pts.push(
        new THREE.Vector3(
          sphereRadius * Math.cos(theta) * Math.sin(phi),
          sphereRadius * Math.sin(theta) * Math.sin(phi),
          sphereRadius * Math.cos(phi)
        )
      )
    }
    return pts
  }, [sphereRadius])

  useFrame((state, delta) => {
    if (globeRef.current && !rotationPaused.current) {
      globeRef.current.rotation.y += delta * 0.1 // Smooth y-axis rotation
      globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05 // Faint wobble
    }
  })

  // Event handlers to pause rotation on globe hover
  const onGlobeHover = (isHovering) => {
    rotationPaused.current = isHovering
  }

  return (
    <group 
      ref={globeRef}
      onPointerOver={() => onGlobeHover(true)}
      onPointerOut={() => onGlobeHover(false)}
    >
      {/* Map through all calculated positions */}
      {nodePositions.map((pos, idx) => {
        // Use an actual Cloudinary video if index < 6
        if (idx < cloudinaryVideos.length) {
          return (
            <VideoSphereNode
              key={`vid-${idx}`}
              videoUrl={cloudinaryVideos[idx]}
              position={pos}
              radius={sphereRadius}
            />
          )
        } else {
          // Otherwise, fill remaining slots with "Coming Soon" placeholders
          return (
            <PlaceholderSphereNode
              key={`place-${idx}`}
              position={pos}
            />
          )
        }
      })}

      {/* Decorative center halo */}
      <mesh>
        <sphereGeometry args={[sphereRadius * 0.9, 64, 64]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.03} wireframe />
      </mesh>
      
      {/* Background stars inside the sphere */}
      <Sparkles count={50} scale={sphereRadius * 1.5} size={2} color="#f97316" opacity={0.6} />
    </group>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-between z-10 overflow-hidden font-sans">
      
      {/* 1. Header (Draftly Oodles Style) */}
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

      {/* 2. Main Center 3D Interactive Canvas */}
      <div className="relative h-[450px] md:h-[650px] w-full flex items-center justify-center my-8 bg-black/60 rounded-3xl overflow-hidden border border-slate-800 shadow-inner">
        <Canvas gl={{ antialias: true, powerPreference: 'high-performance' }} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#f97316" />
          <Suspense fallback={null}>
            <InteractiveVideoSphere />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        </Canvas>
        
        {/* Interaction hint (bottom-center) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-[10px] text-slate-600 font-mono tracking-widest pointer-events-none group">
          <span className="block group-hover:text-orange-400 transition-colors">DRAG GLOBE • HOVER VIDEO TO PAUSE</span>
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