import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ROTATING_MESSAGES = [
  'Securing your records',
  'Preparing your care',
  'Connecting to Saubhagyam',
  'Almost there'
]

// Pre-computed particle positions / colors / timings — stable across renders
const PARTICLE_COLORS = ['#22d3ee', '#A6FF5D', '#c4b5fd', '#fbcfe8', '#67e8f9']
const PARTICLES = Array.from({ length: 22 }).map((_, i) => ({
  id: i,
  left:  `${(i * 4.55 + 3) % 100}%`,
  drift: `${((i * 7) % 80) - 40}px`,
  delay: `${(i * 0.45) % 9}s`,
  dur:   `${7 + ((i * 1.3) % 6)}s`,
  size:  i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 3,
  color: PARTICLE_COLORS[i % PARTICLE_COLORS.length]
}))

/**
 * Premium full-screen loader with rich background animation:
 *   • animated dot-grid + orbiting mesh blobs
 *   • 22 floating particles ascending with drift
 *   • aurora streak sweeping across
 *   • 4 sonar ripples emanating from center
 *   • center: rotating conic aurora ring + 3 orbiting dots + heartbeat brand cross
 *   • rotating typewriter status text
 *   • indeterminate progress bar
 */
export default function Loader() {
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % ROTATING_MESSAGES.length), 1900)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[300] bg-slate-950 text-white flex items-center justify-center overflow-hidden"
    >
      {/* ================== BACKGROUND LAYERS ================== */}
      {/* Base mesh gradient */}
      <div aria-hidden className="absolute inset-0 mesh-dark-bg" />

      {/* Pulsing dot grid */}
      <div aria-hidden className="absolute inset-0 loader-dotgrid" />

      {/* 4 orbiting blobs */}
      <div aria-hidden className="absolute -top-32 -left-20 h-[28rem] w-[28rem] rounded-full bg-cyan-500 mix-blend-screen blur-[110px] opacity-50 loader-blob-a" />
      <div aria-hidden className="absolute -bottom-40 -right-32 h-[32rem] w-[32rem] rounded-full bg-violet-500 mix-blend-screen blur-[110px] opacity-50 loader-blob-b" />
      <div aria-hidden className="absolute top-1/4 right-1/4 h-72 w-72 rounded-full bg-pink-500 mix-blend-screen blur-[100px] opacity-40 loader-blob-c" />
      <div aria-hidden className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-emerald-500 mix-blend-screen blur-[100px] opacity-30 loader-blob-a" style={{ animationDelay: '5s' }} />

      {/* Floating particles */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="loader-particle"
            style={{
              left: p.left,
              width: p.size, height: p.size,
              color: p.color,
              background: p.color,
              '--drift': p.drift,
              '--delay': p.delay,
              '--dur':   p.dur
            }}
          />
        ))}
      </div>

      {/* Sweeping aurora bands */}
      <div aria-hidden className="absolute inset-y-0 -left-1/4 w-1/2 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent loader-aurora pointer-events-none" />
      <div aria-hidden className="absolute inset-y-0 -left-1/4 w-1/2 bg-gradient-to-r from-transparent via-violet-300/15 to-transparent loader-aurora pointer-events-none" style={{ animationDelay: '2.5s' }} />

      {/* ================== CENTER STACK ================== */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Sonar rings — multiple ripples emanating outward */}
        {[0, 0.75, 1.5, 2.25].map((d, i) => (
          <span key={i} aria-hidden className="loader-sonar" style={{ '--delay': `${d}s` }} />
        ))}

        {/* The animated logo cluster */}
        <div className="relative h-52 w-52 flex items-center justify-center">
          {/* Glow halo */}
          <div aria-hidden className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 blur-3xl loader-glow" />

          {/* Conic aurora ring */}
          <div aria-hidden className="absolute inset-2 rounded-full loader-aurora-ring" />

          {/* Orbital dots — 3 orbits, different speeds & colors */}
          <div className="absolute inset-0 loader-orbit-a">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
          </div>
          <div className="absolute inset-4 loader-orbit-b">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-violet-300 shadow-[0_0_14px_rgba(196,181,253,0.9)]" />
          </div>
          <div className="absolute inset-8 loader-orbit-c">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-pink-300 shadow-[0_0_12px_rgba(251,207,232,0.9)]" />
          </div>

          {/* Center logo — heartbeat */}
          <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center shadow-glow loader-beat">
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-white drop-shadow">
              <path fill="currentColor" d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" />
            </svg>
          </div>
        </div>

        {/* Wordmark */}
        <div className="mt-10 text-center">
          <div className="font-display text-3xl md:text-5xl font-extrabold tracking-tight loader-wordmark leading-none">
            Saubhagyam
          </div>
          <div className="mt-2 text-[10px] md:text-xs tracking-[0.4em] font-extrabold text-white/55">
            HOSPITAL · CHANDARPUR
          </div>

          {/* Rotating typewriter status */}
          <div className="mt-4 h-5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={msgIdx}
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-white/55 font-bold flex items-center justify-center gap-1.5"
              >
                <span>{ROTATING_MESSAGES[msgIdx]}</span>
                <span className="inline-flex gap-0.5 ml-1">
                  <span className="loader-dot">.</span>
                  <span className="loader-dot">.</span>
                  <span className="loader-dot">.</span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-1 w-72 rounded-full bg-white/10 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 loader-bar" />
        </div>

        {/* ECG line */}
        <svg viewBox="0 0 600 60" className="mt-6 h-9 w-72 opacity-90">
          <defs>
            <linearGradient id="ecg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#A6FF5D" stopOpacity="0" />
              <stop offset="40%"  stopColor="#A6FF5D" stopOpacity="1" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M 0 30 L 120 30 L 150 30 L 170 10 L 195 50 L 220 5 L 240 30 L 290 30 L 320 30 L 360 30 L 380 22 L 400 38 L 420 30 L 600 30"
            stroke="url(#ecg-grad)" strokeWidth="2.5" fill="none"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="600" className="loader-ecg"
          />
        </svg>
      </div>
    </motion.div>
  )
}

/**
 * Lightweight inline loader — for in-page use.
 */
export function InlineLoader({ label = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative h-24 w-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full loader-aurora-ring" />
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-white font-black loader-beat">+</div>
      </div>
      <div className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-500 font-bold flex items-center gap-1">
        <span>{label}</span>
        <span className="loader-dot">.</span>
        <span className="loader-dot">.</span>
        <span className="loader-dot">.</span>
      </div>
    </div>
  )
}
