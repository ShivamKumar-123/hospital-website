import { useState, useMemo } from 'react'
import { Search, User, Calendar, ArrowUpRight } from 'lucide-react'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import { fmtDate } from '../../utils/format.js'
import EmptyState from '../../components/ui/EmptyState.jsx'
import PageHero from '../../components/public/PageHero.jsx'
import { Stagger, Item } from '../../components/anim/Reveal.jsx'
import Tilt from '../../components/anim/Tilt.jsx'

import { useSeo } from '../../utils/seo.js'

export default function Blog() {
  useSeo({
    title: 'Health Blog & Insights — Tips, Guides & Recovery Stories',
    description: 'Trusted health articles, guides and recovery stories written by Saubhagyam Hospital consultants. Read about cardiology, pediatrics, orthopedics, wellness and more.',
    keywords: ['health blog', 'medical articles', 'wellness tips', 'health guide', 'recovery stories'],
    path: '/blog',
    type: 'article'
  })

  const { items } = useLocalCollection('blogs')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const categories = ['All', ...Array.from(new Set(items.map((b) => b.category)))]

  const filtered = useMemo(() => {
    return items.filter((b) =>
      (cat === 'All' || b.category === cat) &&
      (b.title.toLowerCase().includes(q.toLowerCase()) || b.excerpt.toLowerCase().includes(q.toLowerCase()))
    )
  }, [items, q, cat])

  const [featured, ...rest] = filtered

  return (
    <>
      <PageHero
        eyebrow="Health blog"
        title={<>Insights from <span className="text-gradient">our experts.</span></>}
        subtitle="Articles, guides and recovery stories — written by consultants who see it every day."
      >
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="flex-1 flex items-center gap-2 glass p-1.5">
            <Search className="text-ink-400 ml-3" />
            <input className="flex-1 outline-none bg-transparent text-sm py-2.5 pr-3" placeholder="Search articles..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="input sm:w-56 !rounded-full" value={cat} onChange={(e) => setCat(e.target.value)}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </PageHero>

      <section className="container-xl pb-20">
        {filtered.length === 0 ? <EmptyState title="No articles found" /> : (
          <>
            {/* Featured */}
            {featured && (
              <Tilt max={4}>
                <article className="card card-hover overflow-hidden grid lg:grid-cols-2 mb-10">
                  <div className="relative h-72 lg:h-auto overflow-hidden bg-gradient-to-br from-brand-500/30 via-violet-500/20 to-pink-500/20">
                    <img
                      src={featured.thumbnail}
                      alt=""
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <span className="chip-brand w-fit">{featured.category} · Featured</span>
                    <h3 className="font-display text-3xl md:text-4xl font-extrabold mt-4 leading-tight">{featured.title}</h3>
                    <p className="text-ink-500 mt-3">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 mt-5 text-sm text-ink-500">
                      <span className="flex items-center gap-1.5"><User /> {featured.author}</span>
                      <span className="flex items-center gap-1.5"><Calendar /> {fmtDate(featured.createdAt)}</span>
                    </div>
                    <button className="mt-6 btn-dark w-fit">Read article <ArrowUpRight /></button>
                  </div>
                </article>
              </Tilt>
            )}

            <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {rest.map((b) => (
                <Item key={b.id} className="h-full">
                  <Tilt max={5} className="h-full">
                    <article className="card card-hover overflow-hidden group h-full flex flex-col">
                      <div className="relative h-52 shrink-0 overflow-hidden bg-gradient-to-br from-brand-500/30 via-violet-500/20 to-pink-500/20">
                        <img
                          src={b.thumbnail}
                          alt=""
                          loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                          className="w-full h-full object-cover scale-105 group-hover:scale-110 transition duration-700"
                        />
                        <span className="absolute top-3 left-3 chip bg-white/90 backdrop-blur text-ink-800">{b.category}</span>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-display text-lg font-extrabold line-clamp-2 leading-snug">{b.title}</h3>
                        <p className="text-sm text-ink-500 mt-2 line-clamp-2">{b.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-ink-500 mt-auto pt-5">
                          <span className="flex items-center gap-1.5"><User /> {b.author}</span>
                          <span>{fmtDate(b.createdAt)}</span>
                        </div>
                      </div>
                    </article>
                  </Tilt>
                </Item>
              ))}
            </Stagger>
          </>
        )}
      </section>
    </>
  )
}
