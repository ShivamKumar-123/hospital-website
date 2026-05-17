import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Users, ArrowUpRight } from 'lucide-react'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import PageHero from '../../components/public/PageHero.jsx'
import { Stagger, Item } from '../../components/anim/Reveal.jsx'
import Tilt from '../../components/anim/Tilt.jsx'

import { useSeo } from '../../utils/seo.js'

export default function Departments() {
  useSeo({
    title: 'Departments & Specialties — Cardiology, Neurology, Pediatrics & More',
    description: 'Explore 10+ specialty departments at MediCare+ — Cardiology, Neurology, Orthopedics, Pediatrics, Gynecology, Radiology, ICU, Emergency, General Medicine and Surgery.',
    keywords: ['hospital departments', 'cardiology', 'neurology', 'orthopedics', 'pediatrics', 'gynecology', 'ICU', 'emergency care'],
    path: '/departments'
  })

  const { items } = useLocalCollection('departments')
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    const term = q.toLowerCase()
    return items.filter((d) => d.name.toLowerCase().includes(term) || d.description.toLowerCase().includes(term))
  }, [q, items])

  const goToDoctors = (deptName) =>
    navigate('/doctors', { state: { department: deptName } })

  return (
    <>
      <PageHero
        eyebrow="Specialties"
        title={<>Centers of <span className="text-gradient">excellence.</span></>}
        subtitle="Each department is led by top consultants and equipped with the latest technology."
      >
        <div className="max-w-md flex items-center gap-2 glass p-1.5">
          <Search className="text-ink-400 ml-3" />
          <input className="flex-1 outline-none bg-transparent text-sm py-2.5 pr-3" placeholder="Search a department..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </PageHero>

      <section className="container-xl pb-20">
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((d, i) => (
            <Item key={d.id}>
              <Tilt max={5}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => goToDoctors(d.name)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToDoctors(d.name) } }}
                  className="card card-hover overflow-hidden group h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-400"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={d.image} alt={d.name} className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 chip bg-white/90 backdrop-blur text-ink-800 font-bold">0{(i % 9) + 1}</span>
                    <span className="absolute top-4 right-4 chip bg-emerald-500 text-white">{d.availability}</span>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-display text-2xl font-extrabold">{d.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-ink-500 text-sm leading-relaxed line-clamp-2">{d.description}</p>
                    <div className="flex items-center justify-between mt-5">
                      <span className="text-xs text-ink-500 flex items-center gap-1"><Users /> {d.doctors} specialists</span>
                      <span className="inline-flex items-center gap-1 text-brand-600 font-bold text-sm group-hover:gap-2 transition">
                        See doctors <ArrowUpRight />
                      </span>
                    </div>
                  </div>
                </div>
              </Tilt>
            </Item>
          ))}
        </Stagger>
      </section>
    </>
  )
}
