import { motion } from 'framer-motion'

const STEPS = [
  { time: '00:00', title: 'Started Editing', desc: 'First cuts, first curiosity — learning what a good transition feels like.' },
  { time: '00:01', title: 'Social Media Content', desc: 'Editing for reels and everyday moments, building speed and instinct.' },
  { time: '00:02', title: 'Cinematic Projects', desc: 'Moving into travel edits and story-driven pieces with real intent.' },
  { time: '00:03', title: 'Learning Professional Tools', desc: 'Picking up DaVinci Resolve to sharpen color and finishing.' },
  { time: '∞', title: 'Future Goal', desc: 'Professional Creative Video Editor.', highlight: true },
]

export default function Journey() {
  return (
    <section id="journey" className="relative py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="slate-label mb-6"
        >
          SCENE <span>04</span> — TIMELINE
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-5xl font-bold mb-20 max-w-2xl"
        >
          The <span className="grad-text italic">edit history</span> of my craft.
        </motion.h2>

        <div className="relative pl-8 md:pl-0">
          {/* the track — literally a timeline scrubber */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2" />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top' }}
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue via-purple to-purple-soft md:-translate-x-1/2"
          />

          <div className="space-y-16 md:space-y-0">
            {STEPS.map((s, i) => (
              <div
                key={s.time}
                className={`md:grid md:grid-cols-2 md:gap-16 md:py-10 relative ${
                  i % 2 === 0 ? '' : ''
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7 }}
                  className={`relative ${i % 2 === 0 ? 'md:col-start-1 md:text-right' : 'md:col-start-2'}`}
                >
                  <div
                    className={`absolute top-1 -left-8 md:left-auto w-3 h-3 rounded-full ${
                      s.highlight ? 'bg-purple-soft shadow-[0_0_20px_rgba(155,107,255,0.9)]' : 'bg-blue-soft'
                    } ${i % 2 === 0 ? 'md:-right-[4.55rem]' : 'md:-left-[4.55rem]'}`}
                  />
                  <span className="timecode text-xs text-mist">{s.time}</span>
                  <h3 className={`font-display text-2xl font-semibold mt-2 mb-2 ${s.highlight ? 'grad-text' : ''}`}>
                    {s.title}
                  </h3>
                  <p className="text-mist text-sm leading-relaxed max-w-sm md:ml-auto">
                    {i % 2 === 0 ? <span className="block md:ml-auto">{s.desc}</span> : s.desc}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
