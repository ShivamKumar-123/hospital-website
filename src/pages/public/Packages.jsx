import { Check, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../../components/public/PageHero.jsx'
import { Stagger, Item } from '../../components/anim/Reveal.jsx'
import Tilt from '../../components/anim/Tilt.jsx'

const PACKAGES = [
  { id: 'full', name: 'Full Body Checkup', price: 1999, tint: 'from-brand-500 to-brand-300', features: ['60+ tests', 'CBC, Lipid, LFT, KFT', 'ECG & Chest X-Ray', 'Consultant review', 'Same-day report'] },
  { id: 'diab', name: 'Diabetes Care', price: 999, tint: 'from-emerald-500 to-teal-400', features: ['HbA1c, Fasting & PP Glucose', 'Lipid profile', 'KFT + Urine R/M', 'Dietitian session', 'Endocrinologist review'] },
  { id: 'heart', name: 'Heart Health', price: 2999, tint: 'from-rose-500 to-pink-400', popular: true, features: ['ECG, ECHO, TMT', 'Lipid + hsCRP', 'Chest X-Ray', 'Cardiologist consult', '90-day follow-up'] },
  { id: 'women', name: 'Women Wellness', price: 2499, tint: 'from-violet-500 to-fuchsia-400', features: ['Pap smear', 'Mammography', 'Hormone panel', 'Thyroid + Vit D + B12', 'Gynecologist consult'] },
  { id: 'sr', name: 'Senior Citizen', price: 4499, tint: 'from-indigo-500 to-violet-400', features: ['85+ tests', 'Bone density (DEXA)', 'Cancer markers', 'Vision & hearing', 'Geriatrician consult'] },
  { id: 'exec', name: 'Executive', price: 6999, tint: 'from-amber-500 to-orange-400', features: ['120+ tests', 'PFT, USG abdomen', 'Stress ECG (TMT)', '3 specialist consults', 'Nutrition plan'] }
]

import { useSeo } from '../../utils/seo.js'

export default function Packages() {
  useSeo({
    title: 'Health Checkup Packages — Preventive Care from ₹999',
    description: 'Choose from 6 health checkup packages: Full Body, Heart Health, Diabetes Care, Women Wellness, Senior Citizen and Executive. Affordable preventive care from ₹999.',
    keywords: ['health package', 'preventive checkup', 'full body checkup', 'heart checkup', 'diabetes test', 'health screening'],
    path: '/packages'
  })

  return (
    <>
      <PageHero
        eyebrow="Preventive care"
        title={<>Health, <span className="text-gradient">packaged smartly.</span></>}
        subtitle="Comprehensive screening, same-day reports and specialist reviews — at honest prices."
      />

      <section className="container-xl pb-20">
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGES.map((p) => (
            <Item key={p.id}>
              <Tilt max={6}>
                <div className={`card card-hover p-7 relative overflow-hidden h-full ${p.popular ? 'ring-2 ring-violet-500 shadow-glowV' : ''}`}>
                  {p.popular && <span className="absolute top-5 right-5 chip bg-gradient-to-r from-violet-500 to-pink-500 text-white">★ Popular</span>}
                  <div aria-hidden className={`absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br ${p.tint} opacity-20 blur-3xl`} />
                  <div className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${p.tint} shadow-glow`} />
                  <h3 className="font-display text-2xl font-extrabold mt-5">{p.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-display text-5xl font-extrabold text-ink-900">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="text-ink-500">/ visit</span>
                  </div>
                  <ul className="mt-6 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2 text-sm text-ink-700">
                        <span className="mt-0.5 h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Check size={12} /></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/appointment" className={`mt-7 w-full ${p.popular ? 'btn-primary' : 'btn-dark'}`}>
                    Book package <ArrowUpRight />
                  </Link>
                </div>
              </Tilt>
            </Item>
          ))}
        </Stagger>
      </section>
    </>
  )
}
