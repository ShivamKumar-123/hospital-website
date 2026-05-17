import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/public/Navbar.jsx'
import Footer from '../components/public/Footer.jsx'
import ScrollToTop from '../components/ui/ScrollToTop.jsx'
import AnimatedBackground from '../components/anim/AnimatedBackground.jsx'
import RouteProgress from '../components/ui/RouteProgress.jsx'

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
        <main className={`flex-1 ${padTop}`}>
          {/* Inner Suspense — only the lazy page swap shows the thin top
              progress bar; navbar and footer stay mounted, no white flash. */}
          <Suspense fallback={<RouteProgress />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
      <ScrollToTop />
    </>
  )
}
