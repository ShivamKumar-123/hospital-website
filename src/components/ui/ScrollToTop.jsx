import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const [show, setShow] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-lg flex items-center justify-center hover:scale-110 transition"
      aria-label="Scroll to top"
    >
      <ArrowUp />
    </button>
  )
}
