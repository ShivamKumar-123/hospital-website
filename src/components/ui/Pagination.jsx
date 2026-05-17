import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null
  const nums = []
  const start = Math.max(1, page - 2)
  const end = Math.min(pages, start + 4)
  for (let i = start; i <= end; i++) nums.push(i)

  const btn = 'h-9 w-9 rounded-xl text-sm font-bold flex items-center justify-center transition'

  return (
    <div className="flex items-center justify-end gap-1 mt-4">
      <button className={`${btn} bg-ink-50 hover:bg-ink-100 disabled:opacity-40`} disabled={page === 1} onClick={() => onPage(page - 1)}><ChevronLeft /></button>
      {nums.map((n) => (
        <button key={n} onClick={() => onPage(n)}
          className={`${btn} ${n === page ? 'bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-glow' : 'text-ink-700 hover:bg-ink-100'}`}>
          {n}
        </button>
      ))}
      <button className={`${btn} bg-ink-50 hover:bg-ink-100 disabled:opacity-40`} disabled={page === pages} onClick={() => onPage(page + 1)}><ChevronRight /></button>
    </div>
  )
}
