import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

// Type → icon + gradient.
const TYPES = {
  success: { Icon: CheckCircle2,   from: 'from-emerald-500', to: 'to-teal-400',   ring: 'ring-emerald-200', bar: 'bg-emerald-500' },
  error:   { Icon: XCircle,        from: 'from-rose-500',    to: 'to-pink-500',   ring: 'ring-rose-200',    bar: 'bg-rose-500'    },
  warning: { Icon: AlertTriangle,  from: 'from-amber-500',   to: 'to-orange-500', ring: 'ring-amber-200',   bar: 'bg-amber-500'   },
  info:    { Icon: Info,           from: 'from-brand-500',   to: 'to-violet-500', ring: 'ring-brand-200',   bar: 'bg-brand-500'   }
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  // toast(message)  OR  toast(message, type)  OR  toast({ title, message, type, timeout })
  const push = useCallback((input, type = 'success', timeout = 3500) => {
    const obj = typeof input === 'string'
      ? { message: input, type, timeout }
      : { type: 'success', timeout: 3500, ...input }

    const id = crypto.randomUUID()
    setToasts((t) => [...t, { id, ...obj }])
    timers.current[id] = setTimeout(() => remove(id), obj.timeout)
  }, [remove])

  return (
    <ToastContext.Provider value={{ toast: push }}>
      {children}
      <div className="fixed top-5 right-5 z-[200] flex flex-col gap-3 w-[min(92vw,360px)] pointer-events-none">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const cfg = TYPES[t.type] || TYPES.info
            const Icon = cfg.Icon
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.85, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', bounce: 0.35, duration: 0.5 }}
                className="pointer-events-auto relative overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-15px_rgba(2,6,23,0.35)] ring-1 ring-ink-100"
              >
                {/* Left intent bar */}
                <span aria-hidden className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${cfg.from} ${cfg.to}`} />

                {/* Soft ambient blob */}
                <span aria-hidden className={`absolute -top-10 -right-10 h-24 w-24 rounded-full bg-gradient-to-br ${cfg.from} ${cfg.to} opacity-10 blur-2xl`} />

                <div className="relative flex items-start gap-3 p-4 pl-5">
                  <motion.span
                    initial={{ scale: 0.6, rotate: -15, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.08, type: 'spring', bounce: 0.5 }}
                    className={`h-10 w-10 rounded-xl bg-gradient-to-br ${cfg.from} ${cfg.to} text-white flex items-center justify-center shadow-glow shrink-0`}
                  >
                    <Icon size={18} />
                  </motion.span>

                  <div className="flex-1 min-w-0 pt-0.5">
                    {t.title && <p className="font-display font-extrabold text-ink-900 text-sm leading-tight">{t.title}</p>}
                    <p className={`text-ink-700 ${t.title ? 'text-xs mt-0.5' : 'text-sm font-semibold'} leading-snug`}>{t.message}</p>
                  </div>

                  <button
                    aria-label="Dismiss"
                    onClick={() => remove(t.id)}
                    className="h-7 w-7 rounded-lg text-ink-400 hover:bg-ink-50 hover:text-ink-700 flex items-center justify-center transition shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Progress bar */}
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: t.timeout / 1000, ease: 'linear' }}
                  style={{ transformOrigin: 'left' }}
                  className={`block h-0.5 ${cfg.bar} opacity-70`}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
