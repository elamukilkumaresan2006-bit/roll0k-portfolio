import React, { useRef, useMemo, useEffect, Suspense, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Your 6 Cloudinary Videos
const cloudinaryVideos = [
  'https://res.cloudinary.com/t6bizkaw/video/upload/v1785531462/lv_0_20251218152503_maob9m.mp4',
  'https://res.cloudinary.com/t6bizkaw/video/upload/v1785559047/lv_0_20241027003324_eicthg.mp4',
  'https://res.cloudinary.com/t6bizkaw/video/upload/v1785559621/lv_0_20250714140633_xhrfmy.mp4',
  'https://res.cloudinary.com/t6bizkaw/video/upload/v1785560049/lv_0_20260201113718_ls4oww.mp4',
  'https://res.cloudinary.com/t6bizkaw/video/upload/v1785560864/lv_0_20250629171052_h1hwdy.mp4',
  'https://res.cloudinary.com/t6bizkaw/video/upload/v1785561597/lv_0_20250722194326_aubhkz.mp4',
]

// 1. Dynamic Video Texture Tile on 3D Curved Mesh Surface
function VideoGlobeTile({ videoUrl, position, normal }) {
  const meshRef = useRef()
  const [videoTexture, setVideoTexture] = useState(null)

  useEffect(() => {
    const vid = document.createElement('video')
    vid.src = videoUrl
    vid.crossOrigin = 'Anonymous'
    vid.loop = true
    vid.muted = true
    vid.playsInline = true
    vid.play().catch(() => {})

    const texture = new THREE.VideoTexture(vid)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.format = THREE.RGBAFormat
    setVideoTexture(texture)

    return () => {
      vid.pause()
      vid.removeAttribute('src')
      vid.load()
    }
  }, [videoUrl])

  useEffect(() => {
    if (meshRef.current) {
      // Align tile tangentially along the sphere radius vector
      const target = position.clone().multiplyScalar(2)
      meshRef.current.lookAt(target)
    }
  }, [position])

  return (
    <mesh ref={meshRef} position={position}>
      {/* Slightly curved plane geometry */}
      <planeGeometry args={[1.2, 0.9, 16, 16]} />
      {videoTexture ? (
        <meshBasicMaterial map={videoTexture} side={THREE.DoubleSide} toneMapped={false} />
      ) : (
        <meshBasicMaterial color="#f97316" wireframe />
      )}
    </mesh>
  )
}

// 2. Coming Soon Canvas Tile with Glowing Border
function PlaceholderGlobeTile({ position, text = "COMING SOON" }) {
  const meshRef = useRef()

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 384
    const ctx = canvas.getContext('2d')

    // Dark sleek background
    ctx.fillStyle = '#090d16'
    ctx.fillRect(0, 0, 512, 384)

    // Orange border
    ctx.strokeStyle = '#f97316'
    ctx.lineWidth = 12
    ctx.strokeRect(10, 10, 492, 364)

    // Text details
    ctx.fillStyle = '#f59e0b'
    ctx.font = 'bold 28px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('[ VFX MONTAGE ]', 256, 160)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 36px sans-serif'
    ctx.fillText(text, 256, 230)

    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [text])

  useEffect(() => {
    if (meshRef.current) {
      const target = position.clone().multiplyScalar(2)
      meshRef.current.lookAt(target)
    }
  }, [position])

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[1.2, 0.9, 16, 16]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  )
}

// 3. True 3D Spherical Globe Assembly (Earth-like Rotation)
function TrueVideoGlobe() {
  const globeRef = useRef()
  const rotationPaused = useRef(false)
  const sphereRadius = 3.6
  const totalSlots = 32

  const tilesData = useMemo(() => {
    const tiles = []
    for (let i = 0; i < totalSlots; i++) {
      // Fibonacci sphere mapping for uniform distribution over sphere surface
      const phi = Math.acos(-1 + (2 * i) / totalSlots)
      const theta = Math.sqrt(totalSlots * Math.PI) * phi

      const pos = new THREE.Vector3(
        sphereRadius * Math.cos(theta) * Math.sin(phi),
        sphereRadius * Math.sin(theta) * Math.sin(phi),
        sphereRadius * Math.cos(phi)
      )

      tiles.push({
        id: i,
        position: pos,
        videoUrl: i < cloudinaryVideos.length ? cloudinaryVideos[i] : null,
      })
    }
    return tiles
  }, [sphereRadius])

  useFrame((state, delta) => {
    if (globeRef.current && !rotationPaused.current) {
      // Continuous Earth-style Y-axis rotation
      globeRef.current.rotation.y += delta * 0.25
      globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08
    }
  })

  return (
    <group
      ref={globeRef}
      onPointerOver={() => { rotationPaused.current = true }}
      onPointerOut={() => { rotationPaused.current = false }}
    >
      {/* Outer wireframe sphere outline */}
      <mesh>
        <sphereGeometry args={[sphereRadius - 0.05, 32, 32]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.08} wireframe />
      </mesh>

      {/* Render 3D mapped tiles around sphere */}
      {tilesData.map((tile) =>
        tile.videoUrl ? (
          <VideoGlobeTile key={tile.id} videoUrl={tile.videoUrl} position={tile.position} />
        ) : (
          <PlaceholderGlobeTile key={tile.id} position={tile.position} />
        )
      )}

      <Sparkles count={60} scale={sphereRadius * 1.8} size={2.5} color="#f97316" opacity={0.7} />
    </group>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-between z-10 font-sans">
      {/* Title section */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span className="text-xs font-mono font-medium text-orange-400 uppercase tracking-widest">
            ROLL0K • ARTISTIC VIDEO CREATIVE
          </span>
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          CINEMATIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500">VISUALS</span> & EDITING
        </h1>

        <p className="text-sm md:text-base text-slate-400 font-light max-w-xl mx-auto">
          Elevating digital stories through high-octane editing, custom visual effects, and dynamic montage pacing.
        </p>
      </div>

      {/* 3D WebGL Canvas for Sphere Globe */}
      <div className="relative h-[480px] md:h-[620px] w-full flex items-center justify-center bg-black/80 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl my-2">
        <Canvas gl={{ antialias: true, powerPreference: 'high-performance' }} dpr={[1, 1.5]}>
          <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={55} />
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#f97316" />

          <Suspense fallback={null}>
            <TrueVideoGlobe />
          </Suspense>

          <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        </Canvas>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-[10px] text-slate-500 font-mono tracking-widest pointer-events-none">
          DRAG TO ROTATE GLOBE • HOVER TO PAUSE
        </div>
      </div>

      {/* Footer bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60 mt-2">
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