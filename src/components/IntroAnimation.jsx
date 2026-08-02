import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { introFlashes } from '../data/introFlashes'
import { introClickSound, introSwipeSound } from '../data/introSound'

// Scene durations (ms). Flash duration is data-driven so every image is
// shown exactly once — no repeats — then we move straight on.
const BLACK_DURATION = 300
const LOGO_DURATION = 900
const FLASH_INTERVAL = 110 // ~2.5x faster than the previous 230ms
const TAGLINE_DURATION = 900

const flashCount = introFlashes.length
const flashDuration = flashCount * FLASH_INTERVAL

const T = {
  logo: BLACK_DURATION,
  flash: BLACK_DURATION + LOGO_DURATION,
  tagline: BLACK_DURATION + LOGO_DURATION + flashDuration,
  end: BLACK_DURATION + LOGO_DURATION + flashDuration + TAGLINE_DURATION,
}

export default function IntroAnimation({ onComplete }) {
  const [step, setStep] = useState('black')
  const [flashIndex, setFlashIndex] = useState(0)
  const clickSoundRef = useRef(null)
  const swipeSoundRef = useRef(null)

  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Main scene scheduler — runs exactly once per mount.
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep('logo'), T.logo),
      setTimeout(() => setStep('flash'), T.flash),
      setTimeout(() => setStep('tagline'), T.tagline),
      setTimeout(() => setStep('done'), T.end),
      setTimeout(() => onCompleteRef.current?.(), T.end),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // Flash-cycle scheduler — shows each image exactly once, no repeats.
  useEffect(() => {
    if (step !== 'flash' || flashCount <= 1) return
    setFlashIndex(0)
    const timers = []
    for (let i = 1; i < flashCount; i++) {
      timers.push(setTimeout(() => setFlashIndex(i), i * FLASH_INTERVAL))
    }
    return () => timers.forEach(clearTimeout)
  }, [step])

  // Sound layers — both tied to the flash scene starting.
  // Layer 1 plays immediately; layer 2 starts 1s later, skipping its own
  // first second of audio. Browsers block autoplay-with-sound without a
  // prior user click, so this may silently fail — the intro still works
  // fine either way.
  useEffect(() => {
    if (step !== 'flash') return

   const t1 = setTimeout(() => {
     if (introClickSound && clickSoundRef.current) {
       clickSoundRef.current.currentTime = 0
       clickSoundRef.current.play().catch(() => {})
     }
   }, 0)

   const t2 = setTimeout(() => {
     if (introSwipeSound && swipeSoundRef.current) {
       swipeSoundRef.current.currentTime = 1 // skip the first second of this clip
       swipeSoundRef.current.play().catch(() => {})
     }
   }, 1000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [step])

  return (
    <AnimatePresence>
      {step !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-void overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
        >
          {introClickSound && <audio ref={clickSoundRef} src={`/intro/${introClickSound}`} preload="auto" />}
   {introSwipeSound && <audio ref={swipeSoundRef} src={`/intro/${introSwipeSound}`} preload="auto" />}

          {/* ambient cinematic layer: grain + vignette + soft leak */}
          <div className="intro-grain" />
          <div className="intro-vignette" />
          <div className="intro-leak" />

          {/* Scene 1: roll0k alone, center frame, line sweeping left to right */}
          <AnimatePresence>
            {step === 'logo' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.35 } }}
                className="relative flex flex-col items-center gap-5"
              >
                <span className="font-display text-6xl md:text-8xl font-extrabold grad-text tracking-tight">
                  <Roll0kMark />
                </span>
                <div className="line-grow w-40 md:w-56" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scene 2: fast flashes shrinking into the center, one after another */}
          <AnimatePresence mode="popLayout">
            {step === 'flash' && introFlashes[flashIndex] && (
              <FlashFrame key={flashIndex} src={introFlashes[flashIndex]} />
            )}
          </AnimatePresence>

          {/* Scene 3: tagline reveal */}
          <AnimatePresence>
            {step === 'tagline' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.4 } }}
                className="relative flex flex-col items-center gap-5 text-center px-6"
              >
                <div className="line-grow w-24" />
                <p
                  className="font-display italic text-3xl md:text-5xl text-paper logo-sweep-text logo-sweep-active"
                  style={{ animationDelay: '0.15s' }}
                >
                  Every Frame Tells a Story
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FlashFrame({ src }) {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 1.1 }}
      animate={{ opacity: 0, scale: 0.06 }}
      transition={{ duration: FLASH_INTERVAL / 1000, ease: [0.7, 0, 0.84, 0] }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <img src={src} alt="" className="w-full h-full object-cover rounded-2xl" />
    </motion.div>
  )
}

function Roll0kMark() {
  return (
    <>
      roll
      <span className="font-mono">0</span>
      k
    </>
  )
}