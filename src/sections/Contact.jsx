import { motion } from 'framer-motion'
import { FiInstagram, FiMail, FiPhone, FiDownload, FiArrowUpRight } from 'react-icons/fi'
import MagneticButton from '../components/MagneticButton'

const CHANNELS = [
  { icon: FiInstagram, label: 'Instagram', value: '@roll0k', href: 'https://instagram.com/roll0k' },
  { icon: FiMail, label: 'Email', value: 'elamukilkumaresan2006@gmail.com', href: 'mailto:elamukilkumaresan2006@gmail.com' },
  { icon: FiPhone, label: 'Phone', value: '+91 97894 54556', href: 'tel:+919789454556' },
]

export default function Contact() {
  return (
    <section id="contact" className="relative py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="slate-label mb-6"
        >
          SCENE <span>06</span> — CONTACT
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-6xl font-bold mb-16 max-w-3xl leading-[1.05]"
        >
          Let's cut something <span className="grad-text italic">worth watching.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-8 md:p-12 grid md:grid-cols-[1.2fr_0.8fr] gap-12"
        >
          <div className="space-y-6">
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="pointer"
                className="group flex items-center justify-between border-b border-white/10 pb-5 hover:border-blue-soft/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <c.icon className="text-xl text-blue-soft" />
                  <div>
                    <p className="slate-label !text-[10px] mb-1">{c.label}</p>
                    <p className="font-display text-lg md:text-xl">{c.value}</p>
                  </div>
                </div>
                <FiArrowUpRight className="text-xl text-mist group-hover:text-paper group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </a>
            ))}
          </div>

          <div className="flex flex-col justify-between">
            <p className="text-mist leading-relaxed">
              Available for cinematic edits, travel content, reels, and
              story-driven projects. Based in Kattankulathur, working with
              creators anywhere.
            </p>
            <MagneticButton
              as="a"
              href="/resume.pdf"
              download
              className="btn-primary mt-8 w-full md:w-auto justify-center gap-2"
            >
              <FiDownload /> Download Resume
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
