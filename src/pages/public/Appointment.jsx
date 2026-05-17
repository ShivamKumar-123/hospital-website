import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, Clock, User, Phone, Mail, ArrowUpRight, Shield, LogIn } from 'lucide-react'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import { useToast } from '../../context/ToastContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { addRecord } from '../../utils/storage.js'
import PageHero from '../../components/public/PageHero.jsx'
import Reveal from '../../components/anim/Reveal.jsx'

import { useSeo } from '../../utils/seo.js'

export default function Appointment() {
  useSeo({
    title: 'Book an Appointment Online — MediCare+ Hospital',
    description: 'Book your doctor appointment online at MediCare+. Choose your department, pick a specialist, select a date & time — confirmation in seconds.',
    keywords: ['book appointment', 'doctor appointment online', 'hospital booking', 'consultation'],
    path: '/appointment'
  })

  const { items: departments } = useLocalCollection('departments')
  const { items: doctors } = useLocalCollection('doctors')
  const { toast } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    patientName: user?.role === 'patient' ? user.name : '',
    phone:       user?.role === 'patient' ? (user.phone || '') : '',
    email:       user?.role === 'patient' ? user.email : '',
    department:  location.state?.department || '',
    doctor:      location.state?.doctor || '',
    date: '', time: '', symptoms: ''
  })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  const filteredDoctors = doctors.filter((d) => !form.department || d.department === form.department)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.patientName.trim()) e.patientName = 'Required'
    if (!/^[+\d\s()-]{7,}$/.test(form.phone)) e.phone = 'Valid phone required'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.department) e.department = 'Required'
    if (!form.doctor) e.doctor = 'Required'
    if (!form.date) e.date = 'Required'
    if (!form.time) e.time = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    addRecord('appointments', {
      ...form,
      status: 'Pending',
      userId: user?.id || null,    // link to logged-in patient (if any)
      userEmail: user?.email || form.email
    })
    addRecord('notifications', { title: 'New appointment request', message: `${form.patientName} requested ${form.department}`, type: 'appointment', read: false })
    toast('Appointment booked successfully!', 'success')
    setDone(true)
    setTimeout(() => navigate('/'), 2500)
  }

  if (done) {
    return (
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 mesh-bg" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="container-xl relative">
          <div className="max-w-md mx-auto glass p-10 text-center">
            <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center text-4xl shadow-glow">
              <CheckCircle />
            </div>
            <h2 className="font-display text-3xl font-extrabold mt-5">You're booked!</h2>
            <p className="text-ink-500 mt-3">A confirmation will be sent to your phone shortly. Redirecting home...</p>
          </div>
        </motion.div>
      </section>
    )
  }

  return (
    <>
      <PageHero
        eyebrow="Book a visit"
        title={<>Schedule your <span className="text-gradient">visit.</span></>}
        subtitle="Pick a doctor, date and time — confirmation arrives via SMS within minutes."
      />

      <section className="container-xl pb-20 grid lg:grid-cols-3 gap-6">
        <Reveal dir="up" className="lg:col-span-2 space-y-4">
          {!user && (
            <div className="card p-4 flex flex-wrap items-center gap-3 bg-gradient-to-r from-cyan-50 via-violet-50 to-pink-50 border-cyan-100">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white flex items-center justify-center"><LogIn size={18} /></div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-bold text-slate-900">Sign in to track this appointment</p>
                <p className="text-xs text-slate-500">Save your details, view status updates and chat with your doctor.</p>
              </div>
              <Link to="/account/login" state={{ from: location }} className="btn-outline !py-2 text-xs">Sign in</Link>
              <Link to="/account/register" className="btn-primary !py-2 text-xs">Create account</Link>
            </div>
          )}
          {user?.role === 'patient' && (
            <div className="card p-4 flex items-center gap-3 bg-emerald-50 border-emerald-100">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white flex items-center justify-center"><CheckCircle size={18} /></div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">Signed in as {user.name}</p>
                <p className="text-xs text-slate-500">This visit will appear in your <Link to="/account" className="text-cyan-700 font-bold hover:underline">account dashboard</Link>.</p>
              </div>
            </div>
          )}
          <form onSubmit={submit} className="card p-6 md:p-8 grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="label">Full name</label>
              <div className="relative"><User className="absolute left-4 top-3.5 text-ink-400" />
                <input className="input pl-11" value={form.patientName} onChange={(e) => set('patientName', e.target.value)} placeholder="John Doe" />
              </div>
              {errors.patientName && <p className="text-rose-500 text-xs mt-1">{errors.patientName}</p>}
            </div>

            <div>
              <label className="label">Phone</label>
              <div className="relative"><Phone className="absolute left-4 top-3.5 text-ink-400" />
                <input className="input pl-11" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555 0000" />
              </div>
              {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="label">Email (optional)</label>
              <div className="relative"><Mail className="absolute left-4 top-3.5 text-ink-400" />
                <input className="input pl-11" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" />
              </div>
              {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label">Department</label>
              <select className="input" value={form.department} onChange={(e) => { set('department', e.target.value); set('doctor', '') }}>
                <option value="">Select department</option>
                {departments.map((d) => <option key={d.id}>{d.name}</option>)}
              </select>
              {errors.department && <p className="text-rose-500 text-xs mt-1">{errors.department}</p>}
            </div>
            <div>
              <label className="label">Doctor</label>
              <select className="input" value={form.doctor} onChange={(e) => set('doctor', e.target.value)}>
                <option value="">Select doctor</option>
                {filteredDoctors.map((d) => <option key={d.id}>{d.name}</option>)}
              </select>
              {errors.doctor && <p className="text-rose-500 text-xs mt-1">{errors.doctor}</p>}
            </div>

            <div>
              <label className="label">Date</label>
              <div className="relative"><Calendar className="absolute left-4 top-3.5 text-ink-400" />
                <input type="date" className="input pl-11" value={form.date} onChange={(e) => set('date', e.target.value)} />
              </div>
              {errors.date && <p className="text-rose-500 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="label">Time</label>
              <div className="relative"><Clock className="absolute left-4 top-3.5 text-ink-400" />
                <input type="time" className="input pl-11" value={form.time} onChange={(e) => set('time', e.target.value)} />
              </div>
              {errors.time && <p className="text-rose-500 text-xs mt-1">{errors.time}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="label">Symptoms / notes</label>
              <textarea rows="4" className="input" value={form.symptoms} onChange={(e) => set('symptoms', e.target.value)} placeholder="Describe symptoms..." />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary w-full !py-3.5 !text-base shine">Confirm appointment <ArrowUpRight /></button>
            </div>
          </form>
        </Reveal>

        <Reveal dir="left" delay={0.2} className="lg:col-span-1">
          <div className="space-y-4 sticky top-28">
            <div className="card p-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 text-white flex items-center justify-center text-xl shadow-glow"><Shield /></div>
              <h3 className="font-display text-xl font-extrabold mt-4">Why book online?</h3>
              <ul className="mt-3 space-y-3">
                {[
                  'Real-time slot availability',
                  'SMS confirmation in minutes',
                  'Free rescheduling up to 2 hours',
                  'Digital prescriptions stored in profile'
                ].map((t) => (
                  <li key={t} className="flex gap-2 text-sm text-ink-600"><CheckCircle className="text-emerald-500 mt-0.5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl p-6 bg-ink-950 text-white relative overflow-hidden">
              <div aria-hidden className="absolute inset-0 mesh-dark-bg" />
              <div className="relative">
                <span className="chip bg-rose-500/20 text-rose-300 border border-rose-500/30">Emergency</span>
                <p className="font-display text-xl font-extrabold mt-3">Need immediate help?</p>
                <a href="tel:911" className="mt-3 btn bg-white text-ink-900 w-full">Call emergency line</a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
