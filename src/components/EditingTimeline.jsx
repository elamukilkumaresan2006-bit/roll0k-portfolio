import { motion } from 'framer-motion'

const VIDEO_TRACKS = ['V1', 'V2', 'V3']
const AUDIO_TRACKS = ['A1', 'A2']

// Deterministic pseudo-random clip widths so the timeline looks populated
// without being generated differently on every render.
const CLIP_SEEDS = [22, 40, 15, 30, 18, 34, 12, 26]

function clipWidth(i) {
  return `${CLIP_SEEDS[i % CLIP_SEEDS.length]}%`
}

export default function EditingTimeline({ active }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 16 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-[min(90vw,760px)] select-none"
    >
      {/* timecode ruler */}
      <div className="flex justify-between timecode text-[10px] text-white/30 mb-2 px-1">
        {['00:00:00:00', '00:00:02:00', '00:00:04:00', '00:00:06:00', '00:00:08:00'].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="h-px bg-white/10 mb-3" />

      <div className="space-y-2">
        {VIDEO_TRACKS.map((track, ti) => (
          <TrackRow key={track} label={track} delay={ti * 0.08} type="video" />
        ))}
        <div className="h-2" />
        {AUDIO_TRACKS.map((track, ti) => (
          <TrackRow key={track} label={track} delay={0.3 + ti * 0.08} type="audio" />
        ))}
      </div>
    </motion.div>
  )
}

function TrackRow({ label, delay, type }) {
  return (
    <div className="flex items-center gap-3">
      <span className="timecode text-[10px] text-white/35 w-6 shrink-0">{label}</span>
      <div className="relative flex-1 h-6 rounded bg-white/[0.03] border border-white/[0.06] overflow-hidden flex items-center gap-1 px-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: clipWidth(i + (type === 'audio' ? 4 : 0)), transformOrigin: 'left' }}
            className={`h-4 rounded-sm ${
              type === 'video'
                ? 'bg-gradient-to-r from-blue/40 to-purple/30 border border-blue-soft/30'
                : 'bg-gradient-to-r from-purple/30 to-blue/20 border border-purple-soft/20'
            }`}
          >
            {type === 'audio' && <Waveform />}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Waveform() {
  const bars = [3, 6, 4, 8, 5, 7, 3, 6, 4, 8, 5, 3]
  return (
    <div className="w-full h-full flex items-center gap-[2px] px-1 opacity-70">
      {bars.map((h, i) => (
        <span key={i} className="w-[2px] bg-white/50 rounded-full" style={{ height: `${h}px` }} />
      ))}
    </div>
  )
}