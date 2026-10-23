import { AnimatePresence, motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { useEffect } from 'react'

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-void/95 backdrop-blur-xl p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            onClick={onClose}
            data-cursor="pointer"
            className="absolute top-6 right-6 md:top-10 md:right-10 w-11 h-11 rounded-full glass flex items-center justify-center hover:border-blue-soft transition-colors z-10"
          >
            <FiX className="text-lg" />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl"
          >
            <div className="slate-label mb-4">
              PROJECT <span>{project.code}</span>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden glass mb-8">
              {project.videoURL ? (
                <video
                  src={project.videoURL}
                  poster={project.thumbnailURL || undefined}
                  controls
                  autoPlay
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[linear-gradient(150deg,rgba(0,229,255,0.18),rgba(59,10,96,0.36))]">
                  <span className="timecode text-sm text-white/60">
                    CLOUDINARY VIDEO PLACEHOLDER — {project.code}
                  </span>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
              <div>
                <h3 className="font-display text-3xl font-bold mb-3">{project.title}</h3>
                <p className="text-fog leading-relaxed max-w-2xl">{project.description}</p>
              </div>
              <div className="flex md:flex-col gap-3 md:text-right shrink-0">
                <span className="timecode text-xs px-3 py-1.5 rounded-full border border-white/15 text-mist">
                  {project.category}
                </span>
                <span className="timecode text-xs px-3 py-1.5 rounded-full border border-white/15 text-mist">
                  {project.software}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
