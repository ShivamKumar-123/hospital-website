import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowUpRight, Eye, EyeOff, CheckCircle, Activity, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { CREDS } from '../../utils/seed.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [form, setForm] = useState({ email: CREDS.admin.email, password: CREDS.admin.password })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const res = login(form.email, form.password)
    setLoading(false)
    if (!res.ok) { toast(res.error, 'error'); return }
    toast('Welcome back!', 'success')
    navigate(location.state?.from?.pathname || '/admin')
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* LEFT — dramatic dark panel */}
      <div className="relative hidden lg:flex items-center justify-center p-12 overflow-hidden bg-ink-950 text-white">
        <div aria-hidden className="absolute inset-0 mesh-dark-bg" />
        <div aria-hidden className="absolute inset-0 bg-grid bg-grid opacity-10" />
        <div aria-hidden className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-brand-500 mix-blend-screen blur-[120px] opacity-50 animate-float-slow" />
        <div aria-hidden className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-violet-500 mix-blend-screen blur-[120px] opacity-50 animate-float-slow" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-md">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-brand-500 via-violet-500 to-pink-500 flex items-center justify-center text-2xl font-black shadow-glow">+</div>
            <div>
              <div className="font-display font-extrabold text-xl">MediCare</div>
              <div className="text-[10px] tracking-[0.25em] font-bold text-brand-300">PREMIUM HEALTH</div>
            </div>
          </Link>

          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="font-display text-5xl xl:text-6xl font-extrabold mt-12 leading-[0.98]"
          >
            Premium hospital<br />management,<br /><span className="text-gradient">one dashboard.</span>
          </motion.h2>

          <p className="text-white/60 mt-5 max-w-sm">Doctors, patients, appointments, ambulances, blogs and revenue — all in one beautifully crafted control room.</p>

          {/* Feature pills */}
          <div className="mt-10 space-y-3">
            {[
              { i: Activity, t: 'Real-time analytics' },
              { i: Shield, t: 'Role-based access' },
              { i: CheckCircle, t: '10 fully-CRUD admin modules' }
            ].map((f) => (
              <div key={f.t} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-300"><f.i /></div>
                <span className="text-white/85">{f.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="relative flex items-center justify-center p-6 lg:p-12 mesh-bg">
        <div aria-hidden className="absolute inset-0 bg-grid bg-grid opacity-[0.04]" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative w-full max-w-md">

          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white font-black">+</div>
            <span className="font-display font-extrabold">MediCare</span>
          </Link>

          <span className="eyebrow">Admin access</span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-ink-900 mt-3 leading-[1]">
            Welcome <span className="text-gradient">back.</span>
          </h1>
          <p className="text-ink-500 mt-3">Sign in with the demo credentials below to explore the dashboard.</p>

          <div className="mt-5 rounded-2xl bg-gradient-to-r from-brand-50 to-violet-50 border border-brand-100 p-4 text-sm text-ink-800">
            <p className="font-bold text-brand-700">Demo credentials</p>
            <p className="font-mono mt-1 text-xs">{CREDS.admin.email} / {CREDS.admin.password}</p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-ink-400" />
                <input className="input pl-11" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-ink-400" />
                <input className="input pl-11 pr-11" type={show ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-3.5 text-ink-400 hover:text-ink-700">{show ? <EyeOff /> : <Eye />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 !text-base shine">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Signing in...
                </span>
              ) : <>Sign in <ArrowUpRight /></>}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-6">
            ← Back to <Link to="/" className="text-brand-700 font-semibold hover:underline">website</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
