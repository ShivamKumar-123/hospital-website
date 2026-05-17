import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  ArrowUpRight, PhoneCall, Heart, Shield, Users, Award,
  Star, TrendingUp, ShieldCheck, Sparkles, Zap, Brain,
  Activity, Stethoscope, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import { useSettings } from '../../context/SettingsContext.jsx'
import { useCountUp } from '../../hooks/useCountUp.js'
import Reveal, { Stagger, Item } from '../../components/anim/Reveal.jsx'
import Tilt from '../../components/anim/Tilt.jsx'
import WaveDivider from '../../components/ui/WaveDivider.jsx'

const Counter = ({ to, suffix = '' }) => {
  const v = useCountUp(to)
  return <span>{v.toLocaleString()}{suffix}</span>
}

const TRUST_BADGES = [
  { name: 'JCI Accredited',   tag: 'Joint Commission Intl.' },
  { name: 'NABH Certified',   tag: 'Hospital Accreditation' },
  { name: 'ISO 9001 : 2015',  tag: 'Quality Management' },
  { name: 'AHA Trained',      tag: 'American Heart Assoc.' },
  { name: 'NABL Labs',        tag: 'Laboratory Accreditation' }
]

const HERO_SLIDES = [
  {
    id: 'human',
    badge: { icon: Sparkles, text: 'Trusted by 50,000+ patients · 24/7 Emergency', dot: '#A6FF5D' },
    head1: 'Healthcare that',
    head2: 'feels human.',
    gradient: 'from-cyan-300 via-violet-300 to-[#A6FF5D]',
    subtitle: 'World-class specialists, modern technology and round-the-clock emergency care — all under one roof.',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=2200&q=80'
  },
  {
    id: 'emergency',
    badge: { icon: Activity, text: 'Level-1 Trauma Center · Helipad ready', dot: '#fb7185' },
    head1: 'Emergency care,',
    head2: 'in 8 minutes.',
    gradient: 'from-rose-300 via-orange-300 to-amber-300',
    subtitle: 'Paramedic-staffed ambulances with cardiac monitors and ventilators — dispatched the moment you call.',
    image: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=2200&q=80'
  },
  {
    id: 'tech',
    badge: { icon: Brain, text: 'Robotic surgery · 3T MRI · AI-augmented diagnostics', dot: '#c4b5fd' },
    head1: 'Advanced tech,',
    head2: 'precise outcomes.',
    gradient: 'from-violet-300 via-fuchsia-300 to-pink-300',
    subtitle: 'Robotic-assisted procedures, 3T MRI imaging and AI-augmented reads — for outcomes you can count on.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=2200&q=80'
  },
  {
    id: 'specialists',
    badge: { icon: Stethoscope, text: '120+ consultants · 18 years average experience', dot: '#67e8f9' },
    head1: 'Specialists who',
    head2: 'truly care.',
    gradient: 'from-emerald-300 via-cyan-300 to-blue-300',
    subtitle: 'Fellowship-trained doctors from leading institutions — every patient gets a senior consultant, not a trainee.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=2200&q=80'
  }
]

const SLIDE_DURATION = 7000 // ms

import { useSeo } from '../../utils/seo.js'

