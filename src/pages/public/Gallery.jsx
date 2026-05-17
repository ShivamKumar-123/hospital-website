import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import PageHero from '../../components/public/PageHero.jsx'

const IMAGES = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1100',
  'https://images.unsplash.com/photo-1551601651-bc60f254d532?w=1100',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1100',
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1100',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1100',
  'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1100',
  'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1100',
  'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=1100',
  'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1100',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1100',
  'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=1100',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1100'
]

import { useSeo } from '../../utils/seo.js'

export default function Gallery() {
  useSeo({
    title: 'Gallery — Inside Saubhagyam Hospital',
    description: 'Take a visual tour of Saubhagyam Hospital — operating theatres, ICU, diagnostics labs, patient rooms and the people who make our care world-class.',
    keywords: ['hospital gallery', 'hospital photos', 'hospital facilities', 'hospital tour'],
    path: '/gallery'
  })

  const [active, setActive] = useState(null)
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={<>A glimpse <span className="text-gradient">inside.</span></>}
        subtitle="Our wards, theaters, technology and the people who make it work."
      />

      <section className="container-xl pb-20">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
          {IMAGES.map((src, i) => (
            <motion.div key={src} layoutId={src} onClick={() => setActive(src)}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: (i % 4) * 0.06 }}
              className="mb-4 break-inside-avoid cursor-zoom-in overflow-hidden rounded-3xl group relative">
              <img src={src} className={`w-full object-cover rounded-3xl group-hover:scale-110 transition duration-700 ${i % 3 === 0 ? 'h-80' : i % 3 === 1 ? 'h-56' : 'h-72'}`} loading="lazy" alt="" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-ink-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
              <span className="absolute bottom-3 left-3 chip bg-white/90 backdrop-blur text-ink-800 opacity-0 group-hover:opacity-100 transition">#{i + 1}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div className="fixed inset-0 z-50 bg-ink-950/90 backdrop-blur flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <motion.img layoutId={active} src={active} className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl" />
            <button onClick={() => setActive(null)} className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 flex items-center justify-center"><X size={20} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
