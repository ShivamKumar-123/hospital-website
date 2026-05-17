import Modal from './Modal.jsx'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', message, confirmText = 'Confirm', danger = true }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-4">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${danger ? 'bg-rose-100 text-rose-600' : 'bg-brand-100 text-brand-600'}`}>
          <AlertTriangle />
        </div>
        <p className="text-ink-600 leading-relaxed">{message}</p>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={() => { onConfirm?.(); onClose() }}>{confirmText}</button>
      </div>
    </Modal>
  )
}
