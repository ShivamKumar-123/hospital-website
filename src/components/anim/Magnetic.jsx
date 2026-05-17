import { useRef } from 'react'

// Magnetic hover effect — element subtly follows the cursor.
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)

  const move = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }
  const reset = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)' }

  return (
    <div onMouseMove={move} onMouseLeave={reset} className={`inline-block ${className}`}>
      <div ref={ref} style={{ transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)' }}>
        {children}
      </div>
    </div>
  )
}
