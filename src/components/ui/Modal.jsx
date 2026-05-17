import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' }
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] bg-ink-950/60 backdrop-blur-md flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`relative bg-white rounded-3xl shadow-2xl w-full ${widths[size]} my-8 overflow-hidden border border-white/40`}
            initial={{ y: 30, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div aria-hidden className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-brand-200 opacity-30 blur-3xl" />
            <div className="relative flex items-center justify-between p-6 border-b border-ink-100">
              <h3 className="font-display text-xl font-extrabold text-ink-900">{title}</h3>
              <button className="h-9 w-9 rounded-xl bg-ink-50 hover:bg-ink-100 text-ink-700 flex items-center justify-center transition" onClick={onClose}><X size={16} /></button>
            </div>
            <div className="relative p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
