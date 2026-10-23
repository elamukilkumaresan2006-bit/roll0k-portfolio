import { useRef } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'
import MagneticButton from '../components/MagneticButton'

// Add / remove tools here — they orbit automatically
const TOOLS = [
  { short: 'Cc', name: 'CapCut', note: 'Advanced' },
  { short: 'Dr', name: 'DaVinci Resolve', note: 'Learning' },
  { short: 'Cg', name: 'Color Grading' },
  { short: 'Tr', name: 'Transitions' },
  { short: 'Fx', name: 'Motion FX' },
  { short: 'Sn', name: 'Sound Sync' },
  { short: 'A54', name: 'Galaxy A54', note: 'Camera' },
  { short: 'St', name: 'Storytelling' },
]

export default function Tools() {
  const stage = useRef(null)
  const els = useRef([])

  // Orbit: each tool circles the centre; the ones "behind" get smaller and fainter
  useAnimationFrame((t) => {
    const s = stage.current
    if (!s) return
    const rx = s.clientWidth * 0.4
    const ry = s.clientHeight * 0.2
    TOOLS.forEach((_, i) => {
      const el = els.current[i]
      if (!el) return
      const a = (t / 1000) * 0.28 + (i * Math.PI * 2) / TOOLS.length
      const depth = (Math.sin(a) + 1) / 2
      const x = Math.cos(a) * rx
      const y = Math.sin(a) * ry + Math.sin(t / 800 + i * 1.7) * 9
      el.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0) scale(${0.62 + depth * 0.5})`
      el.style.opacity = 0.35 + depth * 0.65
      el.style.zIndex = Math.round(depth * 10)
    })
  })

  return (
    <section id="tools" className="relative py-28 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
        <p className="slate-label mb-6">
          SCENE <span>02</span> — TOOLKIT
        </p>
        <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
          The <span className="grad-text italic">Creative Universe</span>
        </h2>
        <p className="mt-5 text-fog max-w-xl mx-auto">
          The tools the roll0k editing team works with — and a team that&apos;s still growing.
        </p>
      </div>

      <div ref={stage} className="relative mx-auto mt-10 w-full max-w-[1000px] h-[460px] md:h-[560px]">
        {/* glowing swirls */}
        <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full" fill="none">
          <defs>
            <linearGradient id="swirl" x1="0" x2="1">
              <stop offset="0" stopColor="#3B0A60" stopOpacity="0" />
              <stop offset="0.5" stopColor="#00E5FF" />
              <stop offset="1" stopColor="#00E5FF" stopOpacity="0" />
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="5" /></filter>
          </defs>
          {[{ rot: -16, dir: 1, ry: 120 }, { rot: 14, dir: -1, ry: 90 }].map((o, i) => (
            <motion.g
              key={i}
              style={{ transformOrigin: '500px 250px' }}
              initial={{ rotate: o.rot }}
              animate={{ rotate: o.rot + 360 * o.dir }}
              transition={{ duration: 40 + i * 15, repeat: Infinity, ease: 'linear' }}
            >
              <ellipse cx="500" cy="250" rx="430" ry={o.ry} stroke="url(#swirl)" strokeWidth="3" strokeDasharray="700 500" filter="url(#glow)" />
              <ellipse cx="500" cy="250" rx="430" ry={o.ry} stroke="url(#swirl)" strokeWidth="1.5" strokeDasharray="700 500" />
            </motion.g>
          ))}
        </svg>

        {/* centre orb */}
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center bg-[radial-gradient(circle,rgba(59,10,96,1),rgba(0,229,255,0.15)_60%,transparent_72%)] shadow-[0_0_90px_rgba(0,229,255,0.45)]"
        >
          <span className="font-display text-2xl md:text-3xl font-extrabold grad-text">
            roll<span className="font-mono">0</span>k
          </span>
        </motion.div>

        {/* orbiting tools */}
        {TOOLS.map((t, i) => (
          <div
            key={t.name}
            ref={(el) => (els.current[i] = el)}
            className="absolute left-1/2 top-1/2 will-change-transform"
          >
            <div className="glass rounded-2xl w-[84px] md:w-[104px] py-4 flex flex-col items-center gap-1.5 shadow-[0_18px_40px_-12px_rgba(0,229,255,0.5)]">
              <span className="font-display text-xl md:text-2xl font-extrabold text-paper">{t.short}</span>
              <span className="timecode text-[8px] md:text-[9px] text-fog text-center leading-tight px-1">{t.name}</span>
              {t.note && <span className="timecode text-[8px] text-blue-soft">{t.note}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <MagneticButton as="a" href="#contact" className="btn-ghost">
          Join the roll0k team
        </MagneticButton>
      </div>
    </section>
  )
}