export default function Home() {
  useSeo({
    title: 'MediCare+ — Premium Multi-Specialty Hospital & 24/7 Emergency Care',
    description: 'World-class specialists, modern technology and round-the-clock emergency care under one roof. Book appointments, find doctors and access expert health insights.',
    keywords: ['hospital', 'multi-specialty', 'emergency care', 'doctor appointment', 'health checkup', 'MediCare'],
    path: '/'
  })

  const { items: departments } = useLocalCollection('departments')
  const { items: doctors } = useLocalCollection('doctors')
  const { items: testimonials } = useLocalCollection('testimonials')
  const { settings } = useSettings()
  const approved = testimonials.filter((t) => t.approved)
  const [tIdx, setTIdx] = useState(0)

  // Hero slider state
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const current = HERO_SLIDES[slide]

  useEffect(() => {
    if (!approved.length) return
    const t = setInterval(() => setTIdx((i) => (i + 1) % approved.length), 5000)
    return () => clearInterval(t)
  }, [approved.length])

  // Auto-rotate hero slides
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), SLIDE_DURATION)
    return () => clearInterval(t)
  }, [paused])

  const goPrev = () => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  const goNext = () => setSlide((s) => (s + 1) % HERO_SLIDES.length)

  return (
    <>
      {/* ============================================================
          HERO SLIDER — 4 slides, Ken Burns bg zoom, progress bars
          ============================================================ */}
      <header
        className="relative bg-slate-950 text-white flex flex-col items-center overflow-hidden pb-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ---------- Background image carousel with Ken Burns ---------- */}
        <div aria-hidden className="absolute inset-0 bg-slate-950">
          <AnimatePresence mode="sync">
            <motion.img
              key={current.id}
              src={current.image}
              alt=""
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 0.85, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{
                opacity: { duration: 1.4, ease: 'easeInOut' },
                scale:   { duration: SLIDE_DURATION / 1000, ease: 'linear' }
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Translucent darkening overlay — keeps text readable but image stays visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/60 to-slate-950/85" />

          {/* Transparent radial color tints — NO opaque bg color */}
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                'radial-gradient(at 15% 10%, rgba(45,204,255,0.25), transparent 55%),' +
                'radial-gradient(at 85% 0%,  rgba(139,92,246,0.28), transparent 55%),' +
                'radial-gradient(at 60% 90%, rgba(236,72,153,0.22), transparent 55%)'
            }}
          />

          {/* Subtle grid */}
          <div className="absolute inset-0 bg-grid opacity-[0.06]" />

          {/* Color blobs — mix-blend-screen so they accent the image rather than cover it */}
          <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-cyan-500 mix-blend-screen blur-[120px] opacity-30 animate-float-slow" />
          <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-violet-500 mix-blend-screen blur-[120px] opacity-25 animate-float-slow" style={{ animationDelay: '3s' }} />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-pink-500 mix-blend-screen blur-[120px] opacity-20 animate-float-slow" style={{ animationDelay: '5s' }} />
        </div>

        {/* ---------- Manual arrows (desktop only) ---------- */}
        <button
          onClick={goPrev}
          aria-label="Previous slide"
          className="hidden lg:flex absolute left-6 xl:left-12 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/5 border border-white/15 backdrop-blur text-white hover:bg-white/15 hover:scale-110 transition items-center justify-center"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goNext}
          aria-label="Next slide"
          className="hidden lg:flex absolute right-6 xl:right-12 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/5 border border-white/15 backdrop-blur text-white hover:bg-white/15 hover:scale-110 transition items-center justify-center"
        >
          <ChevronRight size={20} />
        </button>

        <div className="relative z-10 w-full flex flex-col items-center px-4">
          {/* ---------- Animated badge + headline + subtitle (per slide) ---------- */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center w-full"
            >
              {/* Rainbow rotating badge — text rotates with slide */}
              <div className="rainbow relative z-0 bg-white/15 overflow-hidden p-px flex items-center justify-center rounded-full mt-32 md:mt-40">
                <div className="flex items-center justify-center gap-3 pl-4 pr-6 py-3 text-white rounded-full font-medium bg-slate-900/85 backdrop-blur">
                  <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                    <span
                      className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                      style={{ backgroundColor: current.badge.dot }}
                    />
                    <span
                      className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ backgroundColor: current.badge.dot }}
                    />
                  </div>
                  <current.badge.icon size={14} className="text-white/90" />
                  <span className="text-xs tracking-wide">{current.badge.text}</span>
                </div>
              </div>

              {/* Headline — gradient on line 2 changes per slide */}
              <h1 className="font-display text-4xl md:text-[64px]/[78px] lg:text-[80px]/[92px] text-center max-w-5xl mt-6 md:mt-8 font-extrabold tracking-tight">
                {current.head1}{' '}
                <span className={`bg-gradient-to-r ${current.gradient} bg-clip-text text-transparent`}>
                  {current.head2}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm md:text-base text-white/70 text-center max-w-xl mt-5">
                {current.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* ---------- Static CTAs (never change between slides) ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-3 mt-8 justify-center"
          >
            <Link to="/appointment"
              className="bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-slate-900 font-semibold px-6 py-3 rounded-full text-sm transition cursor-pointer group flex items-center gap-2">
              <Sparkles size={14} className="text-slate-900" />
              <span className="slide-text">
                <span>Book appointment today</span>
                <span>Book appointment today</span>
              </span>
            </Link>

            <div className="bg-white/15 hover:bg-white/10 p-px flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100">
              <a href={`tel:${settings.emergency}`}
                className="px-6 py-3 text-sm text-white rounded-full bg-white/5 backdrop-blur cursor-pointer flex items-center gap-2">
                <PhoneCall size={14} className="text-rose-300" />
                <span className="hidden sm:inline">Emergency · </span>{settings.emergency}
              </a>
            </div>
          </motion.div>

          {/* ---------- Slide progress indicators ---------- */}
          <div className="mt-12 flex items-center gap-3">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group flex items-center gap-2"
              >
                <span className="text-[10px] font-bold tracking-widest text-white/40 group-hover:text-white/70 transition w-5">
                  0{i + 1}
                </span>
                <span className={`relative h-1 rounded-full overflow-hidden transition-all ${i === slide ? 'w-16 bg-white/20' : 'w-8 bg-white/15 group-hover:bg-white/25'}`}>
                  {i === slide && (
                    <motion.span
                      key={`${current.id}-bar`}
                      initial={{ width: '0%' }}
                      animate={{ width: paused ? '0%' : '100%' }}
                      transition={{ duration: paused ? 0 : SLIDE_DURATION / 1000, ease: 'linear' }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-300 to-[#A6FF5D]"
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* ---------- Trust badges ---------- */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-row items-center justify-center gap-x-10 gap-y-4 md:gap-x-14 mx-auto mt-16 md:mt-20 max-w-5xl flex-wrap"
          >
            {TRUST_BADGES.map((b) => (
              <div key={b.name} className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-[#A6FF5D] shrink-0" />
                <div className="leading-tight">
                  <div className="text-sm font-bold text-white/85">{b.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">{b.tag}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* ---------- Scroll down indicator ---------- */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col items-center gap-3 mt-16 md:mt-20 animate-bounce cursor-pointer"
          >
            <div className="h-10 w-6 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
              <div className="h-2 w-1 rounded-full bg-white/80" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">Scroll down</p>
          </motion.div>
        </div>

        {/* Dramatic wave: dark hero → light page */}
        <WaveDivider variant="layered" fill="#f7f8fb" height={120} className="relative z-10 mt-12" />
      </header>

      {/* ============================================================
          BENTO STATS
          ============================================================ */}
      <section className="section relative bg-white">
        <div className="container-xl">
          <Reveal dir="up" className="text-center max-w-3xl mx-auto">
            <span className="eyebrow">Why us</span>
            <h2 className="h-section mt-3">Numbers that tell our story.</h2>
            <p className="sub mx-auto">Two decades, hundreds of specialists, millions of moments that mattered.</p>
          </Reveal>

          <Stagger className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {[
            { icon: Users, label: 'Expert doctors', value: 120, suffix: '+', tint: 'from-cyan-500 to-cyan-300' },
            { icon: Heart, label: 'Lives touched', value: 50000, suffix: '+', tint: 'from-pink-500 to-rose-400' },
            { icon: Shield, label: 'Specialties', value: 25, suffix: '+', tint: 'from-violet-500 to-indigo-400' },
            { icon: Award, label: 'Years of trust', value: 18, suffix: '', tint: 'from-amber-500 to-orange-400' }
          ].map((s) => (
            <Item key={s.label}>
              <Tilt max={8} className="card card-hover p-6 h-full">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.tint} text-white flex items-center justify-center text-xl mb-4 shadow-glow`}>
                  <s.icon />
                </div>
                <div className="font-display text-4xl md:text-5xl font-extrabold text-slate-900">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-slate-500 text-sm mt-1">{s.label}</div>
                <div className="mt-4 flex items-center text-xs text-emerald-600 font-semibold">
                  <TrendingUp size={14} className="mr-1" /> +12% YoY
                </div>
              </Tilt>
            </Item>
          ))}
          </Stagger>
        </div>
      </section>

      {/* ============================================================
          BENTO — Why MediCare+ (premium 3-col grid with mixed sizes)
          (same white bg as Stats — flows visually, wave comes after)
          ============================================================ */}
      <section className="section relative bg-white overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        </div>

        <div className="container-xl relative">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Why MediCare+</span>
            <h2 className="h-section mt-3">Built for outcomes,<br /><span className="text-gradient-cool">designed for humans.</span></h2>
            <p className="sub mx-auto">Modern medicine meets thoughtful design — every detail engineered to make your care faster, smarter and kinder.</p>
          </Reveal>

          <Stagger className="mt-14 grid md:grid-cols-3 gap-4 md:gap-5">
            {/* BIG card — AI diagnostics, spans 2 cols and 2 rows */}
            <Item className="md:col-span-2 md:row-span-2">
              <Tilt max={4}>
                <div className="card card-hover h-full p-8 md:p-10 relative overflow-hidden bg-slate-950 text-white border-slate-800">
                  <div aria-hidden className="absolute inset-0">
                    <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-cyan-500 mix-blend-screen blur-[80px] opacity-50" />
                    <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-violet-500 mix-blend-screen blur-[80px] opacity-40" />
                    <div className="absolute inset-0 bg-grid opacity-[0.08]" />
                  </div>
                  <div className="relative">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-glow">
                      <Brain size={26} />
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl font-extrabold mt-6 leading-tight">
                      AI-assisted diagnostics
                    </h3>
                    <p className="text-white/70 mt-3 max-w-md">
                      Our radiology and pathology workflows are augmented with FDA-cleared AI — faster reads, fewer misses, better outcomes.
                    </p>

                    {/* Mini metric bars */}
                    <div className="mt-8 space-y-3 max-w-sm">
                      {[
                        { l: 'Read time', v: '−68%', w: '85%' },
                        { l: 'Sensitivity', v: '+12%', w: '70%' },
                        { l: 'False positives', v: '−40%', w: '55%' }
                      ].map((m) => (
                        <div key={m.l}>
                          <div className="flex justify-between text-xs text-white/60 mb-1">
                            <span>{m.l}</span>
                            <span className="font-bold text-cyan-300">{m.v}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: m.w }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Tilt>
            </Item>

            {/* Card 2 — 60-second booking */}
            <Item>
              <Tilt max={6}>
                <div className="card card-hover h-full p-6 relative overflow-hidden">
                  <div aria-hidden className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-cyan-100 blur-2xl" />
                  <div className="relative">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-300 flex items-center justify-center text-white shadow-glow">
                      <Zap size={20} />
                    </div>
                    <h4 className="font-display text-xl font-extrabold mt-4">60-second booking</h4>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                      Pick a doctor, slot and confirm — under a minute, no calls needed.
                    </p>
                  </div>
                </div>
              </Tilt>
            </Item>

            {/* Card 3 — 24/7 care */}
            <Item>
              <Tilt max={6}>
                <div className="card card-hover h-full p-6 relative overflow-hidden">
                  <div aria-hidden className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-rose-100 blur-2xl" />
                  <div className="relative">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-glow">
                      <Activity size={20} />
                    </div>
                    <h4 className="font-display text-xl font-extrabold mt-4">24/7 emergency</h4>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                      Level-1 trauma center, helipad-ready, 8-minute average ambulance dispatch.
                    </p>
                  </div>
                </div>
              </Tilt>
            </Item>

            {/* Card 4 — spans 2 cols, top consultants */}
            <Item className="md:col-span-2">
              <Tilt max={4}>
                <div className="card card-hover h-full p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
                  <div aria-hidden className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-violet-100 blur-3xl" />
                  <div className="relative shrink-0">
                    <div className="flex -space-x-3">
                      {['1612349317150-e413f6a5b16d', '1559839734-2b71ea197ec2', '1622253692010-333f2da6031d', '1594824476967-48c8b964273f'].map((id, i) => (
                        <img key={id} src={`https://images.unsplash.com/photo-${id}?w=120`} className="h-14 w-14 rounded-2xl object-cover ring-4 ring-white" alt="" />
                      ))}
                    </div>
                  </div>
                  <div className="relative flex-1">
                    <h4 className="font-display text-xl md:text-2xl font-extrabold">120+ consultants. 18 years average.</h4>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                      Fellowship-trained specialists from leading institutions worldwide — every patient gets a senior consultant, not a trainee.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {['Cardiology', 'Oncology', 'Neuro', 'Ortho', '+18 more'].map((t) => (
                        <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Tilt>
            </Item>
          </Stagger>
        </div>
      </section>

      <WaveDivider variant="bumpy" fill="#f1f5f9" />

      {/* ============================================================
          DEPARTMENTS
          ============================================================ */}
      <section className="section relative overflow-hidden bg-slate-100">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50/40 to-transparent" />
        <div className="container-xl relative">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <Reveal dir="up">
              <div>
                <span className="eyebrow">Departments</span>
                <h2 className="h-section mt-3">25+ specialties.<br /><span className="text-gradient-cool">One hospital.</span></h2>
              </div>
            </Reveal>
            <Reveal dir="left">
              <Link to="/departments" className="btn-dark">View all <ArrowUpRight size={16} /></Link>
            </Reveal>
          </div>

          <Stagger className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.slice(0, 6).map((d, i) => (
              <Item key={d.id}>
                <Tilt max={5}>
                  <div className="card card-hover overflow-hidden group h-full">
                    <div className="relative h-56 overflow-hidden">
                      <img src={d.image} alt={d.name} className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                      <span className="absolute top-4 left-4 chip bg-white/90 backdrop-blur text-slate-800 font-bold">0{i + 1}</span>
                      <span className="absolute top-4 right-4 chip bg-emerald-500 text-white">{d.availability}</span>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="font-display text-2xl font-extrabold">{d.name}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{d.description}</p>
                      <div className="flex items-center justify-between mt-5">
                        <span className="text-xs text-slate-500 flex items-center gap-1"><Users size={12} /> {d.doctors} specialists</span>
                        <Link to="/departments" className="inline-flex items-center gap-1 text-cyan-600 font-bold text-sm group-hover:gap-2 transition">
                          Explore <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Wave: slate departments → white doctors */}
      <WaveDivider variant="bumpy" fill="#ffffff" />

      {/* ============================================================
          DOCTORS
          ============================================================ */}
      <section className="section relative bg-white">
        <div className="container-xl">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Our specialists</span>
            <h2 className="h-section mt-3">Trusted hands.<br /><span className="text-gradient-cool">Brilliant minds.</span></h2>
            <p className="sub mx-auto">A team obsessed with outcomes, empathy and clinical excellence.</p>
          </Reveal>

          <Stagger className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {doctors.slice(0, 4).map((d) => (
              <Item key={d.id}>
                <Tilt max={6}>
                  <div className="card card-hover overflow-hidden group relative">
                    <div className="relative h-72 overflow-hidden">
                      <img src={d.photo} alt={d.name} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <span className="absolute top-3 right-3 chip bg-emerald-500/90 backdrop-blur text-white">● {d.status}</span>
                    </div>
                    <div className="p-5">
                      <h4 className="font-display text-lg font-extrabold text-slate-900">{d.name}</h4>
                      <p className="text-cyan-600 text-sm font-semibold">{d.department}</p>
                      <p className="text-xs text-slate-500 mt-1">{d.experience} years · {d.qualification}</p>
                      <Link to="/appointment" state={{ doctor: d.name, department: d.department }} className="mt-4 w-full btn-dark !py-2 !text-xs">
                        Book visit <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </Tilt>
              </Item>
            ))}
          </Stagger>

          <div className="text-center mt-12">
            <Link to="/doctors" className="btn-outline !py-3 !px-6">Meet all doctors <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Wave: white doctors → slate ambulance section */}
      <WaveDivider variant="curve" fill="#f1f5f9" />

      {/* ============================================================
          EMERGENCY / AMBULANCE — dark band
          ============================================================ */}
      <section className="section relative bg-slate-100">
        <div className="container-xl">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 text-white p-10 md:p-16">
            <div aria-hidden className="absolute inset-0 mesh-dark-bg opacity-90" />
            <div aria-hidden className="absolute inset-0 bg-grid opacity-10" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <Reveal dir="right">
                <div>
                  <span className="chip bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <span className="h-2 w-2 rounded-full bg-rose-400 animate-blink" /> 24/7 Emergency
                  </span>
                  <h3 className="font-display text-4xl md:text-6xl font-extrabold mt-4 leading-[0.95]">
                    Ambulance at your door<br /><span className="bg-gradient-to-r from-cyan-300 to-[#A6FF5D] bg-clip-text text-transparent">in 8 minutes.</span>
                  </h3>
                  <p className="text-white/70 mt-5 max-w-lg">Paramedic-staffed units with cardiac monitors, ventilators and oxygen — dispatched the moment you call.</p>
                  <div className="flex flex-wrap gap-3 mt-7">
                    <a href={`tel:${settings.emergency}`} className="btn bg-white text-slate-900 hover:-translate-y-0.5 !py-3.5 !px-6 font-bold">
                      <PhoneCall size={16} /> Call {settings.emergency}
                    </a>
                    <Link to="/ambulance" className="btn-glass !py-3.5 !px-6">Request online <ArrowUpRight size={16} /></Link>
                  </div>
                </div>
              </Reveal>
              <Reveal dir="left" delay={0.2}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: 'Response', v: '8 min', sub: 'avg city-wide' },
                    { l: 'Active units', v: '14', sub: 'right now' },
                    { l: 'Paramedics', v: '36', sub: 'on rotation' },
                    { l: 'Helipad', v: 'Yes', sub: 'rooftop' }
                  ].map((s) => (
                    <Tilt key={s.l} max={10}>
                      <div className="rounded-2xl p-5 bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition">
                        <div className="text-xs uppercase tracking-widest text-white/50">{s.l}</div>
                        <div className="font-display text-4xl font-extrabold mt-2 bg-gradient-to-r from-cyan-300 to-[#A6FF5D] bg-clip-text text-transparent">{s.v}</div>
                        <div className="text-xs text-white/50 mt-1">{s.sub}</div>
                      </div>
                    </Tilt>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Wave: slate ambulance section → white packages */}
      <WaveDivider variant="wave" fill="#ffffff" />

      {/* ============================================================
          HEALTH PACKAGES
          ============================================================ */}
      <section className="section relative bg-white">
        <div className="container-xl">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <Reveal dir="up">
              <div>
                <span className="eyebrow">Preventive care</span>
                <h2 className="h-section mt-3">Health, packaged smartly.</h2>
              </div>
            </Reveal>
            <Reveal dir="left">
              <Link to="/packages" className="btn-outline">All packages <ArrowUpRight size={16} /></Link>
            </Reveal>
          </div>
          <Stagger className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: 'Full Body', tests: '60+ tests', price: 1999, tint: 'from-cyan-500 to-cyan-300' },
              { name: 'Heart Health', tests: 'ECG · ECHO · Lipid', price: 2999, tint: 'from-rose-500 to-pink-400', popular: true },
              { name: 'Women Wellness', tests: 'Pap · Mammogram · Hormone', price: 2499, tint: 'from-violet-500 to-fuchsia-400' }
            ].map((p) => (
              <Item key={p.name}>
                <div className={`card card-hover p-7 relative overflow-hidden ${p.popular ? 'ring-2 ring-violet-500 shadow-glowV' : ''}`}>
                  {p.popular && <span className="absolute top-5 right-5 chip bg-gradient-to-r from-violet-500 to-pink-500 text-white">★ Popular</span>}
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${p.tint} shadow-glow`} />
                  <h4 className="font-display text-2xl font-extrabold mt-5">{p.name}</h4>
                  <p className="text-slate-500 text-sm mt-1">{p.tests}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-display text-5xl font-extrabold text-slate-900">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="text-slate-500">/ visit</span>
                  </div>
                  <Link to="/packages" className={`mt-6 w-full ${p.popular ? 'btn-primary' : 'btn-dark'}`}>
                    Book package <ArrowUpRight size={16} />
                  </Link>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Wave: white packages → slate testimonials */}
      {approved.length > 0 && <WaveDivider variant="bumpy" fill="#f1f5f9" />}

      {/* ============================================================
          TESTIMONIALS
          ============================================================ */}
      {approved.length > 0 && (
        <section className="section relative overflow-hidden bg-slate-100">
          <div className="container-xl">
            <Reveal className="text-center max-w-2xl mx-auto">
              <span className="eyebrow">Loved by patients</span>
              <h2 className="h-section mt-3">Real stories.<br /><span className="text-gradient-cool">Real recoveries.</span></h2>
            </Reveal>
            <div className="relative mt-14 max-w-4xl mx-auto">
              <motion.div key={approved[tIdx]?.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="card p-8 md:p-12 relative overflow-hidden">
                <div aria-hidden className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-cyan-100 blur-3xl" />
                <div aria-hidden className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-violet-100 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(approved[tIdx].rating)].map((_, i) => <Star key={i} className="fill-current" size={16} />)}
                  </div>
                  <p className="font-display text-2xl md:text-3xl font-bold mt-4 leading-snug text-slate-900">
                    "{approved[tIdx].message}"
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <img src={approved[tIdx].photo} alt={approved[tIdx].name} className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow" />
                    <div>
                      <div className="font-bold">{approved[tIdx].name}</div>
                      <div className="text-sm text-slate-500">{approved[tIdx].role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="flex justify-center gap-2 mt-6">
                {approved.map((_, i) => (
                  <button key={i} onClick={() => setTIdx(i)} className={`h-1.5 rounded-full transition-all ${i === tIdx ? 'w-10 bg-gradient-to-r from-cyan-500 to-violet-500' : 'w-2 bg-slate-200'}`} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
