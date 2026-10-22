import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// UI components & sections
import Tools from './sections/Tools'
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

// Performance & Theme Light Aura
function CinematicAura() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={meshRef} position={[0, -0.5, 0]}>
      {/* Dynamic Point Lights */}
      <pointLight 
        position={[0, 1, 2]} 
        intensity={2.5} 
        color="#f97316" 
        distance={20} 
        decay={2}
      />
      <pointLight 
        position={[2, -1, 1]} 
        intensity={1.5} 
        color="#f59e0b" 
        distance={15} 
        decay={2}
      />

      {/* Sparkles & Stars */}
      <Sparkles 
        count={70}
        scale={8}
        size={3}
        speed={0.3}
        color="#f59e0b"
        opacity={0.7}
      />
      <Stars 
        radius={80} 
        depth={60} 
        count={2500} 
        factor={6} 
        saturation={1} 
        fade 
        speed={1.2} 
      />
    </group>
  )
}

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const themeVars = useMemo(() => ({
    '--background': '#020617',
    '--primary-color': '#f97316',
    '--secondary-color': '#f59e0b',
    '--accent-color': '#ef4444',
    '--text-main': '#ffffff',
    '--text-muted': '#94a3b8',
    '--nav-bg': '#020617ee',
  }), [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      <style>{`
        :root {
          ${Object.entries(themeVars).map(([key, value]) => `${key}:${value};`).join('\n')}
        }
        
        body {
          background-color: var(--background) !important;
          color: var(--text-main) !important;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow-x: hidden;
        }

        .text-primary { color: var(--primary-color) !important; }
        .text-secondary { color: var(--secondary-color) !important; }
        .text-accent { color: var(--accent-color) !important; }
        .text-muted { color: var(--text-muted) !important; }
        .bg-background { background-color: var(--background) !important; }
        
        .light-leaks {
          background: radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(2, 6, 23, 0.9) 70%) !important;
        }
        .dust, .grain { opacity: 0.1; }
      `}</style>

      {/* 3D WebGL Background Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundColor: themeVars['--background'] }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ powerPreference: 'high-performance', antialias: true }}
          dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)}
        >
          <ambientLight intensity={0.1} />
          <Suspense fallback={null}>
            <CinematicAura />
          </Suspense>
        </Canvas>
      </div>

      {/* Atmospheric Overlays */}
      <div className="light-leaks" />
      <div className="dust" />
      <div className="grain" />

      {/* Interactive UI components */}
      <CustomCursor />

      {/* Intro Animation */}
      <IntroAnimation onComplete={() => setIntroDone(true)} />

      {/* Main Portfolio Content */}
      <div
        className="relative z-10"
        style={{
          opacity: introDone ? 1 : 0,
          transition: 'opacity 1s ease-out',
          visibility: introDone ? 'visible' : 'hidden',
        }}
      >
        <Navbar />
        <main>
          <Hero />
          <Tools />
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