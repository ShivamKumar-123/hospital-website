import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Phone, ArrowUpRight, Sparkles, LogIn, LogOut, UserCircle2, LayoutGrid, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../../context/SettingsContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import ThemeToggle from '../ui/ThemeToggle.jsx'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/departments', label: 'Departments' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/appointment', label: 'Appointment' },
  { to: '/packages', label: 'Packages' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const { settings } = useSettings()
  const { user, logout, isAdmin } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const menuRef = useRef(null)

  const onHomeHero = pathname === '/' && !scrolled

  // Derived brand text — same split rule as the Footer so navbar/footer stay in sync.
  const parts = (settings.hospitalName || 'Hospital').split(' ')
  const brandLine1 = parts[0]
  const brandLine2 = (parts.slice(1).join(' ') || 'PREMIUM HEALTH').toUpperCase()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close account dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setAccountOpen(false)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const handleLogout = () => {
    logout()
    setAccountOpen(false)
    navigate('/')
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="container-xl">
        <motion.nav
          layout
          className={`flex items-center justify-between gap-4 rounded-full px-3 sm:px-4 transition-all duration-500 ${
            onHomeHero
              ? 'bg-white/5 backdrop-blur-xl border border-white/15 h-16'
              : scrolled
                ? 'bg-white/85 backdrop-blur-2xl border border-slate-100 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] h-14'
                : 'bg-white/60 backdrop-blur-xl border border-white/40 h-16'
          }`}
        >
          <Link to="/" className="flex items-center gap-2 px-2 group">
            <div className="relative h-9 w-9 rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-white font-black shadow-glow group-hover:rotate-12 transition-transform duration-500">
              <span className="text-lg">+</span>
            </div>
            <div className="leading-tight">
              <div className={`font-display font-extrabold ${onHomeHero ? 'text-white' : 'text-slate-900'}`}>{brandLine1}</div>
              <div className={`text-[10px] tracking-widest font-bold -mt-0.5 ${onHomeHero ? 'text-cyan-300' : 'text-cyan-600'}`}>{brandLine2}</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}
                className={({ isActive }) =>
                  `relative px-3.5 py-1.5 text-sm font-semibold transition rounded-full ${
                    isActive
                      ? (onHomeHero ? 'text-white' : 'text-slate-900')
                      : (onHomeHero ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                  }`
                }>
                {({ isActive }) => (
                  <>
                    <span>{l.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className={`absolute inset-0 -z-10 rounded-full ${onHomeHero ? 'bg-white/10 border border-white/20' : 'bg-gradient-to-r from-cyan-100 to-violet-100 border border-white'}`}
                        transition={{ type: 'spring', bounce: 0.2 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            {/* Theme toggle */}
            <ThemeToggle variant={onHomeHero ? 'default' : 'subtle'} />

            <a href={`tel:${settings.emergency}`}
              title="Emergency"
              className={`btn !py-2 !px-3 group whitespace-nowrap ${onHomeHero ? 'text-white border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur' : 'btn-outline'}`}>
              <Phone size={14} className="group-hover:rotate-12 transition" />
              <span className="hidden xl:inline">Emergency</span>
            </a>

            {!user ? (
              // ============ Logged OUT — show Sign in + Book Now ============
              <>
                <Link to="/account/login"
                  className={`btn !py-2 !px-3.5 whitespace-nowrap ${onHomeHero ? 'text-white border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur' : 'btn-outline'}`}>
                  <LogIn size={14} /> <span className="hidden xl:inline">Sign in</span>
                </Link>
                <div className="p-[1px] rounded-full bg-gradient-to-r from-white/60 to-transparent">
                  <Link to="/appointment"
                    className="flex items-center gap-2 bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-slate-900 font-semibold px-4 py-2 rounded-full text-sm whitespace-nowrap transition cursor-pointer group">
                    <Sparkles size={14} />
                    <span className="slide-text">
                      <span>Book Now</span>
                      <span>Book Now</span>
                    </span>
                  </Link>
                </div>
              </>
            ) : (
              // ============ Logged IN — avatar dropdown ============
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  className={`flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1.5 transition ${onHomeHero ? 'bg-white/10 hover:bg-white/15 border border-white/20' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 text-white font-bold flex items-center justify-center">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className={`text-sm font-semibold hidden md:inline ${onHomeHero ? 'text-white' : 'text-slate-800'}`}>
                    {user.name?.split(' ')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(15,23,42,0.25)] border border-slate-100 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-cyan-50 via-white to-violet-50">
                        <div className="font-display font-extrabold text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500 truncate">{user.email}</div>
                        <span className={`mt-2 inline-block chip ${user.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-cyan-100 text-cyan-700'}`}>
                          {user.role === 'admin' ? 'Admin' : 'Patient'}
                        </span>
                      </div>
                      <div className="p-2">
                        {isAdmin ? (
                          <DropdownLink to="/admin" icon={LayoutGrid} onClick={() => setAccountOpen(false)}>Admin dashboard</DropdownLink>
                        ) : (
                          <>
                            <DropdownLink to="/account" icon={UserCircle2} onClick={() => setAccountOpen(false)}>My account</DropdownLink>
                            <DropdownLink to="/appointment" icon={Calendar} onClick={() => setAccountOpen(false)}>Book appointment</DropdownLink>
                          </>
                        )}
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition">
                          <LogOut size={16} /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile theme toggle (between hamburger and menu) */}
          <div className="lg:hidden">
            <ThemeToggle variant={onHomeHero ? 'default' : 'subtle'} />
          </div>

          <button
            className={`lg:hidden h-10 w-10 rounded-full flex items-center justify-center transition ${onHomeHero ? 'bg-white/10 text-white border border-white/20' : 'bg-slate-900 text-white'}`}
            onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </motion.nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="lg:hidden container-xl mt-2"
          >
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-3">
              <div className="grid grid-cols-2 gap-1">
                {LINKS.map((l) => (
                  <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
                    className={({ isActive }) => `px-3 py-2.5 rounded-2xl text-sm font-semibold ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'}`}>
                    {l.label}
                  </NavLink>
                ))}
              </div>

              {!user ? (
                <div className="grid grid-cols-2 gap-2 mt-3 px-1">
                  <Link to="/account/login" onClick={() => setOpen(false)} className="btn-glass w-full !py-2.5"><LogIn size={14} /> Sign in</Link>
                  <Link to="/appointment" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 bg-[#A6FF5D] text-slate-900 font-semibold py-2.5 rounded-full text-sm">
                    Book <ArrowUpRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="mt-3 px-1 space-y-2">
                  <Link to={isAdmin ? '/admin' : '/account'} onClick={() => setOpen(false)} className="w-full btn-glass !py-2.5">
                    <UserCircle2 size={14} /> {isAdmin ? 'Admin dashboard' : 'My account'}
                  </Link>
                  <button onClick={() => { handleLogout(); setOpen(false) }} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-rose-500/10 text-rose-300 text-sm font-semibold">
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function DropdownLink({ to, icon: Icon, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
      <Icon size={16} className="text-cyan-600" /> {children}
    </Link>
  )
}
