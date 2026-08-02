import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function MagneticButton({ as: Tag = 'button', className = '', children, strength = 0.35, ...props }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    setPos({ x, y })
  }

  const reset = () => setPos({ x: 0, y: 0 })

  const MotionTag = Tag === 'a' ? motion.a : motion.button

  return (
    <MotionTag
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.4 }}
      className={`magnetic inline-flex items-center justify-center ${className}`}
      data-cursor="pointer"
      {...props}
    >
      <motion.span
        animate={{ x: pos.x * 0.4, y: pos.y * 0.4 }}
        transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.4 }}
        className="inline-flex items-center gap-2"
      >
        {children}
      </motion.span>
    </MotionTag>
  )
}
