import { Menu, Bell, Search, Command } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import ThemeToggle from '../ui/ThemeToggle.jsx'

export default function Topbar({ onMenu }) {
  const { user } = useAuth()
  const { items: notifs } = useLocalCollection('notifications')
  const unread = notifs.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-2xl border-b border-ink-100">
      <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <button className="lg:hidden h-10 w-10 rounded-2xl bg-ink-950 text-white flex items-center justify-center" onClick={onMenu}><Menu size={18} /></button>
          <div className="hidden sm:flex items-center gap-2 bg-ink-50 hover:bg-white border border-transparent hover:border-ink-200 transition rounded-2xl px-4 py-2.5 max-w-md flex-1">
            <Search className="text-ink-400" />
            <input className="bg-transparent outline-none text-sm flex-1" placeholder="Search anything..." />
            <span className="hidden md:flex items-center gap-1 text-[10px] font-bold text-ink-400 bg-white border border-ink-200 rounded-md px-1.5 py-0.5">
              <Command size={10} /> K
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle variant="subtle" />
          <Link to="/admin/notifications" className="relative h-10 w-10 rounded-2xl bg-ink-50 hover:bg-white hover:shadow-soft border border-transparent hover:border-ink-200 transition flex items-center justify-center">
            <Bell />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white text-[10px] font-bold flex items-center justify-center shadow-soft">{unread}</span>
            )}
          </Link>
          <div className="flex items-center gap-2.5 pl-2">
            <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-500 via-violet-500 to-pink-500 text-white font-bold flex items-center justify-center shadow-glow">
              {(user?.name || 'A').charAt(0)}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
            </div>
            <div className="hidden md:block leading-tight">
              <p className="text-sm font-bold text-ink-900">{user?.name}</p>
              <p className="text-xs text-ink-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
