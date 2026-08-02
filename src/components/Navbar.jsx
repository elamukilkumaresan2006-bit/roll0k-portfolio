import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import MagneticButton from './MagneticButton'

const LINKS = [
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass py-3' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <a href="#home" data-cursor="pointer" className="font-display text-xl font-bold tracking-wide">
          ROLL<span className="grad-text">0</span>K
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-cursor="pointer"
              className="slate-label hover:text-paper transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <MagneticButton as="a" href="#contact" className="btn-ghost hidden md:inline-flex">
          Let&apos;s Talk
        </MagneticButton>

        <a href="#projects" data-cursor="pointer" className="md:hidden slate-label">
          Menu
        </a>
      </div>
    </motion.header>
  )
}
