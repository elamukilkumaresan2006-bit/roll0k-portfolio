import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { projects } from '../data/projects'
import ProjectModal from './ProjectModal'

// ---- Settings you can tweak ------------------------------------------------
const COLS = 14                 // cells around the globe
const ROWS = 7                  // cells top to bottom
const SPEED_DEG_PER_SEC = 28    // rotation speed
const SNAP_ANGLE = 0.3          // how near the mouse must be to select a video
const BACK_OPACITY = 0.2        // how faint the back side of the globe is
// ----------------------------------------------------------------------------

const THETA_MIN = 0.1 * Math.PI
const THETA_MAX = 0.9 * Math.PI
const small = (url) => url.replace('/upload/', '/upload/w_480,q_auto/')
const rand = (i) => {
  const x = Math.sin(i * 127.1) * 43758.5453
  return x - Math.floor(x)
}
const spherePoint = (phi, theta) =>
  new THREE.Vector3(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta))

// Rounded-corner mask shared by every tile
function makeRoundedMask() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 192
  const g = c.getContext('2d')
  g.fillStyle = '#000'
  g.fillRect(0, 0, 256, 192)
  g.fillStyle = '#fff'
  g.beginPath()
  g.roundRect(0, 0, 256, 192, 38)
  g.fill()
  return new THREE.CanvasTexture(c)
}

