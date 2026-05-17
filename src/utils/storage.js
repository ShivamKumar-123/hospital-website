// Tiny LocalStorage-backed CRUD layer used as a fake backend.
const PREFIX = 'medicare:'
const CHANGE_EVENT = 'medicare:change'

// Cross-component (same-tab) change notification. The native `storage`
// event only fires in OTHER tabs, so we dispatch a custom event ourselves.
const notify = (key) => {
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }))
}

export const onChange = (key, handler) => {
  const fn = (e) => { if (!key || e.detail?.key === key) handler() }
  window.addEventListener(CHANGE_EVENT, fn)
  return () => window.removeEventListener(CHANGE_EVENT, fn)
}

export const getData = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const saveData = (key, value) => {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
  notify(key)
  return value
}

export const addRecord = (key, record) => {
  const list = getData(key, [])
  const item = { id: record.id || crypto.randomUUID(), createdAt: new Date().toISOString(), ...record }
  list.unshift(item)
  saveData(key, list)
  return item
}

export const updateRecord = (key, id, patch) => {
  const list = getData(key, [])
  const next = list.map((r) => (r.id === id ? { ...r, ...patch } : r))
  saveData(key, next)
  return next.find((r) => r.id === id)
}

export const deleteRecord = (key, id) => {
  const list = getData(key, [])
  saveData(key, list.filter((r) => r.id !== id))
}

export const findRecord = (key, id) => getData(key, []).find((r) => r.id === id)

export const clearAll = () => {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k))
}

export const exportCSV = (rows, filename = 'export.csv') => {
  if (!rows || !rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(','),
    ...rows.map((r) =>
      headers
        .map((h) => {
          const v = r[h] ?? ''
          return `"${String(v).replace(/"/g, '""')}"`
        })
        .join(',')
    )
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
