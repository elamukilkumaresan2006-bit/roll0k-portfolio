import { motion } from 'framer-motion'
import MagneticButton from '../components/MagneticButton'

// Drop a Cloudinary showreel URL here later — this element is ready for it.
const SHOWREEL_URL = ''

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background layer — swap for <video> showreel when ready */}
      <div className="absolute inset-0 -z-10">
        {SHOWREEL_URL ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-40"
            src={SHOWREEL_URL}
          />
        ) : (
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(61,107,255,0.16),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(155,107,255,0.14),transparent_50%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/10" />
      </div>

      {/* ambient floating orbs for depth / parallax */}
      <motion.div
        className="absolute top-1/4 left-[8%] w-72 h-72 rounded-full bg-blue/20 blur-[100px] -z-10"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-[10%] w-96 h-96 rounded-full bg-purple/20 blur-[120px] -z-10"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 pb-28 pt-40">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="slate-label mb-6"
        >
          SCENE <span>01</span> — SHOWREEL
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-extrabold leading-[0.95] text-[13vw] md:text-[7.5vw] tracking-tight"
        >
          Every Frame
          <br />
          <span className="grad-text italic">Tells a Story.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 max-w-lg text-fog text-lg leading-relaxed"
        >
          Elamukil Kumaresan — creative video editor turning ordinary footage
          into cinematic memory, one cut at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-12 flex flex-wrap items-center gap-4"
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

      <ScrollIndicator />
    </section>
  )
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1 }}
      className="absolute bottom-8 right-6 md:right-10 flex flex-col items-center gap-3"
    >
      <span className="slate-label rotate-0">SCROLL</span>
      <motion.div
        className="w-px h-14 bg-gradient-to-b from-white/60 to-transparent overflow-hidden"
      >
        <motion.div
          className="w-px h-4 bg-blue-soft"
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  )
}
