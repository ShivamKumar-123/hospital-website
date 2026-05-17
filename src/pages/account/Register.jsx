import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowUpRight, Eye, EyeOff, User, Phone, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import AuthShell from './AuthShell.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required'
    if (form.phone && !/^[+\d\s()-]{7,}$/.test(form.phone)) e.phone = 'Invalid phone'
    if (form.password.length < 6) e.password = 'At least 6 characters'
    if (form.password !== form.confirm) e.confirm = "Passwords don't match"
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const res = register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
    setLoading(false)
    if (!res.ok) { toast(res.error, 'error'); return }
    toast(`Welcome, ${res.user.name.split(' ')[0]}!`, 'success')
    navigate('/account')
  }

  // Password strength meter (rough)
  const strength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 6) s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++
    if (/\d/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  })()

  return (
    <AuthShell>
      <span className="eyebrow">Create account</span>
      <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mt-3 leading-[1]">
        Join <span className="text-gradient">MediCare+.</span>
      </h1>
      <p className="text-slate-500 mt-3">Book appointments, store reports and chat with your doctors.</p>

      <form onSubmit={submit} className="mt-7 space-y-4">
        <div>
          <label className="label">Full name</label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-3.5 text-slate-400" />
            <input className="input pl-11" placeholder="John Doe" value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-3.5 text-slate-400" />
              <input className="input pl-11" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </div>
            {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="label">Phone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-3.5 text-slate-400" />
              <input className="input pl-11" placeholder="+1 555 0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
            {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-3.5 text-slate-400" />
            <input className="input pl-11 pr-11" type={show ? 'text' : 'password'} placeholder="At least 6 characters" value={form.password} onChange={(e) => set('password', e.target.value)} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-700">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password}</p>}
          {form.password && (
            <div className="mt-2 flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition ${
                  i <= strength
                    ? strength <= 2 ? 'bg-rose-400' : strength <= 3 ? 'bg-amber-400' : 'bg-emerald-500'
                    : 'bg-slate-200'
                }`} />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="label">Confirm password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-3.5 text-slate-400" />
            <input className="input pl-11" type={show ? 'text' : 'password'} placeholder="Repeat password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} />
          </div>
          {errors.confirm && <p className="text-rose-500 text-xs mt-1">{errors.confirm}</p>}
        </div>

        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <CheckCircle size={12} className="text-emerald-500" /> By signing up you agree to our terms & privacy policy.
        </p>

        <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 !text-base shine">
          {loading ? 'Creating account...' : <>Create account <ArrowUpRight size={16} /></>}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account? <Link to="/account/login" className="text-cyan-700 font-bold hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  )
}
