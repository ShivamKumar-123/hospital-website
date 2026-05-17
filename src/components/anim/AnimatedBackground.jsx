import { useEffect, useRef } from 'react'

/**
 * Global animated background — runs on every page.
 *
 * Layers:
 *   1. 4 slowly drifting mesh blobs (visible in transparent gaps between sections)
 *   2. Soft dot-grid pattern (premium texture)
 *   3. Subtle SVG grain noise (film-grade premium feel)
 *   4. Cursor-following spotlight with `mix-blend-mode: soft-light` →
 *      tints whatever section is below (works on light AND dark sections)
 *
 * Variants:
 *   "public"    — for marketing pages (richer, more visible)
 *   "dashboard" — for admin pages (subtler, less distracting from data)
 */
export default function AnimatedBackground({ variant = 'public' }) {
  const cursorRef = useRef(null)

  useEffect(() => {
    if (!cursorRef.current) return
    let raf
    const onMove = (e) => {
      cancelAnimationFrame(raf)
      const x = e.clientX
      const y = e.clientY
      raf = requestAnimationFrame(() => {
        if (!cursorRef.current) return
        // -50% offset so the gradient is centered on the cursor
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  const intensity = variant === 'dashboard' ? 0.6 : 1
  const blobOpacity = variant === 'dashboard' ? 0.35 : 0.55

  return (
    <>
      {/* ============ Behind-content layers (z-0) ============ */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Dot grid pattern */}
        <div className="absolute inset-0 bg-dotgrid" />

        {/* Drifting mesh blobs */}
        <div
          className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-cyan-300 blur-[140px] bg-blob-a"
          style={{ opacity: blobOpacity * 0.9 }}
        />
        <div
          className="absolute -bottom-40 -right-40 h-[40rem] w-[40rem] rounded-full bg-violet-300 blur-[140px] bg-blob-b"
          style={{ opacity: blobOpacity * 0.8 }}
        />
        <div
          className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-pink-300 blur-[120px] bg-blob-c"
          style={{ opacity: blobOpacity * 0.6 }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 h-72 w-72 rounded-full bg-emerald-300 blur-[120px] bg-blob-d"
          style={{ opacity: blobOpacity * 0.5 }}
        />

        {/* Subtle grain noise */}
        <div className="absolute inset-0 grain-noise" style={{ opacity: 0.05 * intensity }} />
      </div>

      {/* ============ Cursor spotlight (z-60, above content with mix-blend) ============ */}
      <div ref={cursorRef} aria-hidden className="bg-cursor" />
    </>
  )
}
