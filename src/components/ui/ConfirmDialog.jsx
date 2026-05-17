import { motion } from 'framer-motion'
import { AlertTriangle, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react'
import Modal from './Modal.jsx'

// Intent → icon + button class.
const INTENT_MAP = {
  danger:  { icon: ShieldAlert,    btn: 'btn-danger',  ring: 'from-rose-500 to-pink-500'    },
  warning: { icon: AlertTriangle,  btn: 'btn-primary', ring: 'from-amber-500 to-orange-500' },
  info:    { icon: HelpCircle,     btn: 'btn-primary', ring: 'from-cyan-500 to-brand-500'   },
  success: { icon: CheckCircle2,   btn: 'btn-primary', ring: 'from-emerald-500 to-teal-500' }
}

/**
 * Premium confirmation dialog.
 *
 * Props (backwards-compatible):
 *   open, onClose, onConfirm                  — required
 *   title       (default: 'Are you sure?')
 *   message                                   — body text
 *   confirmText (default: 'Confirm')
 *   cancelText  (default: 'Cancel')
 *   danger      (default: true)               — legacy flag, maps to intent='danger'
 *   intent      ('danger' | 'warning' | 'info' | 'success') — overrides `danger` when set
 *   icon        — custom ReactNode (overrides the intent icon)
 */
export default function ConfirmDialog({
  open, onClose, onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText  = 'Cancel',
  danger = true,
  intent,
  icon
}) {
  const finalIntent = intent || (danger ? 'danger' : 'info')
  const cfg = INTENT_MAP[finalIntent] || INTENT_MAP.info
  const Icon = cfg.icon

  return (
    <Modal open={open} onClose={onClose} title={title} intent={finalIntent} size="sm">
      <div className="flex flex-col items-center text-center -mt-2">
        {/* Large iconified avatar with pulsing ring */}
        <div className="relative">
          <span aria-hidden className={`absolute inset-0 rounded-full bg-gradient-to-br ${cfg.ring} opacity-30 animate-ping`} />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
            className={`relative h-20 w-20 rounded-full bg-gradient-to-br ${cfg.ring} text-white flex items-center justify-center shadow-glow`}
          >
            {icon || <Icon size={32} />}
          </motion.div>
        </div>

        {message && (
          <p className="text-ink-600 leading-relaxed mt-5 max-w-sm">{message}</p>
        )}

        <div className="mt-7 w-full flex flex-col-reverse sm:flex-row gap-2">
          <button type="button" className="btn-ghost flex-1 !py-3" onClick={onClose}>{cancelText}</button>
          <button
            type="button"
            className={`${cfg.btn} flex-1 !py-3 shine`}
            onClick={() => { onConfirm?.(); onClose() }}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
