import { NavLink, Link } from 'react-router-dom'
import { LayoutGrid, Calendar, Users, User, Layers, Truck, PenLine, Star, Bell, Settings, LogOut, X, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSettings } from '../../context/SettingsContext.jsx'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { to: '/admin/patients', label: 'Patients', icon: Users },
  { to: '/admin/doctors', label: 'Doctors', icon: User },
  { to: '/admin/departments', label: 'Departments', icon: Layers },
  { to: '/admin/ambulance', label: 'Ambulance', icon: Truck },
  { to: '/admin/blogs', label: 'Blogs', icon: PenLine },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings }
]

export default function Sidebar({ open, onClose }) {
  const { logout, user } = useAuth()
  const { settings } = useSettings()

  return (
    <>
      {open && <div className="fixed inset-0 bg-ink-950/50 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />}

      <motion.aside
        initial={false}
        animate={{ x: open || window.innerWidth >= 1024 ? 0 : -320 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed lg:sticky z-40 top-0 left-0 h-screen w-72 bg-ink-950 text-white flex flex-col overflow-hidden"
      >
        {/* mesh ambient */}
        <div aria-hidden className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-500 mix-blend-screen blur-3xl" />
          <div className="absolute top-1/2 -right-32 h-80 w-80 rounded-full bg-violet-500 mix-blend-screen blur-3xl" />
        </div>

        <div className="relative flex items-center justify-between px-5 py-5 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-500 via-violet-500 to-pink-500 flex items-center justify-center text-xl font-black shadow-glow">+</div>
            <div className="leading-tight">
              <div className="font-display font-extrabold">MediCare</div>
              <div className="text-[9px] tracking-[0.2em] text-brand-300 font-bold -mt-0.5">ADMIN PANEL</div>
            </div>
          </Link>
          <button className="lg:hidden h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center" onClick={onClose}><X /></button>
        </div>

        <nav className="relative flex-1 overflow-y-auto p-3 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span layoutId="side-active" className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-brand-500/20 via-violet-500/15 to-transparent border border-brand-500/30" transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }} />
                  )}
                  <span className={`h-8 w-8 rounded-xl flex items-center justify-center transition ${isActive ? 'bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-glow' : 'bg-white/5 group-hover:bg-white/10 text-white/70'}`}>
                    <Icon size={15} />
                  </span>
                  <span>{label}</span>
                  {isActive && <ArrowUpRight className="ml-auto text-brand-300" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="relative p-3 border-t border-white/5">
          <div className="rounded-2xl p-3 bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center font-bold">{(user?.name || 'A').charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
            <button onClick={logout} title="Logout" className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 flex items-center justify-center transition">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
