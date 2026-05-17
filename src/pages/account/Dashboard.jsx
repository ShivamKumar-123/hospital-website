import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar, Clock, User, Phone, Mail, MapPin, ArrowUpRight,
  Heart, LogOut, Sparkles, Activity, Pencil, Check
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import { useToast } from '../../context/ToastContext.jsx'
import Reveal, { Stagger, Item } from '../../components/anim/Reveal.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { fmtDate } from '../../utils/format.js'

const TABS = ['Overview', 'Appointments', 'Profile']

export default function Dashboard() {
  const { user, logout, updateProfile } = useAuth()
  const { items: appointments } = useLocalCollection('appointments')
  const { toast } = useToast()
  const [tab, setTab] = useState('Overview')
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' })

  // Filter appointments belonging to this user by email or patient name match
  const myAppts = useMemo(
    () => appointments.filter(
      (a) =>
        (a.email && a.email.toLowerCase() === user?.email?.toLowerCase()) ||
        (a.patientName || '').toLowerCase() === (user?.name || '').toLowerCase()
    ),
    [appointments, user]
  )

  const upcoming = myAppts.filter((a) => a.status === 'Pending' || a.status === 'Approved')
  const past = myAppts.filter((a) => a.status === 'Completed' || a.status === 'Rejected')

  const saveProfile = () => {
    const res = updateProfile({ name: profile.name, phone: profile.phone })
    if (res.ok) { toast('Profile updated', 'success'); setEditing(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page hero — gradient banner */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-14 pb-32">
        <div aria-hidden className="absolute inset-0">
          <div className="absolute inset-0 mesh-dark-bg" />
          <div className="absolute inset-0 bg-grid opacity-[0.08]" />
          <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-cyan-500 mix-blend-screen blur-[120px] opacity-40 animate-float-slow" />
          <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-violet-500 mix-blend-screen blur-[120px] opacity-30 animate-float-slow" style={{ animationDelay: '3s' }} />
        </div>

        <div className="container-xl relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="chip bg-white/10 border border-white/20 text-cyan-200 backdrop-blur"><Sparkles size={12} /> Welcome back</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mt-4 leading-[0.95]">
                Hi, <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-[#A6FF5D] bg-clip-text text-transparent">{user?.name?.split(' ')[0]}.</span>
              </h1>
              <p className="text-white/60 mt-3 max-w-md">
                Your appointments, prescriptions and records — all in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/appointment" className="btn bg-[#A6FF5D] text-slate-900 font-bold hover:-translate-y-0.5 !py-3 !px-5">
                <Sparkles size={14} /> Book new visit
              </Link>
              <button onClick={logout} className="btn-glass !py-3 !px-5">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="container-xl -mt-20 relative z-10">
        <div className="glass p-1.5 inline-flex gap-1 rounded-full">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition ${tab === t ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {tab === t && (
                <motion.span layoutId="acct-tab" className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500" transition={{ type: 'spring', bounce: 0.2 }} />
              )}
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="container-xl py-10">
        {tab === 'Overview' && (
          <Stagger className="grid lg:grid-cols-3 gap-5">
            {/* Stat cards */}
            <Item><StatCard icon={Calendar} label="Upcoming" value={upcoming.length} tint="from-cyan-500 to-cyan-300" /></Item>
            <Item><StatCard icon={Check}    label="Completed" value={past.filter((a) => a.status === 'Completed').length} tint="from-emerald-500 to-teal-400" /></Item>
            <Item><StatCard icon={Activity} label="Total visits" value={myAppts.length} tint="from-violet-500 to-pink-500" /></Item>

            {/* Next appointment large card */}
            <Item className="lg:col-span-2">
              <div className="card p-6 md:p-8 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-extrabold">Next appointment</h3>
                  <Link to="/appointment" className="text-sm text-cyan-700 font-bold hover:underline inline-flex items-center gap-1">
                    Book another <ArrowUpRight size={14} />
                  </Link>
                </div>
                {upcoming[0] ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Doctor</div>
                      <div className="font-display text-2xl font-extrabold mt-1">{upcoming[0].doctor}</div>
                      <div className="text-sm text-cyan-700 font-semibold">{upcoming[0].department}</div>
                      <div className="mt-3"><StatusBadge status={upcoming[0].status} /></div>
                    </div>
                    <div className="space-y-3">
                      <DetailRow icon={Calendar} label="Date" value={fmtDate(upcoming[0].date)} />
                      <DetailRow icon={Clock} label="Time" value={upcoming[0].time} />
                      <DetailRow icon={Phone} label="Phone" value={upcoming[0].phone} />
                    </div>
                  </div>
                ) : (
                  <EmptyState title="No upcoming visit" message="Book your next appointment now." icon={<Calendar />} />
                )}
              </div>
            </Item>

            {/* Quick links card */}
            <Item>
              <div className="card p-6 h-full bg-slate-950 text-white relative overflow-hidden">
                <div aria-hidden className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-cyan-500 mix-blend-screen blur-3xl opacity-50" />
                <div className="relative">
                  <Heart className="text-pink-400" />
                  <h4 className="font-display text-xl font-extrabold mt-3">Stay healthy</h4>
                  <p className="text-white/70 text-sm mt-2">Daily tips from our doctors.</p>
                  <Link to="/blog" className="mt-5 inline-flex items-center gap-1 text-sm text-cyan-300 font-bold">Read articles <ArrowUpRight size={14} /></Link>
                </div>
              </div>
            </Item>
          </Stagger>
        )}

        {tab === 'Appointments' && (
          <div className="space-y-5">
            <Reveal dir="up">
              <h2 className="font-display text-2xl font-extrabold">My appointments</h2>
              <p className="text-slate-500 text-sm mt-1">{myAppts.length} total — {upcoming.length} upcoming</p>
            </Reveal>

            {myAppts.length === 0 ? (
              <div className="card"><EmptyState title="No appointments yet" message="Book your first visit to get started." icon={<Calendar />} /></div>
            ) : (
              <Stagger className="space-y-3">
                {myAppts.map((a) => (
                  <Item key={a.id}>
                    <div className="card p-5 flex flex-col md:flex-row md:items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white flex items-center justify-center shrink-0 shadow-glow">
                        <Calendar />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">{a.doctor}</div>
                        <div className="text-sm text-cyan-700 font-semibold">{a.department}</div>
                        <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-4">
                          <span><Calendar size={12} className="inline mr-1" />{fmtDate(a.date)}</span>
                          <span><Clock size={12} className="inline mr-1" />{a.time}</span>
                        </div>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                  </Item>
                ))}
              </Stagger>
            )}
          </div>
        )}

        {tab === 'Profile' && (
          <Reveal dir="up">
            <div className="card p-6 md:p-10 max-w-2xl">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-extrabold">My profile</h2>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="btn-outline !py-2 !px-4 text-sm"><Pencil size={14} /> Edit</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => { setProfile({ name: user.name, phone: user.phone, email: user.email }); setEditing(false) }} className="btn-ghost !py-2 !px-4 text-sm">Cancel</button>
                    <button onClick={saveProfile} className="btn-primary !py-2 !px-4 text-sm"><Check size={14} /> Save</button>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500 via-violet-500 to-pink-500 text-white text-3xl font-black flex items-center justify-center shadow-glow">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-display text-2xl font-extrabold">{user?.name}</div>
                  <div className="text-sm text-slate-500">Patient since {fmtDate(user?.createdAt || new Date().toISOString())}</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mt-8">
                <Field icon={User} label="Full name" value={profile.name} editing={editing} onChange={(v) => setProfile({ ...profile, name: v })} />
                <Field icon={Mail} label="Email" value={profile.email} readOnly />
                <Field icon={Phone} label="Phone" value={profile.phone} editing={editing} onChange={(v) => setProfile({ ...profile, phone: v })} />
                <Field icon={MapPin} label="Account ID" value={user?.id} readOnly mono />
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="card card-hover p-6 relative overflow-hidden">
      <div aria-hidden className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${tint} opacity-25 blur-2xl`} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</div>
          <div className="font-display text-4xl font-extrabold mt-2">{value}</div>
        </div>
        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${tint} text-white flex items-center justify-center shadow-glow`}><Icon size={20} /></div>
      </div>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500"><Icon size={15} /></div>
      <div>
        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</div>
        <div className="font-bold text-slate-900">{value}</div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, value, editing, onChange, readOnly, mono }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-4 top-3.5 text-slate-400" />
        <input
          className={`input pl-11 ${readOnly || !editing ? 'bg-slate-50 cursor-not-allowed' : ''} ${mono ? 'font-mono text-xs' : ''}`}
          value={value || ''}
          readOnly={readOnly || !editing}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  )
}
