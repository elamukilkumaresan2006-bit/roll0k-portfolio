import { motion } from 'framer-motion'
import {
  FiFilm, FiEdit3, FiShuffle, FiZap, FiMusic, FiDroplet, FiTrendingUp,
} from 'react-icons/fi'

const SKILLS = [
  { icon: FiFilm, name: 'CapCut', level: 'Primary Tool', desc: 'End-to-end editing across every project type.' },
  { icon: FiEdit3, name: 'Creative Storytelling', level: 'Core Craft', desc: 'Structuring footage into a narrative that lands.' },
  { icon: FiShuffle, name: 'Transitions', level: 'Signature Style', desc: 'Seamless, beat-matched, and never distracting.' },
  { icon: FiZap, name: 'Motion Effects', level: 'Advanced', desc: 'Kinetic type, punch-ins, and dynamic pacing.' },
  { icon: FiMusic, name: 'Sound Synchronization', level: 'Advanced', desc: 'Cutting to rhythm so every beat has a reason.' },
  { icon: FiDroplet, name: 'Color Grading', level: 'Advanced', desc: 'Mood-first grades that unify a whole edit.' },
  { icon: FiTrendingUp, name: 'DaVinci Resolve', level: 'Learning', desc: 'Building a professional finishing workflow.' },
]

export default function Skills() {
  return (
    <section id="skills" className="relative py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="slate-label mb-6"
        >
          SCENE <span>03</span> — TOOLKIT
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-5xl font-bold mb-16 max-w-2xl"
        >
          The <span className="grad-text italic">instruments</span> behind every cut.
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILLS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-7 group cursor-default relative overflow-hidden"
              data-cursor="pointer"
            >
              <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-gradient-to-br from-blue/25 to-purple/25 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <s.icon className="text-3xl text-blue-soft mb-6 relative" />
              <h3 className="font-display text-xl font-semibold mb-1 relative">{s.name}</h3>
              <p className="timecode text-[11px] text-purple-soft mb-3 relative">{s.level}</p>
              <p className="text-mist text-sm leading-relaxed relative">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
