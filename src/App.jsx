import { useState } from 'react'
import IntroAnimation from './components/IntroAnimation'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Journey from './sections/Journey'
import Projects from './sections/Projects'
import Contact from './sections/Contact'

export default function App() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <>
      <div className="light-leaks" />
      <div className="dust" />
      <div className="grain" />
      <CustomCursor />
      <IntroAnimation onComplete={() => setIntroDone(true)} />

      <div
        style={{
          opacity: introDone ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
      >
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Journey />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}
