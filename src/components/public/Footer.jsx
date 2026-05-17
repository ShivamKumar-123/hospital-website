import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUpRight, Sparkles, ShieldCheck, Heart } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext.jsx'
import WaveDivider from '../ui/WaveDivider.jsx'

export default function Footer() {
  const { settings } = useSettings()
  // Split the hospital name into a big first word + the rest as a tagline,
  // so any client (Saubhagyam Hospital, Saubhagyam Hospital etc.) shows correctly.
  const parts = (settings.hospitalName || 'Hospital').split(' ')
  const brandLine1 = parts[0]
  const brandLine2 = (parts.slice(1).join(' ') || 'PREMIUM HEALTH').toUpperCase()
  return (
    <>
      {/* ============================================================
          PREMIUM CTA — sits as its own section ABOVE the footer
          ============================================================ */}
      <section className="relative bg-white py-16 md:py-24 overflow-hidden">
        {/* Ambient gradients */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        </div>

        <div className="container-xl relative">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 text-white p-10 md:p-16 lg:p-20 border border-white/10">
            {/* Animated mesh background inside card */}
            <div aria-hidden className="absolute inset-0">
              <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-cyan-500 mix-blend-screen blur-[100px] opacity-50 animate-float-slow" />
              <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-violet-500 mix-blend-screen blur-[100px] opacity-45 animate-float-slow" style={{ animationDelay: '3s' }} />
              <div className="absolute -bottom-24 left-1/2 h-72 w-72 rounded-full bg-pink-500 mix-blend-screen blur-[100px] opacity-40 animate-float-slow" style={{ animationDelay: '5s' }} />
              <div className="absolute inset-0 bg-grid opacity-[0.08]" />
            </div>

            {/* Content */}
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="chip bg-white/10 border border-white/20 text-cyan-200 backdrop-blur">
                  <Sparkles size={12} /> Ready when you are
                </span>
                <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mt-5 leading-[0.95] tracking-tight">
                  Book your first visit,
                  <br />
                  <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-[#A6FF5D] bg-clip-text text-transparent">today.</span>
                </h3>
                <p className="text-white/70 mt-5 max-w-md text-base md:text-lg leading-relaxed">
                  From a routine check-up to complex surgery — our specialists are one tap away. Free reschedule. Insurance accepted.
                </p>

                {/* Trust pills */}
                <div className="flex flex-wrap gap-2 mt-7">
                  {[
                    { i: ShieldCheck, t: 'JCI Accredited' },
                    { i: Heart, t: '50K+ patients' },
                    { i: Sparkles, t: 'AI triage' }
                  ].map((p) => (
                    <span key={p.t} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white/80">
                      <p.i size={12} className="text-cyan-300" /> {p.t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right column — CTA cluster */}
              <div className="flex flex-col lg:items-end gap-4">
                <Link
                  to="/appointment"
                  className="group relative inline-flex items-center gap-3 bg-[#A6FF5D] hover:bg-[#A6FF5D]/95 text-slate-900 font-bold px-7 py-4 rounded-full text-base transition shadow-glow hover:shadow-glowV"
                >
                  <Sparkles size={18} />
                  <span className="slide-text">
                    <span>Book appointment</span>
                    <span>Book appointment</span>
                  </span>
                  <span className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <ArrowUpRight size={16} />
                  </span>
                </Link>

                <div className="flex items-center gap-3 text-sm text-white/60">
                  <div className="flex -space-x-2">
                    {[33, 12, 47].map((i) => (
                      <img key={i} src={`https://i.pravatar.cc/64?img=${i}`} alt="" className="h-8 w-8 rounded-full ring-2 ring-slate-950 object-cover" />
                    ))}
                  </div>
                  <span>Joined this week: <span className="text-white font-bold">+1,284</span></span>
                </div>

                <a
                  href={`tel:${settings.emergency}`}
                  className="text-sm text-white/50 hover:text-white transition flex items-center gap-2"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                  </span>
                  Emergency: {settings.emergency}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave: white CTA section → dark footer */}
      <WaveDivider variant="wave" fill="#04060f" flip height={90} />

      {/* ============================================================
          FOOTER PROPER
          ============================================================ */}
      <footer className="relative overflow-hidden bg-slate-950 text-white">
        <div aria-hidden className="absolute inset-0">
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-cyan-500 mix-blend-screen blur-[100px] opacity-20" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-500 mix-blend-screen blur-[100px] opacity-20" />
        </div>

        <div className="container-xl relative pt-14 pb-12 grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-2xl font-black">+</div>
              <div>
                <div className="font-display font-extrabold text-xl">{brandLine1}</div>
                <div className="text-[10px] tracking-[0.25em] font-bold text-cyan-300">{brandLine2}</div>
              </div>
            </Link>
            <p className="mt-5 text-white/60 max-w-md leading-relaxed">
              {settings.tagline} Multi-specialty hospital offering compassionate care, advanced technology and 24/7 emergency services.
            </p>
            <div className="flex gap-2 mt-6">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center transition group">
                  <Icon size={16} className="group-hover:rotate-12 transition" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold mb-5 text-white/90">Explore</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {['About', 'Departments', 'Doctors', 'Packages', 'Blog'].map((l) => (
                <li key={l}>
                  <Link to={`/${l.toLowerCase()}`} className="flex items-center gap-1 hover:text-white transition group">
                    <span className="h-px w-3 bg-white/30 group-hover:w-5 group-hover:bg-cyan-400 transition-all" />
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-5 text-white/90">Services</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {['Cardiology', 'Neurology', 'Pediatrics', 'ICU', 'Surgery'].map((l) => (
                <li key={l}>
                  <Link to="/departments" className="flex items-center gap-1 hover:text-white transition group">
                    <span className="h-px w-3 bg-white/30 group-hover:w-5 group-hover:bg-cyan-400 transition-all" />
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-5 text-white/90">Reach us</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-3"><MapPin size={16} className="mt-0.5 text-cyan-300 shrink-0" /><span>{settings.address}</span></li>
              <li className="flex gap-3"><Phone size={16} className="mt-0.5 text-cyan-300 shrink-0" /><a href={`tel:${settings.phone}`} className="hover:text-white">{settings.phone}</a></li>
              <li className="flex gap-3"><Mail size={16} className="mt-0.5 text-cyan-300 shrink-0" /><a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="container-xl py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40">
            <span>© {new Date().getFullYear()} {settings.hospitalName} · Crafted with care.</span>
            <span>Admin · <Link to="/login" className="text-cyan-300 hover:text-white">Login</Link></span>
          </div>
        </div>
      </footer>
    </>
  )
}
