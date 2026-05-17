import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar.jsx'
import Topbar from '../components/dashboard/Topbar.jsx'
import AnimatedBackground from '../components/anim/AnimatedBackground.jsx'
import RouteProgress from '../components/ui/RouteProgress.jsx'

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Auto-close the mobile sidebar whenever the route changes.
  // This catches every navigation path — clicking a NavLink, browser back,
  // logo click, programmatic navigate — without depending on per-link handlers.
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <AnimatedBackground variant="dashboard" />
      <div className="relative z-10 min-h-screen flex bg-ink-50/40">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar onMenu={() => setOpen(true)} />
          <main className="p-4 md:p-8 flex-1">
            {/* Inner Suspense — only the lazy admin page suspends, the
                sidebar/topbar chrome stays mounted so the screen never
                goes white between route changes. */}
            <Suspense fallback={<RouteProgress />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </>
  )
}
