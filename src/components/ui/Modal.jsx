import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

// Intent → gradient used for the top ribbon and the optional icon circle.
const INTENTS = {
  default: { from: 'from-brand-500',   to: 'to-violet-500', ring: 'shadow-glow' },
  success: { from: 'from-emerald-500', to: 'to-teal-400',   ring: 'shadow-glow' },
  warning: { from: 'from-amber-500',   to: 'to-orange-500', ring: 'shadow-glow' },
  danger:  { from: 'from-rose-500',    to: 'to-pink-500',   ring: 'shadow-glow' },
  info:    { from: 'from-cyan-500',    to: 'to-brand-500',  ring: 'shadow-glow' }
}

const SIZES = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' }

/**
 * Premium animated modal.
 *
 * Props:
 *   open, onClose, title         — required
 *   subtitle                     — small grey text under the title
 *   icon                         — ReactNode rendered inside a gradient circle next to the title
 *   intent                       — 'default' | 'success' | 'warning' | 'danger' | 'info'
 *   size                         — 'sm' | 'md' | 'lg' | 'xl'
 *   children                     — body content
 */
export default function Modal({ open, onClose, title, subtitle, icon, intent = 'default', size = 'md', children }) {
  const tint = INTENTS[intent] || INTENTS.default

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* Backdrop with radial accents */}
          <div aria-hidden className="absolute inset-0 bg-ink-950/70 backdrop-blur-md" />
          <div aria-hidden className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(at 15% 10%, rgba(45,204,255,0.18), transparent 40%),' +
                'radial-gradient(at 85% 90%, rgba(139,92,246,0.20), transparent 45%)'
            }}
          />

          {/* Card */}
          <motion.div
            className={`relative w-full ${SIZES[size] || SIZES.md} my-8`}
            initial={{ y: 24, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.94 }}
            transition={{ type: 'spring', bounce: 0.28, duration: 0.55 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Outer gradient ring */}
            <div aria-hidden className={`absolute -inset-px rounded-[26px] bg-gradient-to-br ${tint.from} ${tint.to} opacity-60 blur-[2px]`} />

            <div className="relative bg-white rounded-3xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(2,6,23,0.45)] ring-1 ring-white/50">
              {/* Top accent ribbon */}
              <div aria-hidden className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${tint.from} ${tint.to}`} />

              {/* Ambient mesh blobs */}
              <div aria-hidden className={`absolute -top-32 -right-32 h-72 w-72 rounded-full bg-gradient-to-br ${tint.from} ${tint.to} opacity-10 blur-3xl`} />
              <div aria-hidden className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 opacity-10 blur-3xl" />

              {/* Header */}
              <div className="relative flex items-start gap-4 px-6 pt-6 pb-5 border-b border-ink-100/70">
                {icon && (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.08, type: 'spring', bounce: 0.4 }}
                    className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${tint.from} ${tint.to} text-white flex items-center justify-center ${tint.ring} shrink-0`}
                  >
                    {icon}
                  </motion.div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl md:text-2xl font-extrabold tracking-tight text-ink-900 leading-tight">{title}</h3>
                  {subtitle && <p className="text-sm text-ink-500 mt-1 leading-relaxed">{subtitle}</p>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="h-9 w-9 rounded-xl bg-ink-50 hover:bg-ink-100 text-ink-700 flex items-center justify-center transition shrink-0 hover:rotate-90 duration-300"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="relative p-6">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
