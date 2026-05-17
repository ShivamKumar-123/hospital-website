import { Bell, AlertTriangle, Calendar, User, Check, Trash2 } from 'lucide-react'
import { useLocalCollection } from '../../hooks/useLocalCollection.js'
import EmptyState from '../../components/ui/EmptyState.jsx'
import PageHeader from '../../components/dashboard/PageHeader.jsx'
import { Stagger, Item } from '../../components/anim/Reveal.jsx'
import { fmtDate } from '../../utils/format.js'

const ICONS = { emergency: AlertTriangle, appointment: Calendar, patient: User, default: Bell }
const COLORS = {
  emergency:   'from-rose-500 to-pink-500',
  appointment: 'from-amber-500 to-orange-400',
  patient:     'from-brand-500 to-violet-500',
  default:     'from-ink-400 to-ink-500'
}

export default function Notifications() {
  const { items, update, remove } = useLocalCollection('notifications')
  const unread = items.filter((n) => !n.read).length

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        subtitle={`${unread} unread · ${items.length} total`}
        actions={<button onClick={() => items.forEach((n) => !n.read && update(n.id, { read: true }))} className="btn-outline"><Check /> Mark all read</button>}
      />

      {items.length === 0 ? (
        <div className="card"><EmptyState title="No notifications" icon={<Bell />} /></div>
      ) : (
        <Stagger className="card divide-y divide-ink-100 overflow-hidden">
          {items.map((n) => {
            const Icon = ICONS[n.type] || ICONS.default
            const tint = COLORS[n.type] || COLORS.default
            return (
              <Item key={n.id}>
                <div className={`p-5 flex gap-4 relative transition ${n.read ? '' : 'bg-brand-50/20'} hover:bg-ink-50/50`}>
                  {!n.read && <span aria-hidden className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-gradient-to-b from-brand-500 to-violet-500" />}
                  <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${tint} text-white flex items-center justify-center shadow-glow shrink-0`}><Icon /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink-900">{n.title}</span>
                      {!n.read && <span className="chip-brand !py-0.5">New</span>}
                    </div>
                    <p className="text-sm text-ink-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-ink-400 mt-1">{fmtDate(n.createdAt)}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {!n.read && <button onClick={() => update(n.id, { read: true })} className="h-9 w-9 rounded-xl bg-ink-50 hover:bg-ink-100 hover:scale-110 flex items-center justify-center transition"><Check /></button>}
                    <button onClick={() => remove(n.id)} className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 hover:scale-110 flex items-center justify-center transition"><Trash2 /></button>
                  </div>
                </div>
              </Item>
            )
          })}
        </Stagger>
      )}
    </div>
  )
}
