import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShieldCheck, Sparkles, CheckCircle } from 'lucide-react'

// Shared split-screen shell for patient login & register pages.
export default function AuthShell({ side, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* LEFT — dark visual panel */}
      <div className="relative hidden lg:flex items-center justify-center p-12 overflow-hidden bg-slate-950 text-white">
        <div aria-hidden className="absolute inset-0 mesh-dark-bg" />
        <div aria-hidden className="absolute inset-0 bg-grid opacity-10" />
        <div aria-hidden className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-cyan-500 mix-blend-screen blur-[120px] opacity-50 animate-float-slow" />
        <div aria-hidden className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-violet-500 mix-blend-screen blur-[120px] opacity-50 animate-float-slow" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-md">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-2xl font-black shadow-glow">+</div>
            <div>
              <div className="font-display font-extrabold text-xl">Saubhagyam</div>
              <div className="text-[10px] tracking-[0.25em] font-bold text-cyan-300">PREMIUM HEALTH</div>
            </div>
          </Link>

          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="font-display text-4xl xl:text-5xl font-extrabold mt-12 leading-[1]"
          >
            Your health,<br />
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-[#A6FF5D] bg-clip-text text-transparent">always at hand.</span>
          </motion.h2>

          <p className="text-white/60 mt-5 max-w-sm">
            Book visits, track prescriptions, view reports and chat with your doctors — all in one place.
          </p>

          <div className="mt-10 space-y-3">
            {[
              { i: Heart, t: 'Personal health timeline' },
              { i: ShieldCheck, t: 'Encrypted & private' },
              { i: Sparkles, t: 'AI-powered triage' },
              { i: CheckCircle, t: 'Free cancellation up to 2 hrs' }
            ].map((f) => (
              <div key={f.t} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-300"><f.i size={16} /></div>
                <span className="text-white/85">{f.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="relative flex items-center justify-center p-6 lg:p-12 mesh-bg">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-[0.04]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative w-full max-w-md">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center text-white font-black">+</div>
            <span className="font-display font-extrabold">Saubhagyam</span>
          </Link>
          {children}
        </motion.div>
      </div>
    </div>
  )
}