// "Coming soon" tile texture
function makePlaceholderTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 370
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 512, 370)
  grad.addColorStop(0, '#1a2656')
  grad.addColorStop(1, '#2f1c5e')
  g.fillStyle = grad
  g.fillRect(0, 0, 512, 370)
  g.textAlign = 'center'
  g.fillStyle = '#8aa0ff'
  g.font = '600 30px monospace'
  g.fillText('NEW EDIT', 256, 150)
  g.fillStyle = '#eef0ff'
  g.font = '700 46px monospace'
  g.fillText('COMING', 256, 215)
  g.fillText('SOON', 256, 270)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function GlobeShowcase() {
  const wrapRef = useRef(null)
  const labelRef = useRef(null)
  const [active, setActive] = useState(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const videoProjects = projects.filter((p) => p.videoURL)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
    camera.position.z = 4.1
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y'
    wrap.appendChild(renderer.domElement)

    const globe = new THREE.Group()
    globe.rotation.x = 0.22
    scene.add(globe)

    // invisible sphere, only used to detect where the mouse is
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.985, 32, 24),
      new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false })
    )
    globe.add(core)

    const mask = makeRoundedMask()
    const phTex = makePlaceholderTexture()
    const frontMat = (map) =>
      new THREE.MeshBasicMaterial({ map, alphaMap: mask, alphaTest: 0.5, toneMapped: false })
    const backMat = (map) =>
      new THREE.MeshBasicMaterial({
        map, alphaMap: mask, transparent: true, opacity: BACK_OPACITY,
        side: THREE.BackSide, depthWrite: false, toneMapped: false,
      })
    const phFront = frontMat(phTex)
    const phBack = backMat(phTex)

    const phiLen = (Math.PI * 2) / COLS
    const thetaLen = (THETA_MAX - THETA_MIN) / ROWS

    // spread the videos around the middle rows
    const slots = new Map()
    videoProjects.forEach((p, k) => {
      const col = Math.round((k * COLS) / videoProjects.length) % COLS
      slots.set(`${[3, 2, 4][k % 3]}-${col}`, p)
    })

    const disposables = [mask, phTex, phFront, phBack, core.geometry, core.material]
    const videos = []
    const cells = []
    let n = 0

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        n++
        const project = slots.get(`${r}-${c}`) || null
        const sf = project ? 0.92 : 0.5 + 0.4 * rand(n) // random tile sizes, big gaps
        const dphi = phiLen * sf
        const dth = thetaLen * sf * (0.9 + 0.2 * rand(n + 500))
        const phi0 = c * phiLen + (phiLen - dphi) / 2
        const th0 = THETA_MIN + r * thetaLen + (thetaLen - dth) / 2
        const geo = new THREE.SphereGeometry(1, 10, 8, phi0, dphi, th0, dth)
        disposables.push(geo)

        let front = phFront
        let back = phBack

        if (project) {
          const v = document.createElement('video')
          v.crossOrigin = 'anonymous'
          v.src = small(project.videoURL)
          v.muted = true
          v.loop = true
          v.playsInline = true
          v.preload = 'auto'
          videos.push(v)
          const tex = new THREE.VideoTexture(v)
          tex.colorSpace = THREE.SRGBColorSpace
          tex.minFilter = THREE.LinearFilter
          front = frontMat(phTex)
          back = backMat(phTex)
          disposables.push(tex, front, back)

          const pa = (dphi * Math.sin(th0 + dth / 2)) / dth
          v.addEventListener('loadeddata', () => {
            const va = v.videoWidth / v.videoHeight
            if (va > pa) {
              tex.repeat.set(pa / va, 1)
              tex.offset.set((1 - pa / va) / 2, 0)
            } else {
              tex.repeat.set(1, va / pa)
              tex.offset.set(0, (1 - va / pa) / 2)
            }
            front.map = tex
            back.map = tex
            front.needsUpdate = true
            back.needsUpdate = true
          })
          v.play().catch(() => {})
        }

        const mesh = new THREE.Mesh(geo, front)
        globe.add(mesh, new THREE.Mesh(geo, back))
        if (project) {
          cells.push({ mesh, material: front, project, dir: spherePoint(phi0 + dphi / 2, th0 + dth / 2).normalize(), k: 0 })
        }
      }
    }

    const resize = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    // ---- pointer: drag to rotate, get near a video to select it ----
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const pointer = { inside: false }
    const drag = { active: false, moved: 0, lastX: 0, lastY: 0 }
    let hover = -1

    const setNdc = (e) => {
      const rect = wrap.getBoundingClientRect()
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    }
    const pick = () => {
      hover = -1
      if (!pointer.inside || drag.active) return
      raycaster.setFromCamera(ndc, camera)
      const hit = raycaster.intersectObject(core)[0]
      if (!hit) return
      const p = globe.worldToLocal(hit.point.clone()).normalize()
      let best = SNAP_ANGLE
      cells.forEach((cell, i) => {
        const a = Math.acos(Math.min(1, p.dot(cell.dir)))
        if (a < best) {
          best = a
          hover = i
        }
      })
    }
    const onEnter = (e) => { pointer.inside = true; setNdc(e) }
    const onLeave = () => { pointer.inside = false; drag.active = false; hover = -1 }
    const onDown = (e) => {
      setNdc(e)
      pointer.inside = true
      Object.assign(drag, { active: true, moved: 0, lastX: e.clientX, lastY: e.clientY })
      pick()
    }
    const onMove = (e) => {
      setNdc(e)
      pointer.inside = true
      if (!drag.active) return
      const dx = e.clientX - drag.lastX
      const dy = e.clientY - drag.lastY
      drag.moved += Math.abs(dx) + Math.abs(dy)
      drag.lastX = e.clientX
      drag.lastY = e.clientY
      globe.rotation.y += dx * 0.008
      globe.rotation.x = Math.max(-0.8, Math.min(0.8, globe.rotation.x + dy * 0.006))
    }
    const onUp = () => {
      const wasClick = drag.active && drag.moved < 6
      drag.active = false
      if (wasClick) {
        pick()
        if (hover >= 0) setActive(cells[hover].project)
      }
    }
    wrap.addEventListener('pointerenter', onEnter)
    wrap.addEventListener('pointerleave', onLeave)
    wrap.addEventListener('pointerdown', onDown)
    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerup', onUp)
    wrap.addEventListener('pointercancel', onLeave)

    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      videos.forEach((v) => (visible ? v.play().catch(() => {}) : v.pause()))
    })
    io.observe(wrap)

    // ---- animation loop ----
    const clock = new THREE.Clock()
    const baseSpeed = reduce ? 0 : THREE.MathUtils.degToRad(SPEED_DEG_PER_SEC)
    let speed = baseSpeed
    let t = 0
    let raf
    const tmp = new THREE.Vector3()

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      const dt = Math.min(clock.getDelta(), 0.05)
      t += dt
      pick()

      const target = drag.active || hover >= 0 ? 0 : pointer.inside ? baseSpeed * 0.3 : baseSpeed
      speed += (target - speed) * Math.min(1, dt * 6)
      globe.rotation.y += speed * dt

      // selected video: pops out and blinks brighter (no border)
      const blink = 0.5 + 0.5 * Math.sin(t * 11)
      cells.forEach((cell, i) => {
        cell.k += ((i === hover ? 1 : 0) - cell.k) * Math.min(1, dt * 14)
        cell.mesh.scale.setScalar(1 + 0.08 * cell.k)
        cell.material.color.setScalar(1 + cell.k * (0.1 + 0.35 * blink))
      })

      const label = labelRef.current
      if (label) {
        if (hover >= 0) {
          tmp.copy(cells[hover].dir).applyMatrix4(globe.matrixWorld).project(camera)
          label.style.opacity = '1'
          label.style.transform = `translate(${(tmp.x * 0.5 + 0.5) * wrap.clientWidth}px, ${(-tmp.y * 0.5 + 0.5) * wrap.clientHeight}px) translate(-50%, -50%)`
        } else {
          label.style.opacity = '0'
        }
      }
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      wrap.removeEventListener('pointerenter', onEnter)
      wrap.removeEventListener('pointerleave', onLeave)
      wrap.removeEventListener('pointerdown', onDown)
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerup', onUp)
      wrap.removeEventListener('pointercancel', onLeave)
      videos.forEach((v) => {
        v.pause()
        v.removeAttribute('src')
        v.load()
      })
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      if (renderer.domElement.parentNode === wrap) wrap.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <>
      <div ref={wrapRef} className="relative w-full aspect-square max-w-[620px] mx-auto select-none">
        <div
          ref={labelRef}
          className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150 z-10"
        >
          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-paper text-void text-[11px] font-bold tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.35)]">
            VIEW
          </span>
        </div>
        <p className="absolute bottom-0 inset-x-0 text-center slate-label !text-[10px] opacity-60 pointer-events-none">
          Drag to rotate · hover a video to select
        </p>
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </>
  )
}