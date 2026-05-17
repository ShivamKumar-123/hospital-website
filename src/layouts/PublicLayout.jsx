import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/public/Navbar.jsx'
import Footer from '../components/public/Footer.jsx'
import ScrollToTop from '../components/ui/ScrollToTop.jsx'
import AnimatedBackground from '../components/anim/AnimatedBackground.jsx'

export default function PublicLayout() {
  const { pathname } = useLocation()
  // Home renders its own immersive hero that overlaps with the fixed navbar.
  // All other pages get top padding so content sits below the navbar.
  const padTop = pathname === '/' ? '' : 'pt-24'

  return (
    <>
      <AnimatedBackground variant="public" />
      {/* relative + z-10 so all content sits ABOVE the bg layer (which is z-0) */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <main className={`flex-1 ${padTop}`}><Outlet /></main>
        <Footer />
      </div>
      <ScrollToTop />
    </>
  )
}
