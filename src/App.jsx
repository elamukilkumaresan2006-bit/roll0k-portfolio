import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

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

// PERFORMANCE & THEME OPTIMIZED: The Cinematic Glow Aura
// This component replaces complex 3D shapes for better performance.
// It creates an energy focal point using lightweight lights and sparkles.
function CinematicAura() {
  const meshRef = useRef()

  // Define dynamic colors directly for useMemo compatibility
  const colors = useMemo(() => ({
    glowColor: new THREE.Color('#f97316'), // Electric Orange
    amberColor: new THREE.Color('#f59e0b')  // Amber Yellow
  }), [])

  useFrame((state) => {
    // Subtle, optimized rotation for general movement
    if (meshRef.current) {