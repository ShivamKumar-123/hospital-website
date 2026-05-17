import { motion } from 'framer-motion'
import { Award, Target, Eye, Heart, ArrowUpRight } from 'lucide-react'
import PageHero from '../../components/public/PageHero.jsx'
import Reveal, { Stagger, Item } from '../../components/anim/Reveal.jsx'
import Tilt from '../../components/anim/Tilt.jsx'
import WaveDivider from '../../components/ui/WaveDivider.jsx'

const timeline = [
  { y: '2006', t: 'Founded', d: 'Opened with 50 beds and 3 specialties.', tint: 'from-brand-500 to-brand-300' },
  { y: '2011', t: 'Multi-specialty', d: 'Expanded to 12 specialties and 200 beds.', tint: 'from-emerald-500 to-teal-400' },
  { y: '2016', t: 'Trauma center', d: 'Level-1 trauma center with helipad commissioned.', tint: 'from-rose-500 to-pink-400' },
  { y: '2020', t: 'Digital-first', d: 'Launched telemedicine and EHR for all patients.', tint: 'from-violet-500 to-fuchsia-400' },
  { y: '2024', t: 'Robotic era', d: 'Added robotic surgery & 3T MRI imaging.', tint: 'from-amber-500 to-orange-400' }
]

const leaders = [
  { name: 'Dr. Karan Mehra', role: 'Chief Executive Officer', photo: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600' },
  { name: 'Dr. Priya Nair', role: 'Chief Medical Officer', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600' },
  { name: 'Mark Tanner', role: 'Director of Operations', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600' }
]

const achievements = [
  { v: '15+', l: 'National awards' },
  { v: 'JCI', l: 'Accredited' },
  { v: 'NABH', l: 'Certified' },
  { v: '98%', l: 'Patient satisfaction' }
]

import { useSeo } from '../../utils/seo.js'

export default function About() {
  useSeo({
    title: 'About Saubhagyam Hospital — Our Mission, Vision & Leadership',
    description: 'Meet the leadership, values and milestones behind Saubhagyam Hospital — a premium multi-specialty hospital trusted by 50,000+ patients across cardiology, neurology, pediatrics and more.',
    keywords: ['about Saubhagyam', 'hospital mission', 'hospital leadership', 'healthcare values'],
    path: '/about'
  })

  return (
    <>
      <PageHero
        eyebrow="About Saubhagyam Hospital"
        title={<>Two decades of <span className="text-gradient">trusted</span><br />healthcare.</>}
        subtitle="From a 50-bed clinic to a 500-bed multi-specialty hospital — Saubhagyam Hospital has been a trusted name for families across the region."
      />

      <section className="container-xl section">
        <Stagger className="grid lg:grid-cols-3 gap-5">
          {[
            { icon: Target, title: 'Our Mission', body: 'Deliver world-class healthcare with empathy, transparency and uncompromising clinical excellence.', tint: 'from-brand-500 to-brand-300' },
            { icon: Eye, title: 'Our Vision', body: 'To be the most-trusted multi-specialty network in the country, powered by people and technology.', tint: 'from-violet-500 to-pink-400' },
            { icon: Heart, title: 'Our Values', body: 'Compassion, integrity, innovation, accountability and lifelong patient relationships.', tint: 'from-rose-500 to-orange-400' }
          ].map((b) => (
            <Item key={b.title}>
              <Tilt max={6}>
                <div className="card card-hover p-8 h-full relative overflow-hidden">
                  <div aria-hidden className={`absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${b.tint} opacity-20 blur-2xl`} />
                  <div className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${b.tint} text-white flex items-center justify-center text-2xl shadow-glow`}>
                    <b.icon />
                  </div>
                  <h3 className="font-display text-2xl font-extrabold mt-5">{b.title}</h3>
                  <p className="text-ink-500 mt-3 leading-relaxed">{b.body}</p>
                </div>
              </Tilt>
            </Item>
          ))}
        </Stagger>
      </section>

      <WaveDivider variant="wave" fill="#ffffff" />

      {/* Timeline */}
      <section className="section relative bg-white">
        <div className="container-xl">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Our journey</span>
            <h2 className="h-section mt-3">Milestones <span className="text-gradient-cool">worth marking.</span></h2>
          </Reveal>

          <div className="relative mt-16 max-w-4xl mx-auto">
            <div aria-hidden className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-200 via-violet-300 to-pink-200" />
            {timeline.map((t, i) => (
              <motion.div key={t.y}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`relative mb-10 md:grid md:grid-cols-2 md:gap-10 ${i % 2 ? 'md:[direction:rtl]' : ''}`}>
                <div className="pl-12 md:pl-0 md:pr-10 md:text-right [direction:ltr]">
                  <div className="card p-6 inline-block min-w-[260px]">
                    <span className={`chip bg-gradient-to-r ${t.tint} text-white`}>{t.y}</span>
                    <h4 className="font-display text-2xl font-extrabold mt-3">{t.t}</h4>
                    <p className="text-ink-500 text-sm mt-2">{t.d}</p>
                  </div>
                </div>
                {/* Dot */}
                <div aria-hidden className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-6 h-4 w-4 rounded-full bg-white ring-4 ring-brand-400 shadow-glow" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider variant="bumpy" fill="#f1f5f9" />

      {/* Leaders */}
      <section className="section container-xl bg-slate-100">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">Leadership</span>
          <h2 className="h-section mt-3">The team behind <span className="text-gradient-cool">the care.</span></h2>
        </Reveal>
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {leaders.map((l) => (
            <Item key={l.name}>
              <Tilt max={6}>
                <div className="card card-hover overflow-hidden group">
                  <div className="relative h-72 overflow-hidden">
                    <img src={l.photo} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <h4 className="font-display text-xl font-extrabold">{l.name}</h4>
                      <p className="text-brand-300 text-sm">{l.role}</p>
                    </div>
                  </div>
                </div>
              </Tilt>
            </Item>
          ))}
        </Stagger>
      </section>

      <WaveDivider variant="wave" fill="#ffffff" />

      {/* Achievements band */}
      <section className="section relative bg-white">
        <div className="container-xl">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-ink-950 text-white p-10 md:p-16">
            <div aria-hidden className="absolute inset-0 mesh-dark-bg" />
            <div aria-hidden className="absolute inset-0 bg-grid bg-grid opacity-10" />
            <Reveal className="relative text-center max-w-2xl mx-auto">
              <Award className="mx-auto text-3xl mb-3 text-brand-300" />
              <h3 className="font-display text-3xl md:text-5xl font-extrabold">Recognized for clinical excellence.</h3>
              <p className="text-white/60 mt-3">Trusted by national accreditation bodies and millions of patients.</p>
            </Reveal>
            <Stagger className="relative mt-12 grid grid-cols-2 md:grid-cols-4 gap-5">
              {achievements.map((a) => (
                <Item key={a.l}>
                  <div className="text-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                    <div className="font-display text-5xl font-extrabold text-gradient">{a.v}</div>
                    <div className="text-white/60 mt-1 text-sm">{a.l}</div>
                  </div>
                </Item>
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </>
  )
}
