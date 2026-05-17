import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar.jsx'
import Topbar from '../components/dashboard/Topbar.jsx'
import AnimatedBackground from '../components/anim/AnimatedBackground.jsx'

export default function DashboardLayout() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <AnimatedBackground variant="dashboard" />
      <div className="relative z-10 min-h-screen flex bg-ink-50/40">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar onMenu={() => setOpen(true)} />
          <main className="p-4 md:p-8 flex-1"><Outlet /></main>
        </div>
      </div>
    </>
  )
}
