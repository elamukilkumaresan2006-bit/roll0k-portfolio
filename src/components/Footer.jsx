export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display font-bold tracking-wide">
          ROLL<span className="grad-text">0</span>K
        </span>
        <p className="timecode text-xs text-mist text-center">
          Designed &amp; Edited by Elamukil Kumaresan
        </p>
        <p className="timecode text-xs text-mist">&copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
