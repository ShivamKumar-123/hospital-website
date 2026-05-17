import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin, ArrowUpRight } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import PageHero from '../../components/public/PageHero.jsx'
import Reveal, { Stagger, Item } from '../../components/anim/Reveal.jsx'
import Tilt from '../../components/anim/Tilt.jsx'

import { useSeo } from '../../utils/seo.js'

export default function Contact() {
  useSeo({
    title: 'Contact MediCare+ — Address, Phone & Emergency Line',
    description: 'Get in touch with MediCare+. Find our address, 24/7 emergency phone, email, hours and social channels — or send a message directly from the contact form.',
    keywords: ['contact hospital', 'hospital address', 'emergency phone', 'hospital contact', 'MediCare contact'],
    path: '/contact'
  })

  const { settings } = useSettings()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast('Please complete all required fields', 'error'); return }
    toast('Message sent — we will reply soon!', 'success')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title={<>We're here, <span className="text-gradient">around the clock.</span></>}
        subtitle="Reach out for appointments, emergencies, insurance or general inquiries."
      />

      <section className="container-xl pb-20 grid lg:grid-cols-3 gap-6">
        <Stagger className="lg:col-span-1 space-y-4">
          {[
            { i: MapPin, t: 'Visit', d: settings.address, tint: 'from-brand-500 to-brand-300' },
            { i: Phone, t: 'Call', d: settings.phone, tint: 'from-emerald-500 to-teal-400' },
            { i: Mail, t: 'Email', d: settings.email, tint: 'from-violet-500 to-fuchsia-400' },
            { i: Clock, t: 'Hours', d: settings.hours, tint: 'from-amber-500 to-orange-400' }
          ].map((c) => (
            <Item key={c.t}>
              <Tilt max={6}>
                <div className="card card-hover p-5 flex gap-4 items-start">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${c.tint} text-white flex items-center justify-center text-xl shadow-glow shrink-0`}><c.i /></div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-ink-500">{c.t}</div>
                    <div className="text-ink-900 font-semibold mt-1 leading-snug">{c.d}</div>
                  </div>
                </div>
              </Tilt>
            </Item>
          ))}
          <Item>
            <div className="card p-5">
              <div className="text-[10px] uppercase tracking-widest font-bold text-ink-500">Follow</div>
              <div className="flex gap-2 mt-3">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="h-11 w-11 rounded-2xl bg-ink-50 hover:bg-gradient-to-br hover:from-brand-500 hover:to-violet-500 hover:text-white flex items-center justify-center transition"><Icon /></a>
                ))}
              </div>
            </div>
          </Item>
        </Stagger>

        <div className="lg:col-span-2 space-y-6">
          <Reveal dir="up">
            <form onSubmit={submit} className="card p-6 md:p-8 grid sm:grid-cols-2 gap-5">
              <h3 className="sm:col-span-2 font-display text-2xl font-extrabold">Send us a message</h3>
              <div><label className="label">Name</label><input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
              <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
              <div className="sm:col-span-2"><label className="label">Subject</label><input className="input" value={form.subject} onChange={(e) => set('subject', e.target.value)} /></div>
              <div className="sm:col-span-2"><label className="label">Message</label><textarea rows="5" className="input" value={form.message} onChange={(e) => set('message', e.target.value)} /></div>
              <button className="btn-primary sm:col-span-2 !py-3.5 !text-base shine">Send message <ArrowUpRight /></button>
            </form>
          </Reveal>

          <Reveal dir="up" delay={0.1}>
            <div className="card overflow-hidden">
              <iframe title="map" className="w-full h-80 border-0"
                src="https://www.google.com/maps?q=Manhattan+Hospital&output=embed" loading="lazy" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
