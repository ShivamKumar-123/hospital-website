import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowUpRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { CREDS } from '../../utils/seed.js'
import AuthShell from './AuthShell.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [form, setForm] = useState({ email: CREDS.demoUser.email, password: CREDS.demoUser.password })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const res = login(form.email, form.password)
    setLoading(false)
    if (!res.ok) { toast(res.error, 'error'); return }
    toast(`Welcome back, ${res.user.name.split(' ')[0]}!`, 'success')
    const dest = location.state?.from?.pathname || (res.user.role === 'admin' ? '/admin' : '/account')
    navigate(dest)
  }

  return (
    <AuthShell>
      <span className="eyebrow">Patient login</span>
      <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mt-3 leading-[1]">
        Welcome <span className="text-gradient">back.</span>
      </h1>
      <p className="text-slate-500 mt-3">Sign in to access your appointments, reports and prescriptions.</p>

      <div className="mt-5 rounded-2xl bg-gradient-to-r from-cyan-50 to-violet-50 border border-cyan-100 p-4 text-sm text-slate-800">
        <p className="font-bold text-cyan-700">Demo patient account</p>
        <p className="font-mono mt-1 text-xs">{CREDS.demoUser.email} / {CREDS.demoUser.password}</p>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-3.5 text-slate-400" />
            <input className="input pl-11" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label !mb-0">Password</label>
            <a href="#" className="text-xs text-cyan-700 font-semibold hover:underline">Forgot?</a>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-3.5 text-slate-400" />
            <input className="input pl-11 pr-11" type={show ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-700">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 !text-base shine">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Signing in...
            </span>
          ) : <>Sign in <ArrowUpRight size={16} /></>}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        New to Saubhagyam? <Link to="/account/register" className="text-cyan-700 font-bold hover:underline">Create an account</Link>
      </p>
      <p className="text-center text-xs text-slate-400 mt-3">
        Hospital staff? <Link to="/login" className="text-slate-600 hover:underline">Admin login</Link>
      </p>
    </AuthShell>
  )
}
