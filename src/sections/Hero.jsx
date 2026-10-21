import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import MagneticButton from '../components/MagneticButton'

// Loaded on demand so the 3D library doesn't slow down the first paint
const GlobeShowcase = lazy(() => import('../components/GlobeShowcase'))

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* ambient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(61,107,255,0.16),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(155,107,255,0.14),transparent_50%)]" />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 pt-32 pb-24 grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-6 items-center">
        {/* Text side */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="slate-label mb-6"
          >
            SCENE <span>01</span> — SHOWREEL
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold leading-[0.95] text-[14vw] sm:text-7xl lg:text-[5.6vw] tracking-tight"
          >
            Every Frame
            <br />
            <span className="grad-text italic">Tells a Story.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 max-w-md text-fog text-lg leading-relaxed"
          >
            Elamukil Kumaresan — creative video editor turning ordinary footage
            into cinematic memory, one cut at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton as="a" href="#projects" className="btn-primary">
              View Projects
            </MagneticButton>
            <MagneticButton as="a" href="/resume/Elamukil_Kumaresan_Resume.pdf" download className="btn-ghost">
              Download Resume
            </MagneticButton>
            <MagneticButton as="a" href="#contact" className="btn-ghost">
              Contact Me
            </MagneticButton>
          </motion.div>
        </div>

        {/* Globe side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Suspense fallback={<div className="w-full aspect-square max-w-[620px] mx-auto" />}>
            <GlobeShowcase />
          </Suspense>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="slate-label">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </section>
  )
}