import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', message = 'Data will appear once added.', icon }) {
  return (
    <div className="text-center py-20 px-6">
      <div className="relative mx-auto h-20 w-20">
        <div aria-hidden className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-100 to-violet-100 blur-xl" />
        <div className="relative h-full w-full rounded-3xl bg-gradient-to-br from-brand-500 to-violet-500 text-white flex items-center justify-center text-3xl shadow-glow">
          {icon || <Inbox />}
        </div>
      </div>
      <h3 className="mt-6 font-display text-xl font-extrabold text-ink-900">{title}</h3>
      <p className="text-ink-500 mt-1 text-sm">{message}</p>
    </div>
  )
}
