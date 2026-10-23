import { useState, useRef, useEffect } from 'react'
import { useInView } from 'framer-motion'
import { FiPlay } from 'react-icons/fi'

/**
 * Loops through a list of video clips forever, one after another,
 * with a smooth fade between each. Falls back to a premium placeholder
 * when no clips are provided. Videos are lazy-mounted (only start
 * loading once scrolled into view) to keep performance snappy.
 */
export default function CinematicMontage({ clips = [], className = '' }) {
  const wrapperRef = useRef(null)
  const inView = useInView(wrapperRef, { once: true, margin: '-100px' })

  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const videoRef = useRef(null)
  const hasClips = clips.length > 0

  const handleEnded = () => {
    setVisible(false)
    setTimeout(() => {
      setIndex((i) => (i + 1) % clips.length)
      setVisible(true)
    }, 450)
  }

  useEffect(() => {
    if (videoRef.current && inView) {
      videoRef.current.play().catch(() => {})
    }
  }, [index, inView])

  return (
    <div
      ref={wrapperRef}
      className={`group relative aspect-[4/5] rounded-2xl overflow-hidden glass shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] ${className}`}
    >
      {hasClips && inView ? (
        <video
          ref={videoRef}
          key={index}
          src={clips[index]}
          muted
          autoPlay
          playsInline
          preload="metadata"
          onEnded={handleEnded}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(150deg,rgba(0,229,255,0.15),rgba(59,10,96,0.3))]">
          <div className="text-center px-6">
            <span className="slate-label block mb-2">MONTAGE REEL</span>
            <span className="timecode text-xs text-white/40">
              Add clips in src/data/montage.js
            </span>
          </div>
        </div>
      )}

      {/* film-slate overlays */}
      <div className="absolute top-4 left-4 timecode text-xs text-white/70 pointer-events-none">
        00:00:12:04
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs timecode text-white/50 pointer-events-none">
        <span>ELAMUKIL_K</span>
        <span>ROLL0K.MOV</span>
      </div>

      {/* hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-void/45 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="flex items-center gap-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <span className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center">
            <FiPlay className="text-sm translate-x-0.5" />
          </span>
          <span className="slate-label !text-[11px]">WATCH SHOWREEL</span>
        </div>
      </div>
    </div>
  )
}