import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      }
    }

    const onDown = () => ringRef.current?.classList.add('scale-90')
    const onUp = () => ringRef.current?.classList.remove('scale-90')

    const onOver = (e) => {
      const isInteractive = e.target.closest('a, button, [data-cursor="pointer"], input, textarea')
      if (ringRef.current) {
        if (isInteractive) {
          ringRef.current.style.width = '64px'
          ringRef.current.style.height = '64px'
          ringRef.current.style.borderColor = 'rgba(155,107,255,0.9)'
          ringRef.current.style.background = 'rgba(61,107,255,0.08)'
        } else {
          ringRef.current.style.width = '40px'
          ringRef.current.style.height = '40px'
          ringRef.current.style.borderColor = 'rgba(255,255,255,0.35)'
          ringRef.current.style.background = 'transparent'
        }
      }
    }

    let raf
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.16
      ring.current.y += (pos.current.y - ring.current.y) * 0.16
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="cursor-layer">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-scrub" />
    </div>
  )
}
