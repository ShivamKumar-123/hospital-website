import { Users, User, Calendar, IndianRupee, AlertTriangle, Activity, ArrowUpRight, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import { useCountUp } from '../../hooks/useCountUp.js'
import { fmtDate } from '../../utils/format.js'
import Reveal, { Stagger, Item } from '../../components/anim/Reveal.jsx'

const StatCard = ({ icon: Icon, label, value, trend, tint }) => {
  const v = useCountUp(value)
  return (
    <div className="relative card card-hover p-5 overflow-hidden">
      <div aria-hidden className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${tint} opacity-20 blur-2xl`} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-ink-500">{label}</div>
          <div className="font-display text-4xl font-extrabold text-ink-900 mt-2">{v.toLocaleString()}</div>
          {trend && <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1"><TrendingUp />{trend}</div>}
        </div>
        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${tint} text-white flex items-center justify-center text-xl shadow-glow`}><Icon /></div>
      </div>
    </div>
  )
}

const appointmentsByMonth = [
  { m: 'Jan', a: 220 }, { m: 'Feb', a: 280 }, { m: 'Mar', a: 320 }, { m: 'Apr', a: 290 },
  { m: 'May', a: 360 }, { m: 'Jun', a: 410 }, { m: 'Jul', a: 480 }, { m: 'Aug', a: 520 },
  { m: 'Sep', a: 470 }, { m: 'Oct', a: 510 }, { m: 'Nov', a: 540 }, { m: 'Dec', a: 600 }
]
const revenueByMonth = appointmentsByMonth.map((x) => ({ ...x, r: x.a * 18000 }))
const COLORS = ['#06b6e4', '#8b5cf6', '#ec4899', '#22d3ee', '#a78bfa']

export default function Overview() {
  const { items: patients } = useLocalCollection('patients')
  const { items: doctors } = useLocalCollection('doctors')
  const { items: appointments } = useLocalCollection('appointments')
  const { items: ambulance } = useLocalCollection('ambulance')
  const { items: notifs } = useLocalCollection('notifications')

  const totalRevenue = revenueByMonth.reduce((s, x) => s + x.r, 0)

  const deptCounts = appointments.reduce((acc, a) => { acc[a.department] = (acc[a.department] || 0) + 1; return acc }, {})
  const deptData = Object.entries(deptCounts).map(([name, value]) => ({ name, value }))
  const recent = [...notifs].slice(0, 6)

  return (
    <div className="space-y-6">
      <Reveal dir="up">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow">Overview</span>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
              Welcome back, <span className="text-gradient">Admin.</span>
            </h1>
            <p className="text-ink-500 text-sm mt-1">Here's what's happening at Saubhagyam Hospital today.</p>
          </div>
        </div>
      </Reveal>

      {/* Stats — bento style */}
      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Item><StatCard icon={Users} label="Total patients" value={patients.length * 124 + 1240} trend="+12% MoM" tint="from-brand-500 to-brand-300" /></Item>
        <Item><StatCard icon={User} label="Active doctors" value={doctors.length} trend="+2 new" tint="from-emerald-500 to-teal-400" /></Item>
        <Item><StatCard icon={Calendar} label="Appointments" value={appointments.length * 36 + 230} trend="+8% w/w" tint="from-amber-500 to-orange-400" /></Item>
        <Item><StatCard icon={IndianRupee} label="Revenue (₹)" value={totalRevenue} trend="+15% YoY" tint="from-violet-500 to-pink-500" /></Item>
      </Stagger>

      {/* Charts row — bento */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Reveal dir="up" className="lg:col-span-2">
          <div className="card p-6 h-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-extrabold">Appointments trend</h3>
                <p className="text-xs text-ink-500 mt-0.5">Last 12 months</p>
              </div>
              <span className="chip-brand">● Live</span>
            </div>
            <div className="h-72 mt-5">
              <ResponsiveContainer>
                <AreaChart data={appointmentsByMonth}>
                  <defs>
                    <linearGradient id="grad-a" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#06b6e4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" />
                  <XAxis dataKey="m" stroke="#9aa3b2" fontSize={12} />
                  <YAxis stroke="#9aa3b2" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef0f6' }} />
                  <Area type="monotone" dataKey="a" stroke="#8b5cf6" strokeWidth={3} fill="url(#grad-a)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>

        <Reveal dir="up" delay={0.1}>
          <div className="card p-6 h-full">
            <h3 className="font-display text-lg font-extrabold">Department share</h3>
            <div className="h-72 mt-3">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={deptData.length ? deptData : [{ name: 'No data', value: 1 }]} dataKey="value" cx="50%" cy="50%" outerRadius={88} innerRadius={50} paddingAngle={3}>
                    {(deptData.length ? deptData : [{}]).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef0f6' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Reveal dir="up" className="lg:col-span-2">
          <div className="card p-6 h-full">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-extrabold">Revenue</h3>
              <span className="text-xs text-ink-500">Annual</span>
            </div>
            <div className="h-64 mt-3">
              <ResponsiveContainer>
                <BarChart data={revenueByMonth}>
                  <defs>
                    <linearGradient id="grad-r" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6e4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" />
                  <XAxis dataKey="m" stroke="#9aa3b2" fontSize={12} />
                  <YAxis stroke="#9aa3b2" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef0f6' }} />
                  <Bar dataKey="r" fill="url(#grad-r)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>

        <Reveal dir="up" delay={0.1}>
          <div className="card p-6 h-full">
            <h3 className="font-display text-lg font-extrabold flex items-center gap-2"><Activity /> Activity</h3>
            <div className="mt-4 space-y-4 max-h-72 overflow-y-auto pr-1">
              {recent.map((n) => (
                <div key={n.id} className="flex gap-3 group">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === 'emergency' ? 'bg-rose-100 text-rose-600'
                    : n.type === 'appointment' ? 'bg-amber-100 text-amber-600'
                    : 'bg-brand-100 text-brand-600'
                  }`}>
                    {n.type === 'emergency' ? <AlertTriangle /> : <Calendar />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink-900 text-sm truncate">{n.title}</div>
                    <div className="text-ink-500 text-xs line-clamp-1">{n.message}</div>
                    <div className="text-ink-400 text-[11px] mt-0.5">{fmtDate(n.createdAt)}</div>
                  </div>
                </div>
              ))}
              {!recent.length && <p className="text-ink-500 text-sm">No activity yet.</p>}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Bottom quick stats */}
      <Stagger className="grid sm:grid-cols-3 gap-4">
        <Item>
          <div className="card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center text-xl shadow-glow"><AlertTriangle /></div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-ink-500">Emergencies</div>
              <div className="font-display text-3xl font-extrabold">{ambulance.filter((a) => a.status !== 'Completed').length}</div>
            </div>
          </div>
        </Item>
        <Item>
          <div className="card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 text-white flex items-center justify-center text-xl shadow-glow"><Calendar /></div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-ink-500">Pending approvals</div>
              <div className="font-display text-3xl font-extrabold">{appointments.filter((a) => a.status === 'Pending').length}</div>
            </div>
          </div>
        </Item>
        <Item>
          <div className="card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white flex items-center justify-center text-xl shadow-glow"><User /></div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-ink-500">On duty</div>
              <div className="font-display text-3xl font-extrabold">{doctors.filter((d) => d.status === 'Available').length}</div>
            </div>
          </div>
        </Item>
      </Stagger>
    </div>
  )
}
