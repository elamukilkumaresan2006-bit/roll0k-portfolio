import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlay } from 'react-icons/fi'
import { projects } from '../data/projects'
import ProjectModal from '../components/ProjectModal'

export default function Projects() {
  const [active, setActive] = useState(null)

  return (
    <section id="projects" className="relative py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="slate-label mb-6"
        >
          SCENE <span>05</span> — SELECTED WORK
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-5xl font-bold mb-16 max-w-2xl"
        >
          Six cuts. <span className="grad-text italic">One reel.</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.button
              key={p.id}
              onClick={() => setActive(p)}
              data-cursor="pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.1 }}
              whileHover="hover"
              className="group text-left relative rounded-2xl overflow-hidden glass"
            >
              <div className="relative aspect-video overflow-hidden">
                {p.thumbnailURL ? (
                  <motion.img
                    variants={{ hover: { scale: 1.08 } }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    src={p.thumbnailURL}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <motion.div
                    variants={{ hover: { scale: 1.08 } }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full bg-[linear-gradient(150deg,rgba(61,107,255,0.16),rgba(155,107,255,0.1))] flex items-center justify-center"
                  >
                    <span className="timecode text-xs text-white/40">THUMBNAIL · {p.code}</span>
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />

                <motion.div
                  variants={{ hover: { scale: 1, opacity: 1 } }}
                  initial={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/10 border border-white/30 backdrop-blur-md flex items-center justify-center">
                    <FiPlay className="text-xl translate-x-0.5" />
                  </div>
                </motion.div>

                <div className="absolute top-4 left-4 timecode text-[11px] text-white/70">{p.code}</div>
                <div className="absolute top-4 right-4 timecode text-[10px] px-2.5 py-1 rounded-full border border-white/20 text-white/70">
                  {p.category}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display text-xl font-semibold mb-1">{p.title}</h3>
                <p className="text-mist text-sm">{p.software}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  )
}
