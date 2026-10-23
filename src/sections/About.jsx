import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import CinematicMontage from '../components/CinematicMontage'
import { montageClips } from '../data/montage'

const COUNTERS = [
  { value: 25, suffix: '+', label: 'Projects Completed' },
  { value: 500, suffix: '+', label: 'Hours Edited' },
  { value: 2, suffix: '+', label: 'Years Learning' },
]

function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = null
    const duration = 1400
    let frame

    const step = (timestamp) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * value))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [inView, value])

  return (
    <span ref={ref} className="font-display text-5xl md:text-6xl font-extrabold grad-text">
      {display}
      {suffix}
    </span>
  )
}
export default function About() {
  return (
    <section id="about" className="relative py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-16 items-start">
          {/* Cinematic looping montage — replaces the old portrait placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <CinematicMontage clips={montageClips} />
          </motion.div>

          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="slate-label mb-6"
            >
              SCENE <span>02</span> — ABOUT
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display text-4xl md:text-5xl font-bold leading-tight mb-8"
            >
              Ordinary Clips.
              <br />
              <span className="grad-text italic">Extraordinary Stories.</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="space-y-5 text-fog text-lg leading-relaxed max-w-xl"
            >
              <p>
                I'm Elamukil Kumaresan, a creative video editor who turns everyday
                footage into cinematic memory. Working primarily in CapCut, I craft
                cinematic edits, travel films, friendship reels, and social content
                that people don't just watch — they feel.
              </p>
              <p>
                I'm currently deepening my craft with DaVinci Resolve, and I'm a
                third-year Electronics &amp; Communication Engineering student at
                SRM Institute of Science and Technology — proof that precision and
                creativity aren't opposites.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Animated stat counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-3 gap-6 md:gap-10 mt-24 pt-16 border-t border-white/10"
        >
          {COUNTERS.map((c) => (
            <div key={c.label} className="text-center md:text-left">
              <Counter value={c.value} suffix={c.suffix} />
              <p className="slate-label mt-3 !text-[11px]">{c.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Featured quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative glass rounded-3xl px-8 py-12 md:px-16 md:py-16 mt-14 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,10,96,0.42),transparent_65%)] pointer-events-none" />
          <p className="relative font-display italic text-2xl md:text-4xl leading-snug max-w-3xl mx-auto">
            "The best edit is the one people{' '}
            <span className="grad-text">feel</span>, not notice."
          </p>
        </motion.div>
      </div>
    </section>
  )
}