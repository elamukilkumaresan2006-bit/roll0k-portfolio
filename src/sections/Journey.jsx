import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'
import ProjectModal from '../components/ProjectModal'

// Order + dates (taken from the dates in your video file names) — edit freely
const ORDER = [
  { id: 2, when: 'OCT 2024' },
  { id: 5, when: 'JUN 2025' },
  { id: 3, when: 'JUL 2025' },
  { id: 6, when: 'JUL 2025' },
  { id: 1, when: 'DEC 2025' },
  { id: 4, when: 'FEB 2026' },
]

const small = (url) => url.replace('/upload/', '/upload/w_360,q_auto/')
// point on the curved path at position t (0..1)
const pt = (t) => ({
  x: (1 - t) ** 2 * 60 + 2 * (1 - t) * t * 500 + t * t * 940,
  y: (1 - t) ** 2 * 190 + 2 * (1 - t) * t * -70 + t * t * 190,
})

export default function Journey() {
  const items = useMemo(
    () => ORDER.map((o) => ({ ...o, p: projects.find((p) => p.id === o.id) })).filter((o) => o.p),
    []
  )
  const n = items.length
  const [i, setI] = useState(0)
  const [hold, setHold] = useState(false)
  const [open, setOpen] = useState(null)

  // auto-advance the glowing marker along the timeline
  useEffect(() => {
    if (hold || n < 2) return
    const id = setInterval(() => setI((v) => (v + 1) % n), 2800)
    return () => clearInterval(id)
  }, [hold, n])

  if (!n) return null
  const cur = items[i]
  const m = pt(n > 1 ? i / (n - 1) : 0)
  const mid = (n - 1) / 2

  return (
    <section id="journey" className="relative py-28 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <p className="slate-label mb-6">
          SCENE <span>04</span> — TIMELINE
        </p>
        <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight max-w-2xl">
          A Journey <span className="grad-text italic">Through Time</span>
        </h2>

        {/* glowing curved timeline */}
        <div className="relative mt-10 hidden md:block">
          <svg viewBox="0 0 1000 220" className="w-full" fill="none">
            <defs>
              <linearGradient id="arc" x1="0" x2="1">
                <stop offset="0" stopColor="#3B0A60" stopOpacity="0.2" />
                <stop offset="0.5" stopColor="#00E5FF" />
                <stop offset="1" stopColor="#00E5FF" stopOpacity="0.2" />
              </linearGradient>
              <filter id="g2"><feGaussianBlur stdDeviation="6" /></filter>
            </defs>
            <motion.path
              d="M60 190 Q500 -70 940 190"
              stroke="url(#arc)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            />
            {items.map((it, k) => {
              const p = pt(n > 1 ? k / (n - 1) : 0)
              return (
                <g key={k}>
                  <circle cx={p.x} cy={p.y} r="3" fill={k === i ? '#fff' : '#00E5FF'} />
                  <text x={p.x} y={p.y - 16} textAnchor="middle" fontSize="13" fontFamily="monospace" letterSpacing="2" fill={k === i ? '#fff' : '#8a8b96'}>
                    {it.when}
                  </text>
                </g>
              )
            })}
            <motion.circle animate={{ cx: m.x, cy: m.y }} transition={{ duration: 0.9, ease: 'easeInOut' }} r="16" fill="#00E5FF" filter="url(#g2)" />
            <motion.circle animate={{ cx: m.x, cy: m.y }} transition={{ duration: 0.9, ease: 'easeInOut' }} r="6" fill="#fff" />
          </svg>
        </div>

        {/* curved strip of your videos */}
        <div
          className="mt-8 flex gap-3 md:gap-2 justify-start md:justify-center overflow-x-auto md:overflow-visible snap-x pb-4 md:[perspective:1400px]"
          onMouseLeave={() => setHold(false)}
        >
          {items.map((it, k) => {
            const on = k === i
            return (
              <button
                key={k}
                onMouseEnter={() => { setI(k); setHold(true) }}
                onClick={() => setOpen(it.p)}
                data-cursor="pointer"
                style={{ '--ry': `${(mid - k) * 10}deg`, '--ty': `${Math.abs(k - mid) ** 2 * 7}px` }}
                className={`relative shrink-0 snap-center w-40 md:w-auto md:flex-1 md:max-w-[190px] aspect-[3/4] rounded-2xl overflow-hidden border transition-all duration-500 md:[transform:rotateY(var(--ry))_translateY(var(--ty))] ${
                  on
                    ? 'border-blue-soft/70 scale-105 brightness-110 shadow-[0_20px_60px_-10px_rgba(0,229,255,0.6)]'
                    : 'border-white/10 brightness-[0.6]'
                }`}
              >
                {on && it.p.videoURL ? (
                  <video src={small(it.p.videoURL)} poster={it.p.thumbnailURL} muted loop autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                  <img src={it.p.thumbnailURL} alt={it.p.title} loading="lazy" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 timecode text-[10px] text-white/80">{it.when}</span>
              </button>
            )
          })}
        </div>

        {/* details for the selected moment */}
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 max-w-xl">
          <span className="timecode text-xs text-blue-soft">
            {cur.when} · {cur.p.category}
          </span>
          <h3 className="font-display text-2xl font-semibold mt-2 mb-2">{cur.p.title}</h3>
          <p className="text-mist text-sm leading-relaxed">{cur.p.description}</p>
        </motion.div>
      </div>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  )
}