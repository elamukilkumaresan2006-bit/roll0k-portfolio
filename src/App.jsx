import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, MeshWobbleMaterial, Stars } from '@react-three/drei'

// Original UI components & sections
import IntroAnimation from './components/IntroAnimation'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Journey from './sections/Journey'
import Projects from './sections/Projects'
import Contact from './sections/Contact'

// 3D Canvas Hero Shape Component
function HeroShape() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3
      meshRef.current.rotation.y += delta * 0.4
    }
  })

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
  )
}

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* 3D WebGL Background Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          gl={{ powerPreference: 'high-performance', antialias: true }}
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

      {/* Atmospheric overlays */}
      <div className="light-leaks" />
      <div className="dust" />
      <div className="grain" />

      {/* Interactive Cursor */}
      <CustomCursor />

      {/* Intro Loader */}
      <IntroAnimation onComplete={() => setIntroDone(true)} />

      {/* Main Portfolio Sections */}
      <div
        className="relative z-10"
        style={{
          opacity: introDone ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
      >
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Journey />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}