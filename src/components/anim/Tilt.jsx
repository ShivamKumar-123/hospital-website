import { useRef } from 'react'

// 3D tilt-on-hover wrapper. No framer-motion needed — pure CSS transforms.
export default function Tilt({ children, max = 10, glare = true, className = '', ...rest }) {
  const ref = useRef(null)
  const glareRef = useRef(null)

  const handle = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    const rx = (y - 0.5) * -max * 2
    const ry = (x - 0.5) * max * 2
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(400px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.25), transparent 50%)`
    }
  }
  const reset = () => {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateX(0) rotateY(0)'
    if (glareRef.current) glareRef.current.style.background = 'transparent'
  }

  return (
    <div
      ref={ref}
      onMouseMove={handle}
      onMouseLeave={reset}
      style={{ transition: 'transform 200ms ease-out', transformStyle: 'preserve-3d' }}
      className={`relative ${className}`}
      {...rest}
    >
      {children}
      {glare && <div ref={glareRef} aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" />}
    </div>
  )
}
