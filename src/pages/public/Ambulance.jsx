import { useState } from 'react'
import { PhoneCall, Clock, MapPin, Activity, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { addRecord } from '../../utils/storage.js'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import Reveal, { Stagger, Item } from '../../components/anim/Reveal.jsx'
import Tilt from '../../components/anim/Tilt.jsx'
import WaveDivider from '../../components/ui/WaveDivider.jsx'

import { useSeo } from '../../utils/seo.js'

export default function Ambulance() {
  useSeo({
    title: '24/7 Emergency Ambulance Service — MediCare+',
    description: '24/7 GPS-enabled ambulance service with paramedics on board. Request an ambulance online or call our emergency line — golden-hour response across the city.',
    keywords: ['ambulance', 'emergency ambulance', '24/7 ambulance', 'paramedic', 'trauma care', 'emergency response'],
    path: '/ambulance'
  })

  const { settings } = useSettings()
  const { toast } = useToast()
  const { items: live } = useLocalCollection('ambulance')
  const [form, setForm] = useState({ requester: '', phone: '', pickup: '', destination: 'MediCare+ ER', condition: '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.requester || !form.phone || !form.pickup) { toast('Please complete required fields', 'error'); return }
    addRecord('ambulance', { ...form, status: 'Pending', driver: '', vehicle: '' })
    addRecord('notifications', { title: 'Ambulance requested', message: `${form.requester} from ${form.pickup}`, type: 'emergency', read: false })
    toast('Ambulance dispatch in progress!', 'success')
    setForm({ requester: '', phone: '', pickup: '', destination: 'MediCare+ ER', condition: '' })
  }

  return (
    <>
      {/* Hero — dramatic red emergency */}
      <section className="relative overflow-hidden pt-10 md:pt-16 pb-24 text-white">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-rose-600 via-red-600 to-rose-700" />
        <div aria-hidden className="absolute inset-0">
          <div className="absolute -top-40 -left-20 h-96 w-96 rounded-full bg-rose-400 mix-blend-screen blur-[120px] opacity-50" />
          <div className="absolute top-1/3 right-0 h-[28rem] w-[28rem] rounded-full bg-orange-400 mix-blend-screen blur-[120px] opacity-40" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-grid bg-grid opacity-10" />

        <div className="container-xl relative grid lg:grid-cols-2 gap-10 items-center">
          <Reveal dir="right">
            <span className="chip bg-white/15 backdrop-blur border border-white/30 text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-blink" /> 24/7 Emergency
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold mt-4 leading-[0.95]">
              Ambulance.<br /><span className="text-amber-200">8 minutes.</span>
            </h1>
            <p className="text-white/85 mt-5 max-w-xl text-lg">Paramedic-staffed, fully equipped — cardiac monitors, ventilators and oxygen, dispatched the moment you call.</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href={`tel:${settings.emergency}`} className="btn bg-white text-rose-600 hover:-translate-y-0.5 !py-3.5 !px-6 font-bold shine">
                <PhoneCall /> Call {settings.emergency}
              </a>
              <a href="#request" className="btn-glass !py-3.5 !px-6">Request online <ArrowUpRight /></a>
            </div>
          </Reveal>

          <Reveal dir="left" delay={0.2}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { i: Clock, l: 'Response', v: '8 min' },
                { i: Activity, l: 'Active units', v: '14' },
                { i: MapPin, l: 'Coverage', v: '40 km' },
                { i: CheckCircle, l: 'Paramedics', v: '36' }
              ].map((s) => (
                <Tilt key={s.l} max={10}>
                  <div className="rounded-2xl p-5 bg-white/10 border border-white/20 backdrop-blur-xl">
                    <s.i className="text-2xl mb-2 text-amber-200" />
                    <div className="font-display text-4xl font-extrabold">{s.v}</div>
                    <div className="text-white/70 text-sm">{s.l}</div>
                  </div>
                </Tilt>
              ))}
            </div>
          </Reveal>
        </div>
        {/* Dramatic wave: red emergency hero → light form section */}
        <WaveDivider variant="layered" fill="#f7f8fb" position="bottom" height={120} />
      </section>

      <section id="request" className="container-xl py-20 grid lg:grid-cols-3 gap-6">
        <Reveal dir="up" className="lg:col-span-2">
          <form onSubmit={submit} className="card p-6 md:p-8 grid sm:grid-cols-2 gap-5">
            <h3 className="sm:col-span-2 font-display text-2xl font-extrabold">Ambulance request</h3>
            <div><label className="label">Requester name *</label><input className="input" value={form.requester} onChange={(e) => set('requester', e.target.value)} /></div>
            <div><label className="label">Phone *</label><input className="input" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
            <div className="sm:col-span-2"><label className="label">Pickup location *</label><input className="input" value={form.pickup} onChange={(e) => set('pickup', e.target.value)} /></div>
            <div><label className="label">Destination</label><input className="input" value={form.destination} onChange={(e) => set('destination', e.target.value)} /></div>
            <div><label className="label">Patient condition</label><input className="input" value={form.condition} onChange={(e) => set('condition', e.target.value)} placeholder="e.g. Chest pain" /></div>
            <button className="btn-primary sm:col-span-2 !py-3.5 !text-base">Request ambulance <ArrowUpRight /></button>
          </form>
        </Reveal>

        <Reveal dir="left" delay={0.2}>
          <div className="card p-6 sticky top-28">
            <h4 className="font-display text-xl font-extrabold flex items-center gap-2"><AlertTriangle className="text-rose-500" /> Live emergencies</h4>
            <Stagger className="mt-5 space-y-3">
              {live.slice(0, 5).map((a) => (
                <Item key={a.id}>
                  <div className="rounded-2xl p-4 bg-ink-50/60 border border-ink-100">
                    <div className="text-sm font-bold text-ink-900">{a.pickup} → {a.destination}</div>
                    <div className="text-xs text-ink-500 mt-1 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-blink" />
                      {a.condition || 'Emergency'} · {a.status}
                    </div>
                  </div>
                </Item>
              ))}
              {!live.length && <p className="text-ink-500 text-sm">No active emergencies. Stay safe.</p>}
            </Stagger>
          </div>
        </Reveal>
      </section>
    </>
  )
}
