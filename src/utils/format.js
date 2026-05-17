export const fmtDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export const fmtMoney = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')

export const cls = (...arr) => arr.filter(Boolean).join(' ')
