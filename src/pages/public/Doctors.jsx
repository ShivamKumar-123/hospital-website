import { useState, useMemo, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Twitter, Linkedin, ArrowUpRight, X } from 'lucide-react'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import PageHero from '../../components/public/PageHero.jsx'
import { Stagger, Item } from '../../components/anim/Reveal.jsx'
import Tilt from '../../components/anim/Tilt.jsx'

import { useSeo } from '../../utils/seo.js'

export default function Doctors() {
  useSeo({
    title: 'Our Doctors — Expert Consultants & Specialists',
    description: 'Browse expert consultants and specialists at MediCare+. Filter by department, view qualifications, experience and availability, then book an appointment online.',
    keywords: ['doctors', 'specialists', 'consultants', 'find a doctor', 'hospital doctors'],
    path: '/doctors'
  })

  const { items } = useLocalCollection('doctors')
  const { items: departments } = useLocalCollection('departments')
  const location = useLocation()
  const [q, setQ] = useState('')
  const [dept, setDept] = useState(location.state?.department || 'All')

  // If the user navigates here again with a different department in state,
  // sync the filter (e.g. clicking a different department card).
  useEffect(() => {
    if (location.state?.department) setDept(location.state.department)
  }, [location.state?.department])

  const filtered = useMemo(() => {
    return items.filter((d) =>
      (dept === 'All' || d.department === dept) &&
      (d.name.toLowerCase().includes(q.toLowerCase()) || d.department.toLowerCase().includes(q.toLowerCase()))
    )
  }, [items, q, dept])

  return (
    <>
      <PageHero
        eyebrow="Our specialists"
        title={<>Brilliant minds.<br /><span className="text-gradient">Caring hands.</span></>}
        subtitle="Search by name, filter by department, and book in a single tap."
      >
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="flex-1 flex items-center gap-2 glass p-1.5">
            <Search className="text-ink-400 ml-3" />
            <input className="flex-1 outline-none bg-transparent text-sm py-2.5 pr-3" placeholder="Search doctor..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="input sm:w-56 !rounded-full" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option>All</option>
            {departments.map((d) => <option key={d.id}>{d.name}</option>)}
          </select>
        </div>
      </PageHero>

      <section className="container-xl pb-20">
        {dept !== 'All' && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-widest font-bold text-ink-500">Filtered by department</span>
            <span className="chip bg-gradient-to-r from-cyan-100 to-violet-100 text-ink-800 border border-cyan-200 font-bold pr-1">
              {dept}
              <button
                onClick={() => setDept('All')}
                aria-label="Clear filter"
                className="ml-1 h-5 w-5 rounded-full bg-white/80 hover:bg-white text-ink-600 flex items-center justify-center transition"
              >
                <X size={12} />
              </button>
            </span>
            <span className="text-xs text-ink-500">{filtered.length} doctor{filtered.length === 1 ? '' : 's'} available</span>
          </div>
        )}

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((d) => (
            <Item key={d.id}>
              <Tilt max={6}>
                <div className="card card-hover overflow-hidden group">
                  <div className="relative h-72 overflow-hidden">
                    <img src={d.photo} alt={d.name} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                    <span className={`absolute top-3 right-3 chip backdrop-blur ${d.status === 'Available' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>● {d.status}</span>
                    <div className="absolute bottom-4 left-4 right-4 text-white flex gap-2">
                      <a href={d.social?.tw || '#'} className="h-9 w-9 rounded-full bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white hover:text-ink-900 transition"><Twitter size={14} /></a>
                      <a href={d.social?.li || '#'} className="h-9 w-9 rounded-full bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white hover:text-ink-900 transition"><Linkedin size={14} /></a>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-display text-lg font-extrabold text-ink-900">{d.name}</h4>
                    <p className="text-brand-600 text-sm font-semibold">{d.department}</p>
                    <p className="text-xs text-ink-500 mt-1">{d.qualification}</p>
                    <p className="text-xs text-ink-500">{d.experience} years · {d.availability}</p>
                    <Link to="/appointment" state={{ doctor: d.name, department: d.department }} className="mt-4 btn-dark w-full !py-2.5 !text-xs">
                      Book appointment <ArrowUpRight />
                    </Link>
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
