const MAP = {
  Approved:               'bg-emerald-50 text-emerald-700 border-emerald-200',
  Available:              'bg-emerald-50 text-emerald-700 border-emerald-200',
  Verified:               'bg-emerald-50 text-emerald-700 border-emerald-200',
  Completed:              'bg-brand-50 text-brand-700 border-brand-200',
  Pending:                'bg-amber-50 text-amber-700 border-amber-200',
  'Pending Verification': 'bg-violet-50 text-violet-700 border-violet-200',
  'Awaiting Verification':'bg-violet-50 text-violet-700 border-violet-200',
  Rejected:               'bg-rose-50 text-rose-700 border-rose-200',
  'On Leave':             'bg-amber-50 text-amber-700 border-amber-200',
  Dispatched:             'bg-violet-50 text-violet-700 border-violet-200',
  Active:                 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Inactive:               'bg-ink-100 text-ink-700 border-ink-200'
}

export default function StatusBadge({ status }) {
  return <span className={`chip border ${MAP[status] || 'bg-ink-100 text-ink-700 border-ink-200'}`}>● {status}</span>
}
