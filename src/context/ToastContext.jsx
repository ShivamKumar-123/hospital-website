import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: <CheckCircle className="text-emerald-500" />,
  error: <AlertTriangle className="text-red-500" />,
  info: <Info className="text-brand-500" />
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id))

  const push = useCallback((message, type = 'success', timeout = 3000) => {
    const id = crypto.randomUUID()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => remove(id), timeout)
  }, [])

  return (
    <ToastContext.Provider value={{ toast: push }}>
      {children}
      <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="glass px-4 py-3 flex items-center gap-3 min-w-[260px]"
            >
              <span className="text-lg">{ICONS[t.type]}</span>
              <span className="text-sm text-ink-800 font-medium flex-1">{t.message}</span>
              <button className="text-ink-400 hover:text-ink-700" onClick={() => remove(t.id)}>
                <X />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
